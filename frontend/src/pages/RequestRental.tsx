// pages/RequestRental.tsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/listings';
import Footer from '@/components/home/Footer';
import RentalRequestStepper from '@/components/rentals/RentalRequestStepper';
import NavBar from '@/components/home/NavBar';

export default function RequestRentalPage() {
  const { productId } = useParams();
  
  const { data: product } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      return response.json();
    }
  });

  if (!product) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <RentalRequestStepper product={product} />
      <Footer />
    </div>
  );
}