import { Bell, CheckCircle, Edit, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  userData: {
    firstName: string;
    lastName: string;
    username: string;
    profilePicture: string;
    memberSince: string;
    isVerified: boolean;
    isTrustedSeller: boolean;
    rating: number;
    notificationCount: number;
  };
  isEditing: boolean;
  onEdit: () => void;
}

const ProfileHeader = ({ userData, isEditing, onEdit }: ProfileHeaderProps) => {
  return (
    <div className="bg-gradient-to-l from-leaf-100 to-green-50 rounded-xl shadow-md px-24 py-6 mb-8 border border-green-200">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-green-100">
            <AvatarImage 
              src={userData.profilePicture} 
              alt={`${userData.firstName} ${userData.lastName}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-green-100 text-green-800 text-xl">
              {userData.firstName[0]}{userData.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-green-800">{userData.firstName} {userData.lastName}</h2>
            {userData.isVerified && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 gap-1">
                <CheckCircle className="w-3 h-3" /> Verified
              </Badge>
            )}
            {userData.isTrustedSeller && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                Trusted Seller
              </Badge>
            )}
          </div>
          
          <p className="text-green-700 mb-1">@{userData.username}</p>
          
          <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
              <span className="font-medium text-green-700">{userData.rating}</span>
              <span className="text-green-600 ml-1">(42 reviews)</span>
            </div>
            <div className="text-green-600">
              Member since {userData.memberSince}
            </div>
          </div>
        </div>
        
        {!isEditing && (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800" 
            onClick={onEdit}
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader; 