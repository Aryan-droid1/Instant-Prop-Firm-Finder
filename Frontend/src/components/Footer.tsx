import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            PropCompare
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Compare prop trading firms by fees, profit splits, drawdowns and more. Find the firm
            that fits your strategy.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/dashboard" className="hover:text-foreground">All Firms</Link></li>
            <li><Link to="/compare" className="hover:text-foreground">Compare</Link></li>
            <li><Link to="/recommend" className="hover:text-foreground">Recommendations</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/login" className="hover:text-foreground">Login</Link></li>
            <li><Link to="/register" className="hover:text-foreground">Register</Link></li>
            <li><Link to="/profile" className="hover:text-foreground">Profile</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PropCompare. All rights reserved.
      </div>
    </footer>
  );
}
