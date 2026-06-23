import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — PropCompare" }] }),
  component: () => (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  ),
});

function ProfilePage() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-xl border border-border bg-card p-8">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary text-2xl font-bold">
            {(user?.username ?? user?.email ?? "?").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground truncate">
              {user?.username ?? "Trader"}
            </h1>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            <Badge variant={isAdmin ? "default" : "secondary"} className="mt-2">
              {isAdmin ? "Admin" : "User"}
            </Badge>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {isAdmin && (
            <Button variant="outline" onClick={() => navigate({ to: "/admin" })}>
              Admin Dashboard
            </Button>
          )}
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </div>
  );
}
