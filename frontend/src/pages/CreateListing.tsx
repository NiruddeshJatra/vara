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

export default function CreateListingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!user.profileCompleted) {
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
        title: 'Success',
        description: 'Product created successfully!',
        variant: 'success',
      });
      return response;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create product. Please try again.',
        variant: 'destructive',
      });
      console.error('Error creating product:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user's profile is not complete, don't render the page
  if (!user?.profileCompleted) {
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