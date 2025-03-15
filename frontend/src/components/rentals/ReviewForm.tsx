
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface ReviewFormProps {
  rentalId: number;
  userRole: 'renter' | 'owner';
  onSubmit: (rating: number, review: string) => void;
}

const ReviewForm = ({ rentalId, userRole, onSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (hoveredRating: number) => {
    setHoveredRating(hoveredRating);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, review);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star rating */}
      <div className="flex flex-col space-y-2">
        <div className="text-sm font-medium">
          Rate your experience {userRole === 'renter' ? 'with this item' : 'with this renter'}
        </div>
        <div 
          className="flex items-center" 
          onMouseLeave={handleRatingLeave}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-7 w-7 cursor-pointer ${
                (hoveredRating || rating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => handleRatingHover(star)}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {rating > 0 ? `${rating} out of 5 stars` : "Click to rate"}
          </span>
        </div>
      </div>

      {/* Review text */}
      <div className="space-y-2">
        <label htmlFor="review" className="text-sm font-medium">
          Write your review
        </label>
        <Textarea
          id="review"
          placeholder={`Share your experience ${userRole === 'renter' ? 'with this item' : 'with this renter'}...`}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
        />
      </div>

      {/* Photo upload - simplified version */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Add photos (optional)
        </label>
        <div className="border-2 border-dashed border-gray-200 rounded-md p-4 text-center">
          <Button variant="outline" type="button" className="mb-2">
            Upload Photos
          </Button>
          <p className="text-xs text-gray-500">
            JPG, PNG or GIF, max 5MB each
          </p>
        </div>
      </div>

      {/* Submit button */}
      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={rating === 0}
      >
        Submit Review
      </Button>
    </form>
  );
};

export default ReviewForm;
