// pages/ItemDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import { Product, DurationUnit } from '@/types/listings';
import { allListings } from '@/utils/mockDataGenerator';
import ItemModal from '@/components/advertisements/ItemModal';

// Import modular components
import {
  ImageGallery,
  ProductHeader,
  PricingCard,
  ProductDescription,
  VharaService,
  ItemDetails,
  AvailabilitySection,
  ReviewsSection,
  SimilarItems,
  HostInfo
} from '@/components/itemDetail';

export default function ItemDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similarItems, setSimilarItems] = useState<Product[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API fetch with mock data
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // Find product in mock data
        const foundProduct = allListings.find(item => item.id === productId);
        
        if (foundProduct) {
          // Ensure the product matches the Product type
          const typedProduct: Product = {
            ...foundProduct,
            durationUnit: foundProduct.durationUnit as DurationUnit
          };
          
          setProduct(typedProduct);
          
          // Find similar items with the same category
          const similar = allListings
            .filter(item => 
              item.id !== productId && 
              item.category === foundProduct.category
            )
            .slice(0, 4)
            .map(item => ({
              ...item,
              durationUnit: item.durationUnit as DurationUnit
            }));
            
          setSimilarItems(similar);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuickView = (itemId: string) => {
    setSelectedItem(itemId);
    setIsItemModalOpen(true);
  };
  
  const getSelectedItem = () => {
    const found = allListings.find(item => item.id === selectedItem);
    if (!found) return null;
    
    // Cast durationUnit to the correct type
    return {
      ...found,
      durationUnit: found.durationUnit as DurationUnit
    };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <NavBar />
        <div className="flex-grow flex items-center justify-center py-20 mt-20 bg-green-50/65">
          <div className="animate-pulse space-y-8 w-full max-w-7xl px-4">
            <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto md:mx-0"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-gray-200 rounded h-96"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded h-16 w-16"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <NavBar />
        <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 mt-20 bg-green-50/65">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/advertisements">Browse Available Items</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavBar />

      <main className="flex-grow pt-20 pb-20 bg-gradient-to-b from-green-50 to-white">
        {/* Title Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
          <ProductHeader 
            title={product.title} 
            averageRating={product.averageRating} 
            totalRentals={product.totalRentals} 
            location={product.location} 
            category={product.category} 
          />
        </div>

        {/* Image Gallery Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <ImageGallery images={product.images} title={product.title} />
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column - Content */}
            <div className="lg:col-span-2">
              {/* Host/Vhara Section */}
              <HostInfo />

              {/* Description Section */}
              <ProductDescription 
                description={product.description} 
                title={product.title} 
                condition={product.condition} 
                category={product.category} 
              />

              {/* Vhara Service Section */}
              <VharaService />

              {/* Details & Specifications */}
              <ItemDetails 
                condition={product.condition} 
                category={product.category} 
                itemAge={product.itemAge} 
                securityDeposit={product.securityDeposit} 
              />

              {/* Availability Calendar */}
              <AvailabilitySection availabilityPeriods={product.availabilityPeriods} />

              {/* Reviews Section */}
              <ReviewsSection 
                averageRating={product.averageRating} 
                totalRentals={product.totalRentals} 
              />
            </div>

            {/* Right Column - Pricing & CTA */}
            <PricingCard 
              productId={product.id}
              basePrice={product.basePrice}
              durationUnit={product.durationUnit}
              minRentalPeriod={product.minRentalPeriod}
              maxRentalPeriod={product.maxRentalPeriod}
              securityDeposit={product.securityDeposit}
            />
          </div>
        </div>

        {/* Similar Items */}
        <SimilarItems items={similarItems} onQuickView={handleQuickView} />
      </main>

      {/* Item Detail Modal */}
      <ItemModal 
        isOpen={isItemModalOpen} 
        onOpenChange={setIsItemModalOpen} 
        selectedItem={getSelectedItem()} 
      />

      <Footer />
    </div>
  );
}