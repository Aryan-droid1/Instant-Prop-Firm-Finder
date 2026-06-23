import { Link } from "@tanstack/react-router";
import { ArrowRight, TrendingUp } from "lucide-react";
import type { Firm } from "@/services/firms.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  firm: Firm;
  onCompareToggle?: (id: string) => void;
  selected?: boolean;
}

export function FirmCard({ firm, onCompareToggle, selected }: Props) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:border-primary/40">
      {typeof firm.recommendationScore === "number" && (
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
          <TrendingUp className="h-3 w-3" />
          {firm.recommendationScore.toFixed(1)}
        </div>
      )}
      <h3 className="text-lg font-bold text-foreground pr-12">{firm.name}</h3>
      <p className="text-xs text-muted-foreground mt-1">{firm.accountType}</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Stat label="Fee" value={`$${firm.challengeFee}`} />
        <Stat label="Profit Split" value={`${firm.profitSplit}%`} />
        <Stat label="Daily DD" value={`${firm.dailyDrawdown}%`} />
        <Stat label="Overall DD" value={`${firm.overallDrawdown}%`} />
      </dl>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge variant="secondary">{firm.drawdownType}</Badge>
        <Badge variant={firm.newsTrading ? "default" : "outline"}>
          {firm.newsTrading ? "News ✓" : "No News"}
        </Badge>
        <Badge variant={firm.weekendHolding ? "default" : "outline"}>
          {firm.weekendHolding ? "Weekend ✓" : "No Weekend"}
        </Badge>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <Link to="/firms/$id" params={{ id: firm._id }} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            Details <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
        {onCompareToggle && (
          <Button
            variant={selected ? "default" : "secondary"}
            size="sm"
            onClick={() => onCompareToggle(firm._id)}
          >
            {selected ? "Selected" : "Compare"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground truncate">{value}</dd>
    </div>
  );
}
