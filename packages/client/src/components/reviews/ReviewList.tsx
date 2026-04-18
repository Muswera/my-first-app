import axios from 'axios';
import StarRating from './StarRating';
import { HiSparkles } from 'react-icons/hi2';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useState } from 'react';
import ReviewSkeleton from './ReviewSkeleton';

type Props = {
   productId: number;
};

type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};
type ReviewSummary = {
   id: number;
   productId: number;
   content: string;
   generatedAt: string;
   expiresAt: string;
};
type GetReviewsResponse = {
   summary: ReviewSummary | null;
   reviews: Review[];
};
type SummarizeResponse = {
   summary: string;
};
const ReviewList = ({ productId }: Props) => {
   const [isSummaryLoading, setIsSummaryLoading] = useState(false);
   const queryClient = useQueryClient();
   const [summaryError, setSummaryError] = useState('');
   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };
   const {
      data: reviewData,
      isLoading,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: fetchReviews,
   });
   const handleSummarize = async () => {
      try {
         setIsSummaryLoading(true);
         setSummaryError('');

         const { data } = await axios.post<SummarizeResponse>(
            `/api/products/${productId}/reviews/summarize`
         );
         queryClient.setQueryData(
            ['reviews', productId],
            (oldData: GetReviewsResponse | undefined) => {
               if (!oldData) return oldData;

               return {
                  ...oldData,
                  summary: data,
               };
            }
         );
      } catch (error) {
         console.error(error);
         setSummaryError('Could not summarize the reviews. Try again');
      } finally {
         setIsSummaryLoading(false);
      }
   };

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <ReviewSkeleton key={i} />
            ))}
         </div>
      );
   }
   if (error) {
      console.error(error);
      return (
         <p className="text-red-500">Could not fetch the reviews. Try again.</p>
      );
   }
   if (!reviewData?.reviews.length) {
      return null;
   }
   const isExpired =
      reviewData?.summary &&
      new Date(reviewData.summary.expiresAt).getTime() < Date.now();
   return (
      <div>
         <div className="mb-5">
            {reviewData?.summary && !isExpired ? (
               <p>{reviewData.summary.content}</p>
            ) : (
               <div>
                  <Button
                     onClick={handleSummarize}
                     className="cursor-pointer"
                     disabled={isSummaryLoading}
                  >
                     <HiSparkles />
                     Summarize
                  </Button>
                  {isSummaryLoading && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {summaryError && (
                     <p className="text-red-500">{summaryError}</p>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewData?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     <StarRating value={review.rating} />
                  </div>
                  <p className="py-2">{review.content}</p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;
