import { Bell, CheckCircle, Edit, Star, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';

interface ProfileHeaderProps {
  userData: {
    firstName?: string;
    lastName?: string;
    username?: string;
    profilePicture?: string;
    memberSince?: string;
    isTrusted?: boolean;
    averageRating?: number;
    notificationCount?: number;
    profileCompleted?: boolean;
  };
  isEditing: boolean;
  onEdit: () => void;
}

const ProfileHeader = ({ userData, isEditing, onEdit }: ProfileHeaderProps) => {
  const isProfileComplete = userData?.profileCompleted ?? false;

  // Simple debug log to track profile completion status
  useEffect(() => {
    console.log('ProfileHeader - Profile completion status:', isProfileComplete);
  }, [isProfileComplete]);

  return (
    <div className="bg-gradient-to-l from-leaf-100 to-green-50 rounded-xl shadow-md px-4 sm:px-8 md:px-16 lg:px-24 py-6 sm:py-8 mb-8 border border-green-200">
      {/* Main content for all screens, but hide edit button on mobile */}
      <div className="flex flex-row items-center gap-5 sm:gap-8 w-full">
        <div className="relative">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-green-100">
            <AvatarImage 
              src={userData?.profilePicture ? `${process.env.NEXT_PUBLIC_API_URL}${userData.profilePicture}` : '/default-avatar.png'} 
              alt={`${userData?.firstName || ''} ${userData?.lastName || ''}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-green-100 text-green-800 text-xl sm:text-2xl">
              {(userData?.firstName?.[0] || '') + (userData?.lastName?.[0] || '')}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 min-w-0 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h2 className="text-lg sm:text-xl font-bold text-green-800 truncate">
              {userData?.firstName || ''} {userData?.lastName || ''}
            </h2>
            {userData?.isTrusted && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 gap-1 text-xs sm:text-sm">
                <CheckCircle className="w-3 h-3" /> Trusted
              </Badge>
            )}
          </div>
          
          <p className="text-green-700 mb-1 text-sm sm:text-base">@{userData?.username || ''}</p>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 sm:mt-3 items-center sm:justify-start">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
              <span className="font-medium text-green-700 text-sm sm:text-base">{userData?.averageRating || 0}</span>
              <span className="text-green-600 ml-2 text-xs sm:text-sm">(42 reviews)</span>
            </div>
            <div className="text-green-600 text-xs sm:text-sm">
              Member since {userData?.memberSince || ''}
            </div>
          </div>
        </div>
        
        {/* Edit button for sm+ screens only */}
        {!isEditing && (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 ml-0 sm:ml-4 whitespace-nowrap hidden sm:inline-flex"
            onClick={onEdit}
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
      </div>
      {/* Mobile-only: Edit Profile button in its own row below */}
      {!isEditing && (
        <div className="mt-5 sm:hidden flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
            onClick={onEdit}
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;