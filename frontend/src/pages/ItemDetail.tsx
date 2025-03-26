// pages/ItemDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import ImageCarousel from '@/components/advertisements/ImageCarousel';
import ItemCard from '@/components/advertisements/ItemCard';
import { Product, DurationUnit } from '@/types/listings';
import { Star, MapPin, Clock, ShieldCheck, Calendar, Banknote, Share2, Bookmark, ChevronDown, ChevronUp, Truck, RefreshCw, MessageCircle, User, ArrowRight, Check, Plus } from 'lucide-react';
import { allListings } from '@/utils/mockDataGenerator';
import AvailabilityCalendar from '@/components/listings/AvailabilityCalendar';
import ItemModal from '@/components/advertisements/ItemModal';

export default function ItemDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similarItems, setSimilarItems] = useState<Product[]>([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activePeriod, setActivePeriod] = useState(0);
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700 mb-1">{product.title}</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-2 mb-4 text-sm">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-medium mr-1">{product.averageRating?.toFixed(1) || '4.9'}</span>
              <span className="text-gray-600">({product.totalRentals || 12} reviews)</span>
              <span className="mx-2 text-gray-400">•</span>
              <MapPin className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-gray-600">{product.location}</span>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              {product.category}
            </span>
          </div>
        </div>

        {/* Image Gallery Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="aspect-w-1 aspect-h-1 bg-white rounded-xl overflow-hidden shadow-sm">
              <img 
                src={product.images[0]} 
                alt={`${product.title} main`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-image.jpg';
                }}
              />
            </div>
            
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              {product.images.slice(1, 5).map((img, idx) => (
                <div 
                  key={idx} 
                  className="aspect-w-1 aspect-h-1 bg-white rounded-xl overflow-hidden shadow-sm"
                >
                  <img 
                    src={img} 
                    alt={`${product.title} view ${idx + 2}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-image.jpg';
                    }}
                  />
                </div>
              ))}
              
              {/* View all photos button if more than 5 images */}
              {product.images.length > 5 && (
                <button 
                  className="absolute bottom-4 right-4 bg-white text-gray-800 rounded-lg px-4 py-2 font-medium shadow-md hover:bg-gray-100 transition-colors flex items-center"
                >
                  <span className="mr-2">View all photos</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column - Content */}
            <div className="lg:col-span-2">
              {/* Host/Vhara Section */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-14 w-14 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Hosted and verified by Vhara</h2>
                    <p className="text-gray-600">You'll rent from the owner, but we handle everything</p>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="mb-10 pb-10 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About this item</h2>
                <div className={`text-gray-600 space-y-4 ${!showFullDescription && 'line-clamp-4'}`}>
                  <p>{product.description}</p>

                  {/* Placeholder for longer descriptions */}
                  <p>This {product.title} is in {product.condition} condition and ready for rental. It comes with all the standard features and is perfect for {product.category.toLowerCase()} enthusiasts. Available for rental in {product.location}.</p>
                </div>
                
                {product.description && product.description.length > 100 && (
                  <Button 
                    variant="ghost" 
                    className="mt-3 text-green-600 font-medium px-0 hover:bg-transparent hover:underline"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? (
                      <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
                    ) : (
                      <>Show more <ChevronDown className="h-4 w-4 ml-1" /></>
                    )}
                  </Button>
                )}
              </div>

              {/* Vhara Service Section */}
              <div className="mb-10 pb-10 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Vhara Service</h2>
                <div className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 bg-green-50 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <RefreshCw className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-green-800">We handle the entire rental process</h2>
                        <p className="text-green-700">Secure, verified, and hassle-free experience</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-green-50/60">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-green-100 p-1.5 flex-shrink-0">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-green-900">Item Collection</h4>
                          <p className="text-gray-600">We collect the item from the owner</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-green-100 p-1.5 flex-shrink-0">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-green-900">Quality Verification</h4>
                          <p className="text-gray-600">We inspect every item before delivery</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-green-100 p-1.5 flex-shrink-0">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-green-900">Delivery & Setup</h4>
                          <p className="text-gray-600">We deliver to your location</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-green-100 p-1.5 flex-shrink-0">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-green-900">Return Logistics</h4>
                          <p className="text-gray-600">We collect and return to the owner</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details & Specifications */}
              <div className="mb-10 pb-10 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Item details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-1">Condition</h4>
                    <p className="text-green-700 capitalize font-medium">{product.condition || 'Excellent'}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-1">Category</h4>
                    <p className="text-green-700 font-medium">{product.category}</p>
                  </div>
                  
                  {product.itemAge && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-1">Item Age</h4>
                      <p className="text-green-700 font-medium">{product.itemAge} years</p>
                    </div>
                  )}
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-1">Security Deposit</h4>
                    <p className="text-green-700 font-medium flex items-center">
                      <Banknote className="h-4 w-4 mr-1 text-green-600" />
                      ${product.securityDeposit || 0} <span className="text-xs text-green-600 ml-1">(Refundable)</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Availability Calendar */}
              <div className="mb-10 pb-10 border-b border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Availability</h2>
                  <div className="flex items-center text-sm text-green-700 bg-green-50 px-2 py-1 rounded-md">
                    <Calendar className="h-4 w-4 mr-1" />
                    Available Now
                  </div>
                </div>
                
                {product.availabilityPeriods && 
                  <AvailabilityCalendar availabilityPeriods={product.availabilityPeriods} />
                }
              </div>

              {/* Reviews Section */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-2" />
                    {product.averageRating?.toFixed(1) || '4.9'} · {product.totalRentals || 12} reviews
                  </h2>
                  {/* Updated button style to match "Add Period" button from AvailabilityStep */}
                  <Button
                    variant="outline"
                    className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-400"
                  >
                    <Plus size={16} className="mr-1" /> View all reviews
                  </Button>
                </div>
                
                {/* Individual reviews */}
                <div className="space-y-6">
                  {[
                    { name: 'Rahim Ahmed', rating: 5, review: 'Excellent product, just as described. Very happy with my rental experience. Vhara made the delivery and pickup process so smooth.', date: '3 weeks ago' },
                    { name: 'Sarah Khan', rating: 4, review: 'Good item, the quality was great. Vhara staff was very helpful with setup. Would definitely rent again from this platform.', date: '2 months ago' }
                  ].map((review, idx) => (
                    <div key={idx} className="pb-6 last:pb-0 last:border-0">
                      <div className="flex items-start">
                        <div className="mr-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-green-700 font-medium">{review.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{review.name}</h4>
                              <div className="flex items-center">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-xs text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.review}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Pricing & CTA */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <div className="bg-gradient-to-b from-white to-leaf-50 rounded-lg border border-gray-200 shadow-md p-4 sm:p-6 sticky top-24">
                <h2 className="text-lg sm:text-xl font-semibold mb-6 pb-3 border-b">Pricing Details</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Base Price:</span>
                    <div className="text-2xl font-bold text-green-600 flex items-center">
                      <Banknote className="h-5 w-5 mr-1 inline" />
                      {product.basePrice}
                    </div>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Per {product.durationUnit}</span>
                    <span>+ 5% Service Fee</span>
                  </div>

                  <div className="pt-4 space-y-2 border-t">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        Minimum Rental:
                      </span>
                      <span className="font-medium">
                        {product.minRentalPeriod} {product.durationUnit}s
                      </span>
                    </div>
                    {product.maxRentalPeriod && (
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          Maximum Rental:
                        </span>
                        <span className="font-medium">
                          {product.maxRentalPeriod} {product.durationUnit}s
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">Security Deposit</h3>
                      <div className="flex items-center text-gray-700">
                        <ShieldCheck className="h-4 w-4 text-green-600 mr-2" />
                        <Banknote className="h-4 w-4 mr-1 text-gray-600" />
                        <span>{product.securityDeposit || 0}</span>
                        <span className="text-xs text-gray-500 ml-2">(Refundable)</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 h-12 text-base"
                    >
                      <Link to={`/request-rental/${productId}`} className="w-full h-full flex items-center justify-center">
                        Request Rental Now
                      </Link>
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      No upfront payment required. Vhara handles the logistics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Items */}
        {similarItems.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-900 mb-2">Similar Items You May Like</h2>
              <Link to="/advertisements" className="text-green-600 font-medium flex items-center hover:underline">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {similarItems.map((item) => (
                <ItemCard
                  key={item.id}
                  product={item}
                  onQuickView={() => handleQuickView(item.id)}
                />
              ))}
            </div>
          </div>
        )}
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