import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Banknote, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Listing } from '@/types/listings';
import { Category } from '@/constants/productTypes';
// Mock data for testing
const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Professional DSLR Camera',
    category: 'Electronics & Gadgets' as Category,
    description: 'Canon EOS 5D Mark IV with 24-70mm lens. Perfect for professional photography.',
    location: 'Dhaka, Bangladesh',
    basePrice: 2000,
    durationUnit: 'day',
    images: ['https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=2070&auto=format&fit=crop'],
    unavailableDates: [],
    securityDeposit: 5000,
    condition: 'excellent',
    itemAge: 2,
    purchaseYear: '2022',
    originalPrice: 250000,
    ownershipHistory: 'firsthand',
    pricingTiers: [
      { durationUnit: 'day', price: 2000, maxPeriod: 7 },
      { durationUnit: 'week', price: 12000, maxPeriod: 4 }
    ],
    owner: {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com'
    }
  },
  {
    id: '2',
    title: 'Mountain Bike',
    category: 'Sports & Fitness' as Category,
    description: 'Trek Marlin 5 mountain bike, great condition, perfect for trails.',
    location: 'Chittagong, Bangladesh',
    basePrice: 800,
    durationUnit: 'day',
    images: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?q=80&w=2064&auto=format&fit=crop'],
    unavailableDates: [],
    securityDeposit: 3000,
    condition: 'good',
    itemAge: 1,
    purchaseYear: '2023',
    originalPrice: 45000,
    ownershipHistory: 'firsthand',
    pricingTiers: [
      { durationUnit: 'day', price: 800, maxPeriod: 14 },
      { durationUnit: 'week', price: 4500, maxPeriod: 8 }
    ],
    owner: {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com'
    }
  },
  {
    id: '3',
    title: 'Camping Tent',
    category: 'Outdoor & Camping' as Category,
    description: '4-person camping tent with rain cover, barely used.',
    location: 'Sylhet, Bangladesh',
    basePrice: 500,
    durationUnit: 'day',
    images: ['https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=2070&auto=format&fit=crop'],
    unavailableDates: [],
    securityDeposit: 2000,
    condition: 'excellent',
    itemAge: 1,
    purchaseYear: '2023',
    originalPrice: 15000,
    ownershipHistory: 'firsthand',
    pricingTiers: [
      { durationUnit: 'day', price: 500, maxPeriod: 30 },
      { durationUnit: 'week', price: 2500, maxPeriod: 12 }
    ],
    owner: {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com'
    }
  }
];

const ProfileListings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [isLoading, setIsLoading] = useState(false);

  // Handle listing deletion
  const handleDeleteListing = async (listingId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setListings(listings.filter(listing => listing.id !== listingId));
      toast({
        title: "Success",
        description: "Listing deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle listing edit
  const handleEditListing = (listingId: string) => {
    navigate(`/edit-listing/${listingId}`);
  };

  // Handle view listing
  const handleViewListing = (listingId: string) => {
    navigate(`/item/${listingId}`);
  };

  if (isLoading) {
    return <div>Loading listings...</div>;
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">No Listings Yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          You haven't uploaded any products for rent yet.
        </p>
        <Button
          className="mt-4"
          onClick={() => navigate('/upload-product')}
        >
          Upload Your First Product
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Card key={listing.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
          <div className="relative h-60 overflow-hidden">
            <img
              src={listing.images[0] || '/images/placeholder-image.jpg'}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-image.jpg';
              }}
            />
            <Badge variant="secondary" className="absolute top-2 left-2 bg-white/90 text-green-800">
              {listing.category}
            </Badge>
          </div>
          
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">{listing.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-green-700 border-green-200">
                {listing.condition}
              </Badge>
              <div className="flex items-center text-yellow-500">
                <Star size={14} className="fill-current" />
                <span className="ml-1 text-sm font-medium">4.5</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{listing.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Banknote size={16} className="text-green-700 mr-1" />
                <span className="text-lg font-bold text-green-700">{listing.basePrice}</span>
                <span className="text-sm font-semibold text-green-700 ml-1">/{listing.durationUnit}</span>
              </div>
              {listing.securityDeposit > 0 && (
                <div className="text-sm text-gray-500">
                  Deposit: {listing.securityDeposit}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              className="text-green-700 border-green-200 hover:bg-green-100 hover:text-green-700"
              onClick={() => handleViewListing(listing.id)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-green-700 border-green-200 hover:bg-green-100 hover:text-green-700"
                onClick={() => handleEditListing(listing.id)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-100 hover:text-red-600"
                onClick={() => handleDeleteListing(listing.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProfileListings; 