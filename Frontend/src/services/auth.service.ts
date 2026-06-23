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

export const authService = {
  register: (data: RegisterPayload) => api.post("/auth/register", data),
  login: (data: LoginPayload) => api.post("/auth/login", data),
};
