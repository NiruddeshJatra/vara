import { useState, useEffect } from 'react';
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

  useEffect(() => {
    console.log('ProfileCompletionButton - User profile status:', user?.profileCompleted);
  }, [user?.profileCompleted]);

  if (!user?.profileCompleted) {
    return (
      <button
        onClick={() => navigate('/auth/complete-profile')}
        className="fixed bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow-lg z-50"
      >
        Complete Profile
      </button>
    );
  }

  return null;
};