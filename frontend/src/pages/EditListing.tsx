import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import CreateListingStepper from '@/components/listings/CreateListingStepper';
import { ListingFormData } from '@/types/listings';
import productService from '@/services/product.service';

const EditListing = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<ListingFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!productId) {
          throw new Error('No product ID provided');
        }
        const listing = await productService.getProduct(productId);
        
        setInitialData({
          title: listing.title,
          category: listing.category,
          productType: listing.productType,
          description: listing.description,
          location: listing.location,
          images: [], // Start with empty array, images will be handled separately
          unavailableDates: listing.unavailableDates,
          securityDeposit: listing.securityDeposit,
          purchaseYear: listing.purchaseYear,
          originalPrice: listing.originalPrice,
          ownershipHistory: listing.ownershipHistory,
          pricingTiers: listing.pricingTiers
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch listing details. Please try again.",
          variant: "destructive",
        });
        navigate('/profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [productId, navigate, toast]);

  const handleSubmit = async (formData: ListingFormData) => {
    try {
      if (!productId) {
        throw new Error('No product ID provided');
      }

      await productService.updateProduct(productId, formData);
      
      toast({
        title: "Success",
        description: "Listing updated successfully.",
        variant: "default",
      });
      navigate('/profile');
    } catch (error: any) {
      console.error('Error updating listing:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!initialData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>
      <CreateListingStepper
        initialData={initialData}
        isEditing={true}
        productId={productId}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditListing;
