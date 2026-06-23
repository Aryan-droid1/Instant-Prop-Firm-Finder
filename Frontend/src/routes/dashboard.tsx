import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { firmsService, type Firm } from "@/services/firms.service";
import { FirmCard } from "@/components/FirmCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar, type Filters } from "@/components/FilterSidebar";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "All Firms — PropCompare" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["firms"],
    queryFn: () => firmsService.getAll().then((r) => r.data),
  });

  const firms: Firm[] = useMemo(() => {
    let list = data ?? [];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) => f.name.toLowerCase().includes(q) || f.accountType?.toLowerCase().includes(q),
      );
    }
    if (filters.minProfitSplit) list = list.filter((f) => f.profitSplit >= filters.minProfitSplit!);
    if (filters.maxFee) list = list.filter((f) => f.challengeFee <= filters.maxFee!);
    if (filters.drawdownType) list = list.filter((f) => f.drawdownType === filters.drawdownType);
    if (filters.newsTrading) list = list.filter((f) => f.newsTrading);
    if (filters.weekendHolding) list = list.filter((f) => f.weekendHolding);
    return list;
  }, [data, search, filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">All Prop Firms</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse every firm in our database and filter by what matters to you.
        </p>
      </header>

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters({})} />
        <div>
          {isLoading ? (
            <LoadingSpinner label="Loading firms..." />
          ) : isError ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
              Failed to load firms. Check VITE_API_BASE_URL and that the backend is reachable.
            </div>
          ) : firms.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No firms match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {firms.map((f) => <FirmCard key={f._id} firm={f} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
