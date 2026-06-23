import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { firmsService, type Firm } from "@/services/firms.service";
import { FirmCard } from "@/components/FirmCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/recommend")({
  head: () => ({ meta: [{ title: "Recommendations — PropCompare" }] }),
  component: RecommendPage,
});

function RecommendPage() {
  const [prefs, setPrefs] = useState({
    profitSplit: 80,
    newsTrading: false,
    weekendHolding: false,
    drawdownType: "any",
  });
  const [results, setResults] = useState<Firm[] | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      firmsService
        .recommend({
          profitSplit: prefs.profitSplit,
          newsTrading: prefs.newsTrading,
          weekendHolding: prefs.weekendHolding,
          drawdownType: prefs.drawdownType === "any" ? undefined : prefs.drawdownType,
        })
        .then((r) => r.data),
    onSuccess: (data) => setResults(data),
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground">Get Recommendations</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Tell us your preferences and we'll rank the best matching prop firms.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="mt-6 rounded-xl border border-border bg-card p-6 grid md:grid-cols-2 gap-5"
      >
        <div className="space-y-2">
          <Label>Preferred Profit Split (%)</Label>
          <Input
            type="number"
            value={prefs.profitSplit}
            onChange={(e) => setPrefs({ ...prefs, profitSplit: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Drawdown Type</Label>
          <Select
            value={prefs.drawdownType}
            onValueChange={(v) => setPrefs({ ...prefs, drawdownType: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="static">Static</SelectItem>
              <SelectItem value="trailing">Trailing</SelectItem>
              <SelectItem value="EOD">EOD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <Label htmlFor="rn">News Trading</Label>
          <Switch
            id="rn"
            checked={prefs.newsTrading}
            onCheckedChange={(v) => setPrefs({ ...prefs, newsTrading: v })}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <Label htmlFor="rw">Weekend Holding</Label>
          <Switch
            id="rw"
            checked={prefs.weekendHolding}
            onCheckedChange={(v) => setPrefs({ ...prefs, weekendHolding: v })}
          />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={mutation.isPending} className="w-full md:w-auto">
            {mutation.isPending ? "Finding matches..." : "Recommend Firms"}
          </Button>
        </div>
      </form>

      {mutation.isError && (
        <p className="mt-4 text-sm text-destructive">Failed to load recommendations.</p>
      )}

      {results && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Top Matches ({results.length})
          </h2>
          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No firms match your preferences. Try relaxing some filters.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((f, i) => (
                <div key={f._id} className="relative">
                  <div className="absolute -top-2 -left-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow">
                    #{i + 1}
                  </div>
                  <FirmCard firm={f} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
