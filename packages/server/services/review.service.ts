import fs from 'fs';
import path from 'path';
import { type Review } from '@prisma/client';
import { reviewRepository } from '../repositories/review.repository.ts';
import { llmClient } from '../llm/client';
import { text } from 'stream/consumers';

console.log('REPO KEYS:', Object.keys(reviewRepository));

const template = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'summarize-reviews.txt'),
   'utf-8'
);

export const reviewService = {
   async summerizeReviews(productId: number): Promise<string> {
      const existingSummary =
         await reviewRepository.getReviewSummary(productId);
      if (existingSummary) {
         return existingSummary;
      }
      const reviews = await reviewRepository.getReviews(productId, 10);
      reviews.map((r) => r.content).join('\n\n');
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      const prompt = template.replace('{{reviews}}', joinedReviews);

      const { text: summary } = await llmClient.generateText({
         model: 'gpt-4.1',
         prompt,
         temperature: 0.2,
         maxTokens: 500,
      });

      await reviewRepository.storeReviewSummary(productId, summary);
      return summary;
   },
};
