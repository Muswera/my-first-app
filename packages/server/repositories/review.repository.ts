import dayjs from 'dayjs';
import prisma from '../prismaClient.ts';
import type { Review } from '@prisma/client';

console.log('LOADED review.repository.ts');

export const reviewRepository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit,
      });
   },
   storeReviewSummary(productId: number, summary: string) {
      const now = new Date();
      const expiresAt = dayjs().add(7, 'days').toDate();
      const data = {
         content: summary,
         expiresAt,
         generatedAt: now,
         productId,
      };
      return prisma.summary.upsert({
         where: { productId },
         create: data,
         update: data,
      });
   },
   getReviewSummary(productId: number) {
      return prisma.summary.findUnique({ where: { productId } });
   },
};
