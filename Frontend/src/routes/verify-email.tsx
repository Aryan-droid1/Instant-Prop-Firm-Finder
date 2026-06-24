import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: String(search.email ?? ""),
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const navigate = useNavigate();

  const { email } = Route.useSearch();

  const { verifyEmail, resendOTP } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      await verifyEmail({
        email,
        otp,
      });

      toast.success("Email verified successfully");

      navigate({
        to: "/login",
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);

      await resendOTP({
        email,
      });

      toast.success("OTP sent successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-xl border border-border bg-card p-8">
        <h1 className="text-2xl font-bold">Verify Email</h1>

        <p className="mt-2 text-sm text-muted-foreground">Enter the 6-digit code sent to:</p>

        <p className="font-medium break-all mt-1">{email}</p>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>OTP Code</Label>

            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? "Sending..." : "Resend OTP"}
        </Button>
      </div>
    </div>
  );
}
