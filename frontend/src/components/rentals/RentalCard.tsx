import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { differenceInDays, formatDistanceToNow, isValid } from "date-fns";
import { Rental } from "@/types/rentals";
import { RentalStatus } from "@/constants/rental";
import {
  Clock,
  ThumbsUp,
  ThumbsDown,
  Calendar as CalendarIcon,
  Eye,
  Shield,
} from "lucide-react";

interface RentalCardProps {
  rental: Rental;
  userRole: "renter" | "owner";
  onViewDetails: (rental: Rental) => void;
  onStatusAction: (rentalId: number, action: string) => void;
}

const RentalCard = ({
  rental,
  userRole,
  onViewDetails,
  onStatusAction,
}: RentalCardProps) => {
  // Debug logging removed after mapping fix

  const statusConfig = {
    pending: {
      color: "bg-amber-100 text-amber-800 border-amber-300",
      icon: <Clock className="h-4 w-4" />,
    },
    approved: {
      color: "bg-blue-100 text-blue-800 border-blue-300",
      icon: <ThumbsUp className="h-4 w-4" />,
    },
    completed: {
      color: "bg-purple-100 text-purple-800 border-purple-300",
      icon: <ThumbsUp className="h-4 w-4" />,
    },
    rejected: {
      color: "bg-red-100 text-red-800 border-red-300",
      icon: <ThumbsDown className="h-4 w-4" />,
    },
    cancelled: {
      color: "bg-orange-100 text-orange-800 border-orange-300",
      icon: <ThumbsDown className="h-4 w-4" />,
    },
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getTimeInfo = () => {
    const now = new Date();
    const start = new Date(rental.startDate);
    const end = new Date(rental.endDate);

    if (
      !rental.startDate ||
      !isValid(start) ||
      !rental.endDate ||
      !isValid(end)
    ) {
      return "N/A";
    }

    if (rental.status === RentalStatus.APPROVED) {
      if (now < start) return `Starts in ${differenceInDays(start, now)}d`;
      if (now >= start && now <= end)
        return `${differenceInDays(end, now)}d left`;
    }
    if (rental.status === RentalStatus.PENDING) {
      const created = new Date(rental.createdAt);
      if (!rental.createdAt || !isValid(created)) return "N/A";
      const timeAgo = formatDistanceToNow(created)
        .replace(/about|over|almost|less than/g, "")
        .replace("months", "mo")
        .replace("month", "mo")
        .replace("days", "d")
        .replace("day", "d")
        .replace("years", "yr")
        .replace("year", "yr")
        .replace("hours", "hr")
        .replace("hour", "hr")
        .trim();
      return `Requested ${timeAgo} ago`;
    }
    // For completed/cancelled/etc.
    const updated = new Date(rental.updatedAt);
    if (!rental.updatedAt || !isValid(updated)) return "N/A";
    const completedTime = formatDistanceToNow(updated)
      .replace(/about|over|almost|less than/g, "")
      .replace("months", "mo")
      .replace("month", "mo")
      .replace("days", "d")
      .replace("day", "d")
      .replace("years", "yr")
      .replace("year", "yr")
      .replace("hours", "hr")
      .replace("hour", "hr")
      .trim();
    return `Updated ${completedTime} ago`;
  };

  const profile =
    userRole === "renter"
      ? { name: rental.owner || "Owner", image: "" }
      : { name: rental.renter || "Renter", image: "" };

  // Defensive fallback for missing/invalid numbers
  const price = typeof rental.totalCost === 'number' && !isNaN(rental.totalCost)
    ? rental.totalCost
    : rental.product?.pricingTiers?.[0]?.price || 0;

  const imageUrl = rental.product?.images?.[0]?.image || '/placeholder.png';
  const productTitle = rental.product?.title || 'Untitled';
  const productCategory = rental.product?.category || 'N/A';
  const productType = rental.product?.productType || 'N/A';

  return (
    <div className="flex flex-col sm:flex-row h-auto sm:h-64 bg-gradient-to-r from-white to-leaf-100 rounded-lg border overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <div className="w-full sm:w-2/5 md:w-2/5 lg:w-2/5 relative bg-gray-50 flex items-center justify-center aspect-[4/3]">
        <img
          src={imageUrl}
          alt={productTitle}
          className="w-full h-full object-cover rounded"
        />
      </div>

      {/* Content Section */}
      <div className="w-full sm:w-3/5 md:w-3/5 lg:w-3/5 pl-6 pr-4 py-4 flex flex-col justify-between gap-1">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-green-900 truncate">{productTitle}</h3>
            <span className="text-lg font-bold text-green-700">৳{price.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-700">
            <span className="bg-green-50 border border-green-100 px-2 py-0.5 rounded text-green-800"><b>Category:</b> {productCategory}</span>
            <span className="bg-green-50 border border-green-100 px-2 py-0.5 rounded text-green-800"><b>Type:</b> {productType}</span>
          </div>

          <div className="flex items-center gap-2 ml-2 text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 text-green-600" />
            <span>{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</span>
          </div>

          <div className="bg-green-50 px-3 py-2 rounded-md border border-green-200 text-xs">
            {userRole === 'renter'
              ? "Bhara handles all communications with the item owner"
              : "Bhara handles all communications with the renter"}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="inline-flex items-center bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200 text-xs text-green-700 font-medium">
            {getTimeInfo()}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-green-400 text-green-800 hover:bg-green-50"
            onClick={() => onViewDetails(rental)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;
