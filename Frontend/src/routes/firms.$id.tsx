import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, TrendingUp } from "lucide-react";
import { firmsService } from "@/services/firms.service";
import { reviewsService } from "@/services/reviews.service";
import { ReviewCard } from "@/components/ReviewCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/firms/$id")({
  component: FirmDetails,
});

function FirmDetails() {
  const { id } = Route.useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const firmQ = useQuery({
    queryKey: ["firm", id],
    queryFn: () => firmsService.getById(id).then((r) => r.data),
  });
  const reviewsQ = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewsService.listByFirm(id).then((r) => r.data),
  });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const createReview = useMutation({
    mutationFn: () => reviewsService.create({ firmId: id, rating, comment }),
    onSuccess: () => {
      toast.success("Review posted");
      setComment("");
      qc.invalidateQueries({ queryKey: ["reviews", id] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed to post review"),
  });

  const deleteReview = useMutation({
    mutationFn: (rid: string) => reviewsService.remove(rid),
    onSuccess: () => {
      toast.success("Review deleted");
      qc.invalidateQueries({ queryKey: ["reviews", id] });
    },
  });

  if (firmQ.isLoading) return <LoadingSpinner label="Loading firm..." />;
  if (firmQ.isError || !firmQ.data)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Firm not found.</p>
        <Button className="mt-4" onClick={() => router.navigate({ to: "/dashboard" })}>
          Back to firms
        </Button>
      </div>
    );

  const f = firmQ.data?.firm;
  console.log("Firm Data:", firmQ.data);

  const specs: [string, string | number | boolean | undefined][] = [
    ["Account Type", f.accountType],
    ["Challenge Fee", `$${f.challengeFee}`],
    ["Profit Split", `${f.profitSplit}%`],
    ["Daily Drawdown", `${f.dailyDrawdown}%`],
    ["Overall Drawdown", `${f.overallDrawdown}%`],
    ["Drawdown Type", f.drawdownType],
    ["News Trading", f.newsTrading ? "Allowed" : "Not Allowed"],
    ["Weekend Holding", f.weekendHolding ? "Allowed" : "Not Allowed"],
    ["Payout Frequency", f.payoutFrequency],
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-foreground">{f.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{f.accountType}</p>
        </div>
        <div className="flex items-center gap-3">
          {typeof f.recommendationScore === "number" && (
            <Badge className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Score {f.recommendationScore.toFixed(1)}
            </Badge>
          )}
          <Link to="/compare" search={{ ids: f._id }}>
            <Button variant="outline">Compare</Button>
          </Link>
        </div>
      </header>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Firm Specifications</h2>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {specs.map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
              <dd className="font-semibold text-foreground">{String(v)}</dd>
            </div>
          ))}
        </dl>
        {f.description && (
          <>
            <h3 className="mt-6 font-semibold text-foreground">Description</h3>
            <p className="mt-2 text-sm text-foreground/90 whitespace-pre-line">{f.description}</p>
          </>
        )}
      </section>

      {/* REVIEWS */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Reviews</h2>

        {isAuthenticated ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!comment.trim()) return toast.error("Add a comment");
              createReview.mutate();
            }}
            className="rounded-xl border border-border bg-card p-5 mb-6"
          >
            <p className="font-medium text-foreground mb-3">Leave a review</p>
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} stars`}
                >
                  <Star
                    className={`h-5 w-5 ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
            />
            <div className="mt-3 flex justify-end">
              <Button type="submit" disabled={createReview.isPending}>
                {createReview.isPending ? "Posting..." : "Post Review"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-5 mb-6 text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">Login</Link> to leave a review.
          </div>
        )}

        {reviewsQ.isLoading ? (
          <LoadingSpinner />
        ) : (reviewsQ.data ?? []).length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No reviews yet. Be the first!
          </div>
        ) : (
          <div className="grid gap-3">
            {(reviewsQ.data?.reviews ?? []).map((r) => {
              const ownerId = typeof r.user === "object" ? r.user?._id : r.user;
              const canDelete = !!user && (user.id === ownerId || user.role === "admin");
              return (
                <ReviewCard
                  key={r._id}
                  review={r}
                  canDelete={canDelete}
                  onDelete={(rid) => deleteReview.mutate(rid)}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
