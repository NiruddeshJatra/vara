import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import ProfileListings from '@/components/profile/ProfileListings';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCompletionModal } from '@/components/common/ProfileCompletionModal';

export default function MyListingsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle authentication
  if (!isAuthenticated) {
    navigate('/auth/login');
    return null;
  }

  if (!user?.profileCompleted) {
    navigate('/auth/complete-profile');
    return null;
  }

  const handleUploadProduct = () => {
    if (!user?.profileCompleted) {
      setShowProfileModal(true);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/upload-product');
    }, 2000); // Simulate loading
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-12">
      <NavBar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-green-800">My Listings</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Manage your listed products
              </p>
            </div>
          </div>

          <ProfileListings />
        </div>
      </div>

      <ProfileCompletionModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Complete Your Profile"
        description="Please complete your profile before uploading products."
      />

      <Footer />
    </div>
  );
}