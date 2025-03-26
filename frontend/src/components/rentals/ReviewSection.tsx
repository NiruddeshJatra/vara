// components/rentals/ReviewSection.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface Review {
  id: number;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  itemId: number;
  itemType: 'product' | 'rental';
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
  onViewAll: () => void;
  showAllButton?: boolean;
}

export default function ReviewsSection({ 
  itemId, 
  itemType,
  reviews, 
  totalReviews, 
  averageRating, 
  onViewAll,
  showAllButton = true
}: ReviewsSectionProps) {
  return (
    <section className="mt-6 bg-gradient-to-b from-green-50/50 to-white rounded-xl shadow-sm border border-green-100 p-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <span>
            {averageRating.toFixed(1)} · {totalReviews} reviews
          </span>
        </h2>
        {showAllButton && (
          <Button
            variant="outline"
            onClick={onViewAll}
            className="bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border border-green-200"
          >
            View all reviews
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="pb-6 border-b border-green-100 last:border-0 last:pb-0">
              <div className="flex items-start">
                <Avatar className="mr-4 h-12 w-12 border-2 border-green-100">
                  <AvatarImage src={review.userImage} />
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {review.userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                    <div>
                      <h4 className="text-base font-medium text-green-800">{review.userName}</h4>
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
                          {format(new Date(review.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-10 w-10 text-green-200 mb-3" />
            <p className="text-green-700 font-medium">No reviews yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Be the first to review this {itemType === 'product' ? 'product' : 'rental experience'}!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}