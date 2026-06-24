import * as React from "react";
import { createContext, useContext, useState, useCallback } from "react";

import {
  authService,
  type LoginPayload,
  type RegisterPayload,
  type VerifyEmailPayload,
  type ResendOTPPayload,
} from "@/services/auth.service";

export interface AuthUser {
  id: string;
  username?: string;
  email?: string;
  role?: "user" | "admin";
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;

  login: (payload: LoginPayload) => Promise<void>;

  register: (payload: RegisterPayload) => Promise<void>;

  verifyEmail: (payload: VerifyEmailPayload) => Promise<void>;

  resendOTP: (payload: ResendOTPPayload) => Promise<void>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [loading] = useState(false);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await authService.login(payload);

    setUser(res.data.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    await authService.register(payload);
  }, []);

  const verifyEmail = useCallback(async (payload: VerifyEmailPayload) => {
    await authService.verifyEmail(payload);
  }, []);

  const resendOTP = useCallback(async (payload: ResendOTPPayload) => {
    await authService.resendOTP(payload);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",

    login,
    register,
    verifyEmail,
    resendOTP,

    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
