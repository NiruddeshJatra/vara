import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ProfileCompletionButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Don't render if user is not logged in or if profile is complete
  if (!user || user.profileCompleted === true) return null;

  // Don't render if we're on the complete profile page
  if (window.location.pathname === '/auth/complete-profile') return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <TooltipProvider>
        <Tooltip open={isHovered} onOpenChange={setIsHovered}>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="h-14 w-14 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg animate-pulse cursor-pointer"
            >
              <AlertTriangle className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs p-4">
            <div className="space-y-2">
              <p className="font-medium text-amber-800">Profile Incomplete</p>
              <p className="text-sm text-gray-700">
                You need to complete your profile to upload products or request rentals.
              </p>
              <Button 
                variant="link" 
                className="p-0 h-auto text-amber-600 hover:text-amber-800 font-medium"
                onClick={() => navigate('/auth/complete-profile')}
              >
                Complete your profile now →
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}; 