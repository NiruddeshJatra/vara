import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const ProfileCompletionModal = ({
  isOpen,
  onClose,
  title,
  description
}: ProfileCompletionModalProps) => {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t('profileCompletion.incomplete');
  const resolvedDescription = description ?? t('profileCompletion.genericDescription');
  const navigate = useNavigate();

  const handleCompleteProfile = () => {
    navigate('/auth/complete-profile');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>{resolvedTitle}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {resolvedDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-700">
            Completing your profile helps us verify your identity and ensures a safe experience for all users.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleCompleteProfile}
          >
            Complete Profile Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 