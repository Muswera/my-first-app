import prisma from '../prisma';
import type { Review } from '@prisma/client';

export const reviewRepository = {
   async getReviews(productId: number): Promise<Review[]> {
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
      });
   },
};
