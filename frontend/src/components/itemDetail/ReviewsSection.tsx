import { useEffect, useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';
import { formatDate as formatDateIntl } from '@/utils/formatDate';
import reviewService from '@/services/review.service';
import { Review } from '@/types/rentals';

interface ReviewsSectionProps {
  productId: string;
  average_rating?: number;
}

export default function ReviewsSection({
  productId,
  average_rating = 0,
}: ReviewsSectionProps) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    reviewService.getProductReviews(productId)
      .then(({ reviews, count }) => {
        if (!cancelled) {
          setReviews(reviews);
          setCount(count);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReviews([]);
          setCount(0);
        }
      });
    return () => { cancelled = true; };
  }, [productId]);

  // Format rating safely
  const displayRating = () => {
    const rating = Number(average_rating);
    return Number.isNaN(rating) ? '0.0' : rating.toFixed(1);
  };

  const formatDate = (dateStr: string) => formatDateIntl(dateStr);

  return (
    <section className="mt-10 bg-gradient-to-b from-green-50/50 to-white rounded-xl shadow-sm border border-green-100 p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-800 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <span>{t('review.reviewsCount', { rating: displayRating(), count })}</span>
        </h2>
        <Button
          variant="outline"
          className="hidden sm:block bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border border-green-200"
        >
          {t('review.viewAll')}
        </Button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="pb-4 sm:pb-6 border-b border-green-100 last:border-0 last:pb-0">
              <div className="flex items-start gap-3 sm:gap-5">
                <Avatar className="mr-2 sm:mr-4 h-10 w-10 sm:h-12 sm:w-12 border-2 border-green-100">
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {review.reviewer_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2 sm:mb-3">
                    <div>
                      <h4 className="text-lg sm:text-xl font-medium text-green-800 mb-1">{review.reviewer_name}</h4>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-gray-500">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-1 text-sm/6 italic sm:text-base/7 text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-10 w-10 text-green-200 mb-3" />
            <p className="text-green-700 font-medium">{t('review.noReviews')}</p>
            <p className="text-sm text-gray-500 mt-1">
              {t('review.beFirstProduct')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
