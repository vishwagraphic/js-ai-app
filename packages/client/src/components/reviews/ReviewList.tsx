import axios from 'axios';
import { useState } from 'react';
import StarRating from './StarRating';

import { HiMiniSparkles } from 'react-icons/hi2';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
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

type GetReviewResponse = {
  summary: string;
  reviews: Review[];
};

type summaryResponse = {
  summary: string;
};

const ReviewList = ({ productId }: Props) => {
  const fetchReview = async () => {
    const { data } = await axios.get<GetReviewResponse>(
      `api/products/${productId}/reviews`
    );
    return data;
  };

  const summarizeReviews = async () => {
        const { data } = await axios.post<summaryResponse>(
        `api/products/${productId}/reviews/summarize`
        );

        return data
  };

  const {
    mutate: handleSummarize,
    isPending: isSummaryLoading,
    isError: isSummaryError,
    data: summarizeResponse
  } = useMutation<summaryResponse>({
    mutationFn: () => summarizeReviews(),
  })
  const {
    data: reviewData,
    isLoading,
    error,
  } = useQuery<GetReviewResponse>({
    queryKey: ['review', productId],
    queryFn: () => fetchReview(),
  });

  const currentSummary = reviewData?.summary || summarizeResponse?.summary;

  if (error) {
    return (
      <p className="flex flex-col gap-2 text-red-600">
        {error && `Could not fetch reviews`}
      </p>
    );
  }

  if (reviewData && reviewData?.reviews?.length < 1) {
    return null;
  }
  return isLoading ? (
    <div>
      {[1, 2, 3].map((i: any) => {
        return (
          <div className="flex flex-col gap-2">
            <div key={i} className="mb-4">
              <ReviewSkeleton key={i} />
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <div>
            <h2 className="font-bold">Summary</h2>
            <p>{currentSummary}</p>
          </div>
        ) : (
          <div>
            {isSummaryLoading ? (
              <div>
                <ReviewSkeleton key={1} />
              </div>
            ) : (
              <Button onClick={() => handleSummarize()}>
                <HiMiniSparkles /> Summarize
              </Button>
            )}

{isSummaryError && <div className='text-red-500'>Could not load summary. Try again</div>}
          </div>
        )}
        
      </div>
      {reviewData?.reviews.map((review) => {
        return (
          <div className="flex flex-col gap-2">
            <div key={review.id} className="mb-4">
              <div className="font-semibold">{review.author}</div>
              <div>
                <StarRating value={review.rating} />
              </div>
              <div className="py-2">{review.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
