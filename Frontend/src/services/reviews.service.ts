import api from "@/api/axios";

export interface Review {
  _id: string;
  firmId: string;
  user: { _id: string; username: string } | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewPayload {
  firmId: string;
  rating: number;
  comment: string;
}

export const reviewsService = {
  create: (data: ReviewPayload) => api.post<Review>("/reviews", data),
  listByFirm: (firmId: string) => api.get<Review[]>(`/reviews/firm/${firmId}`),
  remove: (id: string) => api.delete(`/reviews/${id}`),
};
