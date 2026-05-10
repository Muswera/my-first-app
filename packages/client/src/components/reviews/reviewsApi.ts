import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
   baseURL: API_URL,
});

export type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};
export type ReviewSummary = {
   id: number;
   productId: number;
   content: string;
   generatedAt: string;
   expiresAt: string;
};
export type GetReviewsResponse = {
   summary: ReviewSummary | null;
   reviews: Review[];
};
export type SummarizeResponse = {
   summary: string;
};

export const reviewsApi = {
   async fetchReviews(productId: number): Promise<GetReviewsResponse> {
      return api
         .get(`/api/products/${productId}/reviews`)
         .then((res) => res.data);
   },
   async SummarizeReviews(productId: number) {
      return api
         .post<SummarizeResponse>(
            `/api/products/${productId}/reviews/summarize`
         )
         .then((res) => res.data);
   },
};
