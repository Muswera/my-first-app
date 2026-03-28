import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { productRepository } from '../repositories/product.repository';
import { reviewRepository } from '../repositories/review.repository';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
      //const prisma = new PrismaClient();
      const productId = Number(req.params.id);
      try {
         if (isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
         }

         const product = await productRepository.getProduct(productId);
         if (!product) {
            res.status(404).json({ error: 'Product does not exist' });
            return;
         }
         const reviews = await reviewRepository.getReviews(productId);
         const summary = await reviewRepository.getReviewSummary(productId);

         res.json({
            summary,
            reviews,
         });
      } catch (error) {
         console.error(
            `Error fetching reviews for product: ${productId}`,
            error
         );
         res.status(500).json({ error: 'Internal server error' });
      }
   },
   async summarizeReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);
      try {
         if (isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
         }
         const product = await productRepository.getProduct(productId);
         if (!product) {
            return res.status(404).json({ error: 'Invalid product' });
         }
         const reviews = await reviewRepository.getReviews(productId, 1);
         if (!reviews.length) {
            res.status(400).json({
               error: 'There are no reviews to summarize',
            });
            return;
         }
         const summary = await reviewService.summerizeReviews(productId);
         res.json({ summary });
      } catch (error) {
         console.log(
            `Error summarizing reviews for product: ${productId}`,
            error
         );
         res.status(500).json({ Error: 'Internal server error' });
      }
   },
};
