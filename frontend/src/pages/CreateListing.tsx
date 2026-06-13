import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CreateListingStepper from "@/components/listings/CreateListingStepper";
import Footer from '@/components/home/Footer';
import NavBar from '@/components/home/NavBar';
import { ListingFormData } from '@/types/listings';
import { toast } from '@/components/ui/use-toast';
import productService from '@/services/product.service';
import { useQueryClient } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';
export default function CreateListingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!user.profile_completed) {
      navigate('/auth/complete-profile');
      return;
    }
  }, [user, navigate]);

  const handleSubmit = async (formData: ListingFormData) => {
    setIsSubmitting(true);
    try {
      const response = await productService.createProduct(formData);
      // Invalidate and refetch relevant queries
      await queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      
      toast({
        title: t('common.toastSuccess'),
        description: t('listing.confirm.createdTitle'),
        variant: 'success',
      });
      return response;
    } catch (error) {
      toast({
        title: t('common.toastError'),
        description: t('listing.saveFailed'),
        variant: 'destructive',
      });
      console.error('Error creating product:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user's profile is not complete, don't render the page
  if (!user?.profile_completed) {
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