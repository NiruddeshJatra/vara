import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export const ProfileCompletionBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.profileComplete) return null;

  return (
    <div className="fixed top-20 right-4 z-50">
      <Button
        variant="default"
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white shadow-lg animate-pulse rounded-full px-4 py-2 flex items-center gap-2"
        onClick={() => navigate('/auth/complete-profile')}
      >
        <AlertCircle className="h-4 w-4" />
        <span className="font-medium">Complete Profile</span>
      </Button>
    </div>
  );
}; 