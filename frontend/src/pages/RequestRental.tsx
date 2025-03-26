// pages/RequestRental.tsx
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Footer from '@/components/home/Footer';
import RentalRequestStepper from '@/components/rentals/RentalRequestStepper';
import NavBar from '@/components/home/NavBar';
import { Product } from '@/types/listings';
import { useEffect } from 'react';

export default function RequestRentalPage() {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product as Product;

  useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);

  if (!product) {
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