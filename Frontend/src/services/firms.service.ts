import api from "@/api/axios";

export interface Firm {
  _id: string;
  name: string;
  accountType: string;
  challengeFee: number;
  profitSplit: number;
  dailyDrawdown: number;
  overallDrawdown: number;
  drawdownType: string;
  newsTrading: boolean;
  weekendHolding: boolean;
  payoutFrequency: string;
  description?: string;
  recommendationScore?: number;
}

export type FirmPayload = Omit<Firm, "_id" | "recommendationScore">;

export const firmsService = {
  getAll: () => api.get<Firm[]>("/firms/AllFirms"),
  getById: (id: string) => api.get<Firm>(`/firms/${id}`),
  create: (data: FirmPayload) => api.post<Firm>("/firms", data),
  update: (id: string, data: Partial<FirmPayload>) => api.put<Firm>(`/firms/${id}`, data),
  remove: (id: string) => api.delete(`/firms/${id}`),
  search: (q: string) => api.get<Firm[]>("/firms/search", { params: { q } }),
  filter: (params: Record<string, string | number | boolean | undefined>) =>
    api.get<Firm[]>("/firms/filter", { params }),
  compare: (ids: string[]) => api.get<Firm[]>("/firms/compare", { params: { ids: ids.join(",") } }),
  recommend: (prefs: Record<string, string | number | boolean | undefined>) =>
    api.get<Firm[]>("/firms/recommend", { params: prefs }),
};
