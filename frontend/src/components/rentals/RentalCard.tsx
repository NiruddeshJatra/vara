import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { Rental } from "@/pages/Rentals";
import { Clock, ThumbsUp, ThumbsDown, Calendar as CalendarIcon, Eye, Shield } from "lucide-react";

interface RentalCardProps {
  rental: Rental;
  userRole: 'renter' | 'owner';
  onViewDetails: (rental: Rental) => void;
  onStatusAction: (rentalId: number, action: string) => void;
}

const RentalCard = ({ 
  rental, 
  userRole, 
  onViewDetails, 
  onStatusAction 
}: RentalCardProps) => {
  const statusConfig = {
    pending: { color: 'bg-amber-100 text-amber-800 border-amber-300', icon: <Clock className="h-4 w-4" /> },
    accepted: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: <ThumbsUp className="h-4 w-4" /> },
    in_progress: { color: 'bg-green-100 text-green-800 border-green-300', icon: <ThumbsUp className="h-4 w-4" /> },
    completed: { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: <ThumbsUp className="h-4 w-4" /> },
    rejected: { color: 'bg-red-100 text-red-800 border-red-300', icon: <ThumbsDown className="h-4 w-4" /> },
    cancelled: { color: 'bg-orange-100 text-orange-800 border-orange-300', icon: <ThumbsDown className="h-4 w-4" /> }
  };

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const getTimeInfo = () => {
    const now = new Date();
    const start = new Date(rental.startTime);
    const end = new Date(rental.endTime);
    
    if (rental.status === 'in_progress') return `${differenceInDays(end, now)}d left`;
    if (rental.status === 'accepted') return `Starts in ${differenceInDays(start, now)}d`;
    if (rental.status === 'pending') {
      const timeAgo = formatDistanceToNow(new Date(rental.createdAt))
        .replace(/about|over|almost|less than/g, '')
        .replace('months', 'mo')
        .replace('month', 'mo')
        .replace('days', 'd')
        .replace('day', 'd')
        .replace('years', 'yr')
        .replace('year', 'yr')
        .replace('hours', 'hr')
        .replace('hour', 'hr')
        .trim();
      return `Requested ${timeAgo} ago`;
    }
    
    // Format "Completed X time ago" more concisely
    const completedTime = formatDistanceToNow(new Date(rental.updatedAt))
      .replace(/about|over|almost|less than/g, '')
      .replace('months', 'mo')
      .replace('month', 'mo')
      .replace('days', 'd')
      .replace('day', 'd')
      .replace('years', 'yr')
      .replace('year', 'yr')
      .replace('hours', 'hr')
      .replace('hour', 'hr')
      .trim();
    
    return `Completed ${completedTime} ago`;
  };

  const profile = userRole === 'renter' 
    ? { name: rental.ownerName, image: rental.ownerImage }
    : { name: rental.renterName, image: rental.renterImage };

  return (
    <div className="flex h-64 bg-gradient-to-r from-white to-leaf-100 rounded-lg border border-green-300 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <div className="w-1/2 relative">
        <img 
          src={rental.itemImage} 
          alt={rental.itemTitle}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${statusConfig[rental.status as keyof typeof statusConfig].color} px-2 py-1 flex items-center gap-1 border text-xs`}>
            {statusConfig[rental.status as keyof typeof statusConfig].icon}
            {rental.status.charAt(0).toUpperCase() + rental.status.slice(1).replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-3/5 pl-8 pr-6 py-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-green-900 truncate">{rental.itemTitle}</h3>
            <span className="text-lg font-bold text-green-700">৳{rental.totalPrice}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <CalendarIcon className="h-4 w-4 text-green-600" />
            <span>{formatDate(rental.startTime)} - {formatDate(rental.endTime)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="font-medium">Vara-Protected Transaction</span>
          </div>

          <div className="bg-green-50 px-3 py-2 rounded-md border border-green-200 text-xs">
            {userRole === 'renter' 
              ? "Vara handles all communications with the item owner"
              : "Vara handles all communications with the renter"}
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