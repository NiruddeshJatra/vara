import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface Review {
  name: string;
  rating: number;
  review: string;
  date: string;
}

interface ReviewsSectionProps {
  averageRating?: number;
  totalRentals?: number;
  reviews?: Review[];
}

export default function ReviewsSection({
  averageRating = 4.9,
  totalRentals = 12,
  reviews = [
    { name: 'Rahim Ahmed', rating: 5, review: 'Excellent product, just as described. Very happy with my rental experience. Vara made the delivery and pickup process so smooth.', date: '2023-05-15' },
    { name: 'Sarah Khan', rating: 4, review: 'Good item, the quality was great. Vara staff was very helpful with setup. Would definitely rent again from this platform.', date: '2023-03-22' }
  ]
}: ReviewsSectionProps) {
  
  // Format rating safely
  const displayRating = () => {
    if (typeof averageRating === 'number') {
      return averageRating.toFixed(1);
    }
    return '0.0';
  };
  
  return (
    <section className="mt-10 bg-gradient-to-b from-green-50/50 to-white rounded-xl shadow-sm border border-green-100 p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-800 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <span>{displayRating()} · {totalRentals || 0} reviews</span>
        </h2>
        <Button
          variant="outline"
          className="hidden sm:block bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border border-green-200"
        >
          View all reviews
        </Button>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div key={idx} className="pb-4 sm:pb-6 border-b border-green-100 last:border-0 last:pb-0">
              <div className="flex items-start gap-3 sm:gap-5">
                <Avatar className="mr-2 sm:mr-4 h-10 w-10 sm:h-12 sm:w-12 border-2 border-green-100">
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {review.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2 sm:mb-3">
                    <div>
                      <h4 className="text-lg sm:text-xl font-medium text-green-800 mb-1">{review.name}</h4>
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
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-1 text-sm/6 italic sm:text-base/7 text-gray-700">{review.review}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-10 w-10 text-green-200 mb-3" />
            <p className="text-green-700 font-medium">No reviews yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Be the first to review this product!
            </p>
          </div>
        )}
      </div>
    </section>
  );
} 