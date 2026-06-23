import { Star, Trash2 } from "lucide-react";
import type { Review } from "@/services/reviews.service";
import { Button } from "@/components/ui/button";

interface Props {
  review: Review;
  canDelete?: boolean;
  onDelete?: (id: string) => void;
}

export function ReviewCard({ review, canDelete, onDelete }: Props) {
  const username =
    typeof review.user === "object" && review.user ? review.user.username : "Anonymous";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">{username}</p>
          <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            ))}
          </div>
        </div>
        {canDelete && onDelete && (
          <Button variant="ghost" size="icon" onClick={() => onDelete(review._id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="mt-3 text-sm text-foreground/90 whitespace-pre-line">{review.comment}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
