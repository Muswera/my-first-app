import fs from 'fs';
import path from 'path';
import { type Review } from '@prisma/client';
import { reviewRepository } from '../repositories/review.repository.ts';
import { llmClient } from '../llm/client.ts';

console.log('REPO KEYS:', Object.keys(reviewRepository));

const template = fs.readFileSync(
   path.join(__dirname, '..', 'llm', 'prompts', 'summarize-reviews.txt'),
   'utf-8'
);

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },
   async summarizeReviews(productId: number): Promise<string> {
      //1. check for existing catched summary
      const existingSummary =
         await reviewRepository.getReviewSummary(productId);
      if (existingSummary && existingSummary.expiresAt > new Date()) {
         console.log('Returning catched summary');
         return existingSummary.content;
      }
      // 2.Fetch for latest reviews
      const reviews = await reviewRepository.getReviews(productId, 10);
      if (!reviews.length) {
         throw new Error('No reviews available to summarize');
      }
      // Build prompt
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      //const prompt = template.replace('{{reviews}}', joinedReviews);
      // 4. Generate summary using LLM
      const summary = await llmClient.summarizeReviews(joinedReviews);
      // 5. Store summary for caching
      await reviewRepository.storeReviewSummary(productId, summary);
      return summary;
   },
};
