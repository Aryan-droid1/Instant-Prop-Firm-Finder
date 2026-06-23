import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { firmsService, type Firm, type FirmPayload } from "@/services/firms.service";
import { AdminRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — PropCompare" }] }),
  component: () => (
    <AdminRoute>
      <AdminPage />
    </AdminRoute>
  ),
});

const empty: FirmPayload = {
  name: "",
  accountType: "",
  challengeFee: 0,
  profitSplit: 80,
  dailyDrawdown: 5,
  overallDrawdown: 10,
  drawdownType: "static",
  newsTrading: false,
  weekendHolding: false,
  consistencyRule: 0,
  payoutFrequency: "biweekly",
  description: "",
};

function AdminPage() {
  const qc = useQueryClient();
  const firmsQ = useQuery({
    queryKey: ["firms"],
    queryFn: () => firmsService.getAll().then((r) => r.data),
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Firm | null>(null);
  const [form, setForm] = useState<FirmPayload>(empty);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };
  const openEdit = (f: Firm) => {
    setEditing(f);
    const { _id, recommendationScore, ...rest } = f;
    setForm(rest);
    setOpen(true);
  };

  const save = useMutation({
    mutationFn: () =>
      editing ? firmsService.update(editing._id, form) : firmsService.create(form),
    onSuccess: () => {
      toast.success(editing ? "Firm updated" : "Firm created");
      qc.invalidateQueries({ queryKey: ["firms"] });
      setOpen(false);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Save failed"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => firmsService.remove(id),
    onSuccess: () => {
      toast.success("Firm deleted");
      qc.invalidateQueries({ queryKey: ["firms"] });
    },
  });

  const set = <K extends keyof FirmPayload>(k: K, v: FirmPayload[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Create, update, and remove prop firms.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> New Firm
        </Button>
      </header>

      {firmsQ.isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Fee</th>
                <th className="p-3 font-semibold">Split</th>
                <th className="p-3 font-semibold">Payout</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {(firmsQ.data ?? []).map((f) => (
                <tr key={f._id} className="border-b border-border last:border-0">
                  <td className="p-3 font-medium text-foreground">{f.name}</td>
                  <td className="p-3 text-muted-foreground">{f.accountType}</td>
                  <td className="p-3">${f.challengeFee}</td>
                  <td className="p-3">{f.profitSplit}%</td>
                  <td className="p-3">{f.payoutFrequency}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(f)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Delete ${f.name}?`)) remove.mutate(f._id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
              {(firmsQ.data ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-muted-foreground text-sm">
                    No firms yet. Click "New Firm" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Firm" : "Create Firm"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Field label="Name">
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </Field>
            <Field label="Account Type">
              <Input
                value={form.accountType}
                onChange={(e) => set("accountType", e.target.value)}
                required
              />
            </Field>
            <Field label="Challenge Fee ($)">
              <Input
                type="number"
                value={form.challengeFee}
                onChange={(e) => set("challengeFee", Number(e.target.value))}
              />
            </Field>
            <Field label="Profit Split (%)">
              <Input
                type="number"
                value={form.profitSplit}
                onChange={(e) => set("profitSplit", Number(e.target.value))}
              />
            </Field>
            <Field label="Daily Drawdown (%)">
              <Input
                type="number"
                value={form.dailyDrawdown}
                onChange={(e) => set("dailyDrawdown", Number(e.target.value))}
              />
            </Field>
            <Field label="Consistency Rule (%)">
              <Input
                type="String"
                value={form.consistencyRule}
                onChange={(e) => set("consistencyRule", Number(e.target.value))}
              />
            </Field>
            <Field label="Overall Drawdown (%)">
              <Input
                type="number"
                value={form.overallDrawdown}
                onChange={(e) => set("overallDrawdown", Number(e.target.value))}
              />
            </Field>
            <Field label="Drawdown Type">
              <Input
                value={form.drawdownType}
                onChange={(e) => set("drawdownType", e.target.value)}
              />
            </Field>
            <Field label="Payout Frequency">
              <Input
                value={form.payoutFrequency}
                onChange={(e) => set("payoutFrequency", e.target.value)}
              />
            </Field>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label>News Trading</Label>
              <Switch checked={form.newsTrading} onCheckedChange={(v) => set("newsTrading", v)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label>Weekend Holding</Label>
              <Switch
                checked={form.weekendHolding}
                onCheckedChange={(v) => set("weekendHolding", v)}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={form.description ?? ""}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
            <DialogFooter className="md:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
