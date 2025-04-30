import { useState } from 'react';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import ProfileListings from '@/components/profile/ProfileListings';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProfileCompletionModal } from '@/components/common/ProfileCompletionModal';

export default function MyListingsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    if (!user?.profileCompleted) {
      navigate('/auth/complete-profile');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  const handleUploadProduct = () => {
    if (!user?.profileCompleted) {
      setShowProfileModal(true);
      return;
    }
    navigate('/upload-product');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-12">
      <NavBar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-green-800">My Listings</h1>
          </div>
          <ProfileListings />
        </div>
      </div>
      <Footer />
      <ProfileCompletionModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Complete Your Profile"
        description="You need to complete your profile before you can upload products."
      />
    </div>
  );
}