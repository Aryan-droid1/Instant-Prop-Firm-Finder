import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { firmsService, type Firm } from "@/services/firms.service";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Search {
  ids?: string;
}

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [{ title: "Compare Firms — PropCompare" }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    ids: typeof s.ids === "string" ? s.ids : undefined,
  }),
  component: ComparePage,
});

function ComparePage() {
  const search = Route.useSearch();
  const initialIds = useMemo(
    () => (search.ids ? search.ids.split(",").filter(Boolean) : []),
    [search.ids],
  );
  const [selected, setSelected] = useState<string[]>(initialIds);

  const allQ = useQuery({
    queryKey: ["firms"],
    queryFn: () => firmsService.getAll().then((r) => r.data),
  });

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const selectedFirms: Firm[] = (allQ.data ?? []).filter((f) => selected.includes(f._id));

  const rows: { label: string; render: (f: Firm) => React.ReactNode }[] = [
    { label: "Challenge Fee", render: (f) => `$${f.challengeFee}` },
    { label: "Profit Split", render: (f) => `${f.profitSplit}%` },
    { label: "Daily Drawdown", render: (f) => `${f.dailyDrawdown}%` },
    { label: "Overall Drawdown", render: (f) => `${f.overallDrawdown}%` },
    { label: "Drawdown Type", render: (f) => f.drawdownType },
    { label: "News Trading", render: (f) => (f.newsTrading ? "✓" : "✗") },
    { label: "Weekend Holding", render: (f) => (f.weekendHolding ? "✓" : "✗") },
    { label: "Payout Frequency", render: (f) => f.payoutFrequency },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground">Compare Firms</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Select firms below to view a side-by-side comparison.
      </p>

      {allQ.isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="mt-6 rounded-xl border border-border bg-card p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {(allQ.data ?? []).map((f) => (
              <label
                key={f._id}
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted/50 cursor-pointer"
              >
                <Checkbox
                  checked={selected.includes(f._id)}
                  onCheckedChange={() => toggle(f._id)}
                />
                <span className="text-sm font-medium text-foreground truncate">{f.name}</span>
              </label>
            ))}
          </div>

          {selectedFirms.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Select at least one firm to start comparing.
            </div>
          ) : (
            <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-semibold text-foreground sticky left-0 bg-muted/30">
                      Metric
                    </th>
                    {selectedFirms.map((f) => (
                      <th key={f._id} className="text-left p-4 font-semibold text-foreground">
                        {f.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-b border-border last:border-0">
                      <td className="p-4 text-muted-foreground sticky left-0 bg-card">{row.label}</td>
                      {selectedFirms.map((f) => (
                        <td key={f._id} className="p-4 font-medium text-foreground">
                          {row.render(f)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedFirms.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setSelected([])}>
                Clear selection
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
