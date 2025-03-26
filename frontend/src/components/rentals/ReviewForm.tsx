import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Upload, Leaf } from "lucide-react";

interface ReviewFormProps {
  rentalId: number;
  userRole: 'renter' | 'owner';
  onSubmit: (rating: number, review: string) => void;
}

const ReviewForm = ({ rentalId, userRole, onSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");

  const handleRatingClick = (selectedRating: number) => setRating(selectedRating);
  const handleRatingHover = (hoveredRating: number) => setHoveredRating(hoveredRating);
  const handleRatingLeave = () => setHoveredRating(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, review);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating Section */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-green-800">
          Rate your experience {userRole === 'renter' ? 'with this item' : 'with this renter'}
        </div>
        <div 
          className="flex items-center gap-1" 
          onMouseLeave={handleRatingLeave}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className="p-1 transition-transform hover:scale-110"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => handleRatingHover(star)}
            >
              <Star
                className={`h-8 w-8 ${
                  (hoveredRating || rating) >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-200"
                }`}
                strokeWidth={1.5}
              />
            </button>
          ))}
          <span className="ml-3 text-sm font-medium text-green-700">
            {rating > 0 ? `${rating}/5` : "Tap to rate"}
          </span>
        </div>
      </div>

      {/* Review Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-green-800">
          Share your experience
        </label>
        <Textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder={`Describe your experience ${userRole === 'renter' ? 'with this item...' : 'with this renter...'}`}
          className="rounded-xl border-2 border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-300 h-32"
        />
      </div>

      {/* Photo Upload */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-green-800">
          Add photos (optional)
        </label>
        <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center bg-green-50/30 backdrop-blur-sm">
          <Button 
            variant="outline" 
            type="button" 
            className="border-green-400 text-green-700 hover:bg-green-50 gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Images
          </Button>
          <p className="mt-2 text-xs text-green-600">
            PNG, JPG up to 5MB
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700 h-12 rounded-xl shadow-sm hover:shadow-md transition-all gap-2"
        disabled={rating === 0}
      >
        <Leaf className="h-4 w-4" />
        Submit Review
      </Button>
    </form>
  );
};

export default ReviewForm;