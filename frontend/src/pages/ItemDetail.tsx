
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { allListings } from '@/utils/mockDataGenerator';
import { toast } from 'sonner';
import RequestRentalModal from '@/components/rentals/RequestRentalModal';
import ItemDetailHeader from '@/components/items/ItemDetailHeader';
import ItemGallery from '@/components/items/ItemGallery';
import ItemPricing from '@/components/items/ItemPricing';
import ItemNotFound from '@/components/items/ItemNotFound';

const ItemDetail = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  
  // Find the item based on the URL parameter
  const item = allListings.find(item => item.id === Number(itemId));
  
  // If item not found, show message and redirect
  useEffect(() => {
    if (!item && itemId) {
      toast.error("Item not found");
      setTimeout(() => navigate('/advertisements'), 2000);
    }
  }, [item, itemId, navigate]);
  
  if (!item) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <ItemNotFound />
        <Footer />
      </div>
    );
  }
  
  // Generate multiple images for the carousel (since our mock data might only have one)
  const itemImages = item.images || [
    item.image,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80'
  ];

  // Prepare item data for the rental modal (without onQuickView property)
  const rentalItem = {
    id: item.id,
    name: item.name,
    image: item.image,
    images: itemImages,
    category: item.category,
    price: item.price,
    duration: item.duration,
    distance: item.distance,
    rating: item.rating,
    reviewCount: item.reviewCount
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="flex-grow pt-20">
        {/* Back Button */}
        <ItemDetailHeader />
        
        {/* Item Gallery */}
        <ItemGallery images={itemImages} itemName={item.name} />
        
        {/* Item Details */}
        <div className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Item Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{item.name}</h1>
                    <div className="flex items-center mt-2 text-gray-600">
                      <Badge variant="outline" className="mr-2">{item.category}</Badge>
                      <span className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        {item.rating} ({item.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center mb-4 text-gray-600">
                  <MapPin className="h-4 w-4 mr-1 text-green-600" />
                  <span className="text-sm">{item.distance} miles away from you</span>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-600 mb-6">
                  This {item.name} is in excellent condition and available for rent. 
                  Perfect for those who need it temporarily without having to purchase it outright.
                  The item is well-maintained and comes with all necessary accessories.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Availability</h4>
                      <p className="text-sm text-gray-600">Available for immediate rental</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Rental Period</h4>
                      <p className="text-sm text-gray-600">Minimum: 1 day</p>
                      <p className="text-sm text-gray-600">Maximum: 30 days</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-3">Rental Terms</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Security Deposit</h4>
                      <p className="text-sm text-gray-600">
                        A refundable security deposit of $100 is required.
                        This will be returned after the item is checked for damage.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Cancellation Policy</h4>
                      <p className="text-sm text-gray-600">
                        Full refund if cancelled 24 hours before rental start time.
                        50% refund if cancelled less than 24 hours before.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-3">About the Owner</h3>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">John Doe</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                      4.9 (42 reviews)
                    </div>
                    <p className="text-sm text-gray-500">Member since Jan 2023</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center text-green-700"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message owner
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Right Column - Pricing & Request Form */}
            <div className="lg:col-span-1">
              <ItemPricing 
                price={item.price} 
                duration={item.duration} 
                onRequestRental={() => setIsRequestModalOpen(true)} 
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Request Rental Modal */}
      <RequestRentalModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)}
        item={rentalItem}
      />
    </div>
  );
};

export default ItemDetail;
