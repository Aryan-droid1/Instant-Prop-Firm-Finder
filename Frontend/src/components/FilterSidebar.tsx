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

export interface Filters {
  minProfitSplit?: number;
  maxFee?: number;
  drawdownType?: string;
  newsTrading?: boolean;
  weekendHolding?: boolean;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}

export function FilterSidebar({ filters, onChange, onReset }: Props) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <aside className="rounded-xl border border-border bg-card p-5 space-y-5 h-fit">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Min Profit Split (%)</Label>
        <Input
          type="number"
          value={filters.minProfitSplit ?? ""}
          onChange={(e) =>
            set("minProfitSplit", e.target.value ? Number(e.target.value) : undefined)
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Max Challenge Fee ($)</Label>
        <Input
          type="number"
          value={filters.maxFee ?? ""}
          onChange={(e) => set("maxFee", e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      <div className="space-y-2">
        <Label>Drawdown Type</Label>
        <Select
          value={filters.drawdownType ?? "any"}
          onValueChange={(v) => set("drawdownType", v === "any" ? undefined : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="static">Static</SelectItem>
            <SelectItem value="trailing">Trailing</SelectItem>
            <SelectItem value="EOD">EOD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="news">News Trading</Label>
        <Switch
          id="news"
          checked={!!filters.newsTrading}
          onCheckedChange={(v) => set("newsTrading", v || undefined)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="weekend">Weekend Holding</Label>
        <Switch
          id="weekend"
          checked={!!filters.weekendHolding}
          onCheckedChange={(v) => set("weekendHolding", v || undefined)}
        />
      </div>
    </aside>
  );
}
