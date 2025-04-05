// pages/ItemDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import { Product } from '@/types/listings';
import { generateListings } from '@/utils/mockDataGenerator';
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
import { DurationUnit } from '@/constants/rental';

// Generate mock listings
const allListings = generateListings(40);

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
          setProduct(foundProduct);

          // Find similar items
          const similar = allListings
            .filter(item => 
              item.id !== productId &&
              item.category === foundProduct.category
            )
            .slice(0, 4);

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
    return allListings.find(item => item.id === selectedItem) || null;
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
        <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 mt-20 bg-green-50/65 animate-fade-in">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="animate-pulse">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 animate-fade-up">
          <ProductHeader
            title={product.title}
            averageRating={product.averageRating}
            totalRentals={product.rentalCount}
            location={product.location}
            category={product.category}
          />
        </div>

        {/* Image Gallery Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 animate-fade-up delay-100">
          <ImageGallery images={product.images.map(img => img.image)} title={product.title} />
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column - Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Host/Vhara Section */}
              <div className="animate-fade-left delay-200">
                <HostInfo />
              </div>

              {/* Description Section */}
              <div className="animate-fade-left delay-300">
                <ProductDescription
                  description={product.description}
                  title={product.title}
                  category={product.category}
                  condition="Good"
                />
              </div>

              {/* Vhara Service Section */}
              <div className="animate-fade-left delay-400">
                <VharaService />
              </div>

              {/* Details & Specifications */}
              <div className="animate-fade-left delay-500">
                <ItemDetails
                  category={product.category}
                  securityDeposit={product.securityDeposit}
                  condition="Good"
                />
              </div>

              {/* Availability Calendar */}
              <div className="animate-fade-left delay-600">
                <AvailabilitySection unavailableDates={product.unavailableDates.map(date => new Date(date.date))} />
              </div>

              {/* Reviews Section */}
              <div className="animate-fade-left delay-700">
                <ReviewsSection
                  averageRating={product.averageRating}
                  totalRentals={product.rentalCount}
                />
              </div>
            </div>

            {/* Right Column - Pricing Card */}
            <div className="lg:col-span-1 relative">
              <div className="animate-fade-right delay-200">
                <PricingCard
                  pricingTiers={product.pricingTiers}
                  minRentalPeriod={product.pricingTiers[0].maxPeriod || 1}
                  maxRentalPeriod={product.pricingTiers[0].maxPeriod || 30}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Similar Items */}
        <div className="animate-fade-up delay-1000">
          <SimilarItems
            items={similarItems}
            onQuickView={handleQuickView}
          />
        </div>
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