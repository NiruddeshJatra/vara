import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCompletionModal } from '@/components/common/ProfileCompletionModal';
import CreateListingStepper from "@/components/listings/CreateListingStepper";
import Footer from '@/components/home/Footer';
import NavBar from '@/components/home/NavBar';
import { ListingFormData } from '@/types/listings';
import { toast } from 'react-hot-toast';
import productService from '@/services/product.service';

export default function CreateListingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (formData: ListingFormData) => {
    setIsSubmitting(true);
    try {
      await productService.createProduct(formData);
      toast.success('Product created successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to create product. Please try again.');
      console.error('Error creating product:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user's profile is not complete, don't render the page
  if (!user?.profileComplete) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <CreateListingStepper onSubmit={handleSubmit} />
      <Footer />
    </div>
  );
}