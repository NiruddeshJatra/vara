// pages/ItemDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import { Product } from '@/types/listings';
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
  HostInfo,
  ProductHistory
} from '@/components/itemDetail';
import { DurationUnit } from '@/constants/rental';
import productService from '@/services/product.service';

// Add custom styles for sticky element
const stickyStyles = `
  .pricing-card-container {
    position: relative;
  }
  
  @media (min-width: 1024px) {
    .pricing-card-container {
      position: sticky;
      top: 96px;
      z-index: 10;
      height: fit-content;
    }
  }
`;

export default function ItemDetailPage() {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similarItems, setSimilarItems] = useState<Product[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  useEffect(() => {
    // Check if product was passed via state (from modal)
    const passedProduct = location.state?.product;
    
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // If we have a product passed from state, use it directly
        if (passedProduct && passedProduct.id === productId) {
          console.log("Using product from state:", passedProduct);
          setProduct(passedProduct);
          
          // Fetch similar items from API
          const similarResponse = await productService.getSimilarProducts(passedProduct.id, passedProduct.category);
          setSimilarItems(similarResponse);
        } else {
          // Otherwise, fetch product from API
          console.log("Fetching product from API:", productId);
          const apiProduct = await productService.getProduct(productId as string);
          if (apiProduct) {
            setProduct(apiProduct);
            
            // Fetch similar items from API
            const similarResponse = await productService.getSimilarProducts(apiProduct.id, apiProduct.category);
            setSimilarItems(similarResponse);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, location.state]);

  const handleQuickView = (itemId: string) => {
    setSelectedItem(itemId);
    setIsItemModalOpen(true);
  };

  const getSelectedItem = () => {
    return similarItems.find(item => item.id === selectedItem);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 animate-fade-up">
            <ProductHeader
              title={product.title}
              averageRating={typeof product.averageRating === 'number' ? product.averageRating : 0}
              totalRentals={product.rentalCount || 0}
              location={product.location || 'Not specified'}
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
                    productType={product.productType}
                    securityDeposit={String(product.securityDeposit)}
                  />
                </div>
                
                {/* Product History */}
                <div className="animate-fade-left delay-550">
                  <ProductHistory
                    purchaseYear={product.purchaseYear}
                    ownershipHistory={product.ownershipHistory}
                    originalPrice={product.originalPrice}
                    totalRentals={product.rentalCount || 0}
                  />
                </div>

                {/* Availability Calendar */}
                <div className="animate-fade-left delay-600">
                  <AvailabilitySection 
                    unavailableDates={product.unavailableDates?.map(date => {
                      // Convert to proper Date objects
                      return new Date(date.date);
                    }) || []}
                  />
                </div>

                {/* Reviews Section */}
                <div className="animate-fade-left delay-700">
                  <ReviewsSection
                    averageRating={typeof product.averageRating === 'number' ? product.averageRating : 0}
                    totalRentals={product.rentalCount || 0}
                  />
                </div>
              </div>

              {/* Right Column - Pricing Card */}
              <div className="lg:col-span-1">
                <div className="animate-fade-right delay-200 pricing-card-container">
                  <PricingCard
                    pricingTiers={product.pricingTiers}
                    maxRentalPeriod={product.pricingTiers[0]?.maxPeriod || 30}
                    securityDeposit={product.securityDeposit}
                    productId={product.id}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Similar Items */}
          <div id="similar-items-section" className="animate-fade-up delay-1000 mt-12">
            <SimilarItems
              items={similarItems}
              onQuickView={handleQuickView}
            />
          </div>
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