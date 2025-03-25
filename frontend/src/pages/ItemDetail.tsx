// pages/ItemDetail.tsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import ItemModal from '@/components/advertisements/ItemModal';
import AvailabilityCalendar from '@/components/listings/AvailabilityCalendar';
import ImageCarousel from '@/components/advertisements/ImageCarousel';
import ItemCard from '@/components/advertisements/ItemCard';
import { Product } from '@/types/listings';
import { Star, MapPin, Clock, ShieldCheck, Calendar } from 'lucide-react';

export default function ItemDetailPage() {
  const { productId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch product data
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    }
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error.message}</div>;
  if (!product) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        {/* Quick View Button */}
        <div className="mb-4 md:hidden">
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            Quick View
          </Button>
        </div>

        {/* Product Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {product.location}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <ItemModal
              isOpen={isModalOpen}
              onOpenChange={setIsModalOpen}
              selectedItem={product}
            />

            {/* Image Carousel */}
            <div className="mb-8">
              <ImageCarousel images={product.images} />
            </div>

            {/* Owner Section */}
            <section className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Owner Information</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium">{product.owner}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    Verified User
                  </p>
                </div>
                <Button variant="outline">Contact Owner</Button>
              </div>
            </section>

            {/* Detailed Description */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Detailed Description</h2>
              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Condition</h3>
                  <p className="text-gray-600 capitalize">{product.condition || 'Excellent'}</p>
                </div>
                {product.itemAge && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Item Age</h3>
                    <p className="text-gray-600">{product.itemAge} years</p>
                  </div>
                )}
              </div>
            </section>

            {/* Reviews Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold text-green-600">
                    {product.averageRating?.toFixed(1) || '4.5'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < (product.averageRating || 4.5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">
                      ({product.totalRentals || 0} rentals)
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View All Reviews
                </Button>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Pricing Card */}
            <div className="bg-green-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Pricing Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Base Price:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {product.basePrice} Taka
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Per {product.durationUnit}</span>
                  <span>+ 5% Service Fee</span>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Minimum Rental:
                    </span>
                    <span>
                      {product.minRentalPeriod} {product.durationUnit}s
                    </span>
                  </div>
                  {product.maxRentalPeriod && (
                    <div className="flex justify-between">
                      <span>Maximum Rental:</span>
                      <span>
                        {product.maxRentalPeriod} {product.durationUnit}s
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Availability Calendar */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-green-600" />
                Availability
              </h2>
              <AvailabilityCalendar
                availabilityPeriods={product.availabilityPeriods}
              />
            </div>

            {/* Rental Request CTA */}
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Ready to Rent?</h2>
              <Button
                asChild
                className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg"
              >
                <Link to={`/request-rental/${productId}`}>
                  Request Rental Now
                </Link>
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                Security deposit: {product.securityDeposit || 0} Taka
              </p>
            </div>
          </div>
        </div>

        {/* Similar Items */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <ItemCard
                key={item}
                product={product} // Pass actual similar products from API
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}