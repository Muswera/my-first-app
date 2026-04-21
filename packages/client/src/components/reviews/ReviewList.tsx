import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { HiSparkles } from 'react-icons/hi2';

import { Button } from '../ui/button';
import ReviewSkeleton from './ReviewSkeleton';
import StarRating from './StarRating';
import {
   reviewsApi,
   type GetReviewsResponse,
   type SummarizeResponse,
} from './reviewsApi';

type Props = {
   productId: number;
};

const ReviewList = ({ productId }: Props) => {
   const queryClient = useQueryClient();
   const [isSummaryOpen, setIsSummaryOpen] = useState(false);

   const {
      data: reviewData,
      isLoading,
      isError,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => reviewsApi.fetchReviews(productId),
   });
   const {
      mutate: handleSummarize,
      isPending: isSummaryLoading,
      isError: isSummaryError,
      error: summaryError,
   } = useMutation<SummarizeResponse>({
      mutationFn: () => reviewsApi.SummarizeReviews(productId),
      onSuccess: async () => {
         await queryClient.invalidateQueries({
            queryKey: ['reviews', productId],
         });

         setIsSummaryOpen(true);
      },
   });

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((item) => (
               <ReviewSkeleton key={item} />
            ))}
         </div>
      );
   }
   if (isError) {
      console.error(error);

      const errorMessage = axios.isAxiosError(error)
         ? error.response?.data?.message || error.message
         : 'Could not fetch reviews. Please try again';
      return <p className="text-red-500">{errorMessage}</p>;
   }
   if (!reviewData?.reviews.length) {
      return (
         <p className="text-sm text-muted-foreground">
            No reviews avaialble for this product
         </p>
      );
   }
   const currentSummary = reviewData.summary?.content ?? null;

   const summaryErrorMessage = axios.isAxiosError(summaryError)
      ? summaryError.response?.data?.message || summaryError.message
      : 'Could not summarize reviews. Please try again.';

   return (
      <div className="space-y-6">
         <div className="mb-5">
            {currentSummary ? (
               <div className="space-y-3 pl-4">
                  <Button
                     type="button"
                     variant="ghost"
                     onClick={() => setIsSummaryOpen((prev) => !prev)}
                     className="inline-flex items-center gap-2 rounded-md border px-4 py-2 font-semibold"
                  >
                     <HiSparkles className="text-lg" />
                     Review Summary
                  </Button>
                  {isSummaryOpen && (
                     <div className=" px-1 py-1">
                        <p className="text-sm leading-6 text-muted-foreground">
                           {currentSummary}
                        </p>
                     </div>
                  )}
               </div>
            ) : (
               <div className="space-y-3">
                  <Button
                     onClick={() => handleSummarize()}
                     disabled={isSummaryLoading}
                     className="cursor-pointer"
                  >
                     <HiSparkles className="mr-2" />
                     {isSummaryLoading ? 'Summarizing...' : 'Summarize reviews'}
                  </Button>
                  {isSummaryLoading && <ReviewSkeleton />}
                  {isSummaryError && (
                     <p className=" text-sm text-red-500">
                        {summaryErrorMessage}
                     </p>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-3">
            {reviewData.reviews.map((review) => (
               <div key={review.id} className="rounded-lg p-4 ">
                  <div>
                     <h4 className="font-semibold">{review.author}</h4>
                     <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                     </p>
                     <div className="mt-2">
                        <StarRating value={review.rating} />
                     </div>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                     {review.content}
                  </p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;
