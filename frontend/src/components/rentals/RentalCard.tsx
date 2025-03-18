import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { Rental } from "@/pages/Rentals";
import { Clock, ThumbsUp, ThumbsDown, Calendar as CalendarIcon, Eye } from "lucide-react";

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
    pending: { color: 'bg-amber-100 text-amber-800', icon: <Clock className="h-4 w-4" /> },
    accepted: { color: 'bg-blue-100 text-blue-800', icon: <ThumbsUp className="h-4 w-4" /> },
    in_progress: { color: 'bg-green-100 text-green-800', icon: <ThumbsUp className="h-4 w-4" /> },
    completed: { color: 'bg-purple-100 text-purple-800', icon: <ThumbsUp className="h-4 w-4" /> },
    rejected: { color: 'bg-red-100 text-red-800', icon: <ThumbsDown className="h-4 w-4" /> },
    cancelled: { color: 'bg-orange-100 text-orange-800', icon: <ThumbsDown className="h-4 w-4" /> }
  };

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const getTimeInfo = () => {
    const now = new Date();
    const start = new Date(rental.startTime);
    const end = new Date(rental.endTime);
    
    return rental.status === 'in_progress' ? `${differenceInDays(end, now)}d left` :
           rental.status === 'accepted' ? `Starts in ${differenceInDays(start, now)}d` :
           rental.status === 'pending' ? `Requested ${formatDistanceToNow(new Date(rental.createdAt))} ago` :
           `Completed ${formatDistanceToNow(new Date(rental.updatedAt))} ago`;
  };

  const profile = userRole === 'renter' 
    ? { name: rental.ownerName, image: rental.ownerImage }
    : { name: rental.renterName, image: rental.renterImage };

  return (
    <div className="flex h-60 bg-gradient-to-r from-white to-leaf-300 rounded-lg border border-green-100 overflow-hidden shadow-lg backdrop-blur-md">
      {/* Image Section */}
      <div className="w-2/5 relative">
        <img 
          src={rental.itemImage} 
          alt={rental.itemTitle}
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute bottom-2 left-2 ${statusConfig[rental.status].color} px-3 py-1`}>
          {statusConfig[rental.status].icon}
        </Badge>
      </div>

      {/* Content Section */}
      <div className="w-3/5 pl-8 pr-6 py-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-green-900 truncate">{rental.itemTitle}</h3>
            <span className="text-lg font-bold text-green-700">${rental.totalPrice}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <CalendarIcon className="h-4 w-4 text-green-600" />
            <span>{formatDate(rental.startTime)} - {formatDate(rental.endTime)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
            <Avatar className="h-6 w-6">
              <AvatarImage src={profile.image} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="truncate">{profile.name}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-green-700">{getTimeInfo()}</span>
          <Button 
            variant="outline" 
            size="sm"
            className="border-green-200 text-leaf-800 hover:bg-green-50"
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