import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BarChart3, Shield, Sparkles, TrendingUp } from "lucide-react";
import { firmsService } from "@/services/firms.service";
import { FirmCard } from "@/components/FirmCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PropCompare — Find Your Best Prop Firm" },
      {
        name: "description",
        content:
          "Compare prop trading firms by fees, profit splits, drawdowns and rules. Read reviews and get personalised recommendations.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { data } = useQuery({
    queryKey: ["firms", "featured"],
    queryFn: () => firmsService.getAll().then((r) => r.data),
  });
  const featured = (data ?? []).slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_color-mix(in_oklab,var(--primary)_18%,transparent),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Smarter prop firm decisions
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-black tracking-tight text-foreground">
            Compare prop firms.
            <br />
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Trade with confidence.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">
            Side-by-side comparisons, real reviews, and personalised recommendations across the top
            prop trading firms.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard">
              <Button size="lg">
                Browse Firms <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/recommend">
              <Button size="lg" variant="outline">
                Get Recommendations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-3 gap-6">
        {[
          { icon: BarChart3, title: "Data-Driven Comparison", desc: "All key metrics in one place — fees, splits, drawdowns and rules." },
          { icon: Shield, title: "Trusted Reviews", desc: "Honest feedback from real funded traders." },
          { icon: TrendingUp, title: "Smart Recommendations", desc: "Get firms matched to your trading style and preferences." },
        ].map((b) => (
          <div key={b.title} className="rounded-xl border border-border bg-card p-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <b.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">{b.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Firms</h2>
            <p className="text-sm text-muted-foreground mt-1">Top-rated prop firms this month.</p>
          </div>
          <Link to="/dashboard" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Connect your backend to see featured firms here.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {featured.map((f) => <FirmCard key={f._id} firm={f} />)}
          </div>
        )}
      </section>
    </div>
  );
}
