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
        
        // Convert image URLs to File objects for the form
        const imageFiles: File[] = [];
        // We don't convert the images to File objects here because they're just for display
        // The actual file upload is handled separately when the user changes images

        setInitialData({
          title: listing.title,
          category: listing.category,
          productType: listing.productType,
          description: listing.description,
          location: listing.location,
          basePrice: listing.basePrice,
          durationUnit: listing.durationUnit,
          images: imageFiles, // Empty array for initial form state
          existingImages: listing.images, // Keep track of existing image URLs
          unavailableDates: listing.unavailableDates,
          securityDeposit: listing.securityDeposit,
          condition: listing.condition,
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

      // Only upload new images if they were added
      if (formData.images.length > 0) {
        await productService.uploadImages(productId, formData.images);
      }

      const { images, ...updateData } = formData;
      const response = await productService.updateProduct(productId, updateData);
      
      if (response) {
        toast({
          title: "Success",
          description: "Listing updated successfully.",
          variant: "default",
        });
        navigate('/profile');
      }
    } catch (error: any) {
      console.error('Error updating listing:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to update listing. Please try again.",
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
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditListing;
