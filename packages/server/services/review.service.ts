import { type Review } from '@prisma/client';
import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },
   async summerizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviews(productId, 10);
      reviews.map((r) => r.content).join('\n\n');
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      const prompt = `
       summarize the following customer reviews into a short paragraph
       highlighting themes both positive and negative:
       
   ${joinedReviews}
      `;

      const response = await llmClient.generateText({
         model: 'gpt-4.1',
         prompt,
         temperature: 0.2,
         maxTokens: 500,
      });
      return response.text;
   },
};
