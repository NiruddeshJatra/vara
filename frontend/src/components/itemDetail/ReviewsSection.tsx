import React from 'react';
import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    { name: 'Rahim Ahmed', rating: 5, review: 'Excellent product, just as described. Very happy with my rental experience. Vara made the delivery and pickup process so smooth.', date: '3 weeks ago' },
    { name: 'Sarah Khan', rating: 4, review: 'Good item, the quality was great. Vara staff was very helpful with setup. Would definitely rent again from this platform.', date: '2 months ago' }
  ]
}: ReviewsSectionProps) {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-green-900 flex items-center">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-2" />
          {averageRating?.toFixed(1)} · {totalRentals} reviews
        </h2>
        {/* Updated button style to match "Add Period" button from AvailabilityStep */}
        <Button
          variant="outline"
          className="bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border border-green-400"
        >
          View all reviews
        </Button>
      </div>
      
      {/* Individual reviews */}
      <div className="space-y-6">
        {reviews.map((review, idx) => (
          <div key={idx} className="pb-6 last:pb-0 last:border-0">
            <div className="flex items-start">
              <div className="mr-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <span className="text-green-700 font-medium">{review.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{review.name}</h4>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.review}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 