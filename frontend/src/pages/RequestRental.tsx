import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Footer from '@/components/home/Footer';
import RentalRequestStepper from '@/components/rentals/RentalRequestStepper';
import NavBar from '@/components/home/NavBar';
import { Product } from '@/types/listings';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import productService from '@/services/product.service';
import { AlertCircle } from 'lucide-react';

export default function RequestRentalPage() {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Handle user authentication
  useEffect(() => {
    if (!user) {
      navigate('/auth/login/', { state: { returnTo: location.pathname } });
      return;
    }

    if (!user.profileCompleted) {
      navigate('/auth/complete-profile', { state: { returnTo: location.pathname } });
      return;
    }
  }, [user, navigate, location.pathname]);

  // Validate and fetch product data if needed
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('No product ID provided');
        return;
      }

      // If we already have the product data from state, use it
      if (product) {
        console.log('Using product data from navigation state:', { 
          id: product.id,
          title: product.title,
          pricingTiers: product.pricingTiers?.length || 0,
          images: product.images?.length || 0
        });
        return;
      }

      // Otherwise fetch it from the API
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching product data for ID:', productId);
        const fetchedProduct = await productService.getProduct(productId);
        
        if (fetchedProduct) {
          console.log('Successfully fetched product data:', { 
            id: fetchedProduct.id,
            title: fetchedProduct.title,
            pricingTiers: fetchedProduct.pricingTiers?.length || 0,
            images: fetchedProduct.images?.length || 0
          });
          
          // Validate that the product has pricing tiers
          if (!fetchedProduct.pricingTiers || fetchedProduct.pricingTiers.length === 0) {
            setError('This product does not have any pricing options available');
          } else {
            setProduct(fetchedProduct);
          }
        } else {
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, product]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow flex items-center justify-center py-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading rental details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow flex items-center justify-center py-10">
          <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg border border-red-100">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">Unable to Process Rental Request</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/advertisements')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Browse Available Items
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // No product or not authenticated
  if (!product || !user?.profileCompleted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <RentalRequestStepper product={product} />
      <Footer />
    </div>
  );
}