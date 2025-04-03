import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useListingsApi } from '@/hooks/useListingApi';
import CreateListingStepper from '@/components/listings/CreateListingStepper';
import { ListingFormData } from '@/types/listings';

const EditListing = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getListingById, updateListing } = useListingsApi();
  const [initialData, setInitialData] = useState<ListingFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!productId) {
          throw new Error('No product ID provided');
        }
        const listing = await getListingById(productId);
        setInitialData({
          title: listing.title,
          category: listing.category,
          description: listing.description,
          location: listing.location,
          basePrice: listing.basePrice,
          durationUnit: listing.durationUnit,
          images: listing.images,
          unavailableDates: listing.unavailableDates,
          securityDeposit: listing.securityDeposit,
          condition: listing.condition,
          itemAge: listing.itemAge,
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
  }, [productId, getListingById, navigate, toast]);

  const handleSubmit = async (formData: ListingFormData) => {
    try {
      if (!productId) {
        throw new Error('No product ID provided');
      }
      await updateListing(productId, formData);
      toast({
        title: "Success",
        description: "Listing updated successfully.",
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update listing. Please try again.",
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
