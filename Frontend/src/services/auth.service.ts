import api from "@/api/axios";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ResendOTPPayload {
  email: string;
}

export const authService = {
  register: (data: RegisterPayload) => api.post("/auth/register", data),

  login: (data: LoginPayload) => api.post("/auth/login", data),

  verifyEmail: (data: VerifyEmailPayload) => api.post("/auth/verify-email", data),

  resendOTP: (data: ResendOTPPayload) => api.post("/auth/resend-otp", data),
};
