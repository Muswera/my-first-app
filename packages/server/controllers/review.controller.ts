import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
      //const prisma = new PrismaClient();
      const productId = Number(req.params.id);
      try {
         if (isNaN(productId))
            return res.status(400).json({ error: 'Invalid product ID' });

         const reviews = await reviewService.getReviews(productId);

         res.json(reviews);
      } catch (error) {
         console.error(
            `Error fetching reviews for product: ${productId}`,
            error
         );
         res.status(500).json({ error: 'Internal server error' });
      }
   },
};
