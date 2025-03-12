
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { Rental } from "@/pages/Rentals";
import { MessageSquare, AlertTriangle, Trash2, Eye, ThumbsUp, ThumbsDown, RotateCcw, Star, Edit } from "lucide-react";

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
  // Status badge configuration
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: 'clock' };
      case 'accepted':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'check' };
      case 'in_progress':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: 'check' };
      case 'completed':
        return { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: 'check' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: 'x' };
      case 'cancelled':
        return { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: 'x' };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: 'help-circle' };
    }
  };

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate time remaining or days until start
  const getTimeInfo = () => {
    const now = new Date();
    const startDate = new Date(rental.startTime);
    const endDate = new Date(rental.endTime);
    
    if (rental.status === 'in_progress') {
      return `${differenceInDays(endDate, now)} days remaining`;
    } else if (rental.status === 'accepted') {
      return `Starts in ${differenceInDays(startDate, now)} days`;
    } else if (rental.status === 'pending') {
      return `Requested ${formatDistanceToNow(new Date(rental.createdAt))} ago`;
    } else {
      return `Completed ${formatDistanceToNow(new Date(rental.updatedAt))} ago`;
    }
  };

  // Determine the profile name and image based on user role
  const profileName = userRole === 'renter' ? rental.ownerName : rental.renterName;
  const profileImage = userRole === 'renter' ? rental.ownerImage : rental.renterImage;

  const statusConfig = getStatusConfig(rental.status);

  return (
    <div className="flex flex-col lg:flex-row border border-green-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white animate-fade-in">
      {/* Item image */}
      <div className="lg:w-1/4 h-48 lg:h-auto relative">
        <img 
          src={rental.itemImage} 
          alt={rental.itemTitle}
          className="w-full h-full object-cover"
        />
        <Badge 
          className={`absolute top-2 right-2 ${statusConfig.color}`}
        >
          {rental.status.charAt(0).toUpperCase() + rental.status.slice(1).replace('_', ' ')}
        </Badge>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{rental.itemTitle}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {formatDate(rental.startTime)} - {formatDate(rental.endTime)}
            </p>
          </div>
          <p className="text-lg font-semibold text-green-700">${rental.totalPrice}</p>
        </div>
        
        <div className="flex items-center mt-2 mb-4">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={profileImage} />
            <AvatarFallback>{profileName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{profileName}</p>
            <p className="text-xs text-gray-500">{userRole === 'renter' ? 'Owner' : 'Renter'}</p>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <span className="text-sm text-gray-600">{getTimeInfo()}</span>
        </div>
        
        <div className="mt-auto flex flex-wrap gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onViewDetails(rental)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          
          {/* Conditional action buttons based on status and user role */}
          {rental.status === 'in_progress' && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusAction(rental.id, 'contact')}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Contact {userRole === 'renter' ? 'Owner' : 'Renter'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => onStatusAction(rental.id, 'report')}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Report Issue
              </Button>
            </>
          )}
          
          {rental.status === 'pending' && userRole === 'renter' && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusAction(rental.id, 'edit')}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Request
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => onStatusAction(rental.id, 'cancel')}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Cancel Request
              </Button>
            </>
          )}
          
          {rental.status === 'pending' && userRole === 'owner' && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => onStatusAction(rental.id, 'accept')}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => onStatusAction(rental.id, 'reject')}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}
          
          {rental.status === 'accepted' && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusAction(rental.id, 'contact')}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Contact {userRole === 'renter' ? 'Owner' : 'Renter'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => onStatusAction(rental.id, 'cancel')}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Cancel Rental
              </Button>
            </>
          )}
          
          {rental.status === 'completed' && (
            <>
              {userRole === 'renter' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onStatusAction(rental.id, 'rentAgain')}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Rent Again
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusAction(rental.id, 'review')}
              >
                <Star className="h-4 w-4 mr-1" />
                Leave Review
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentalCard;