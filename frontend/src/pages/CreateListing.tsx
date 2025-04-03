import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCompletionModal } from '@/components/common/ProfileCompletionModal';
import CreateListingStepper from "@/components/listings/CreateListingStepper";
import Footer from '@/components/home/Footer';
import NavBar from '@/components/home/NavBar';

export default function CreateListingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!user.profileComplete) {
      navigate('/auth/complete-profile');
      return;
    }
  }, [user, navigate]);

  // If user's profile is not complete, don't render the page
  if (!user?.profileComplete) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <CreateListingStepper />
      <Footer />
    </div>
  );
}