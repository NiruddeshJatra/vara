import { Button } from '../ui/button';
import ListingsGrid from '../advertisements/ListingsGrid';
import { useState } from 'react';
import ItemModal from '@/components/advertisements/ItemModal';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Product } from '@/types/listings';
import { DurationUnit } from '@/constants/rental';
import { Category, ProductType } from '@/constants/productTypes';

const FeaturedListings = () => {
  // Generate mock listings for display
  const mockListings: Product[] = [
    {
      id: '1',
      owner: 'user1',
      title: 'Canon EOS 80D DSLR Camera',
      category: Category.PHOTOGRAPHY_VIDEOGRAPHY,
      productType: ProductType.CAMERA,
      description: 'Perfect for events, travel, and content creation. Comes with 18-135mm lens.',
      location: 'Dhaka',
      securityDeposit: 5000,
      purchaseYear: '2022',
      originalPrice: 80000,
      ownershipHistory: 'First owner',
      status: 'AVAILABLE',
      statusMessage: null,
      statusChangedAt: null,
      images: [
        { id: 'img1', image: 'https://images.unsplash.com/photo-1549800026-02dd1c2bca6c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', createdAt: '2024-01-01' } // Canon DSLR
      ],
      unavailableDates: [],
      pricingTiers: [
        { id: 'pt1', durationUnit: 'day' as DurationUnit, price: 800, maxPeriod: 7 }
      ],
      viewsCount: 10,
      rentalCount: 2,
      averageRating: 4.5,
      createdAt: '2024-01-01',
      updatedAt: '2024-04-01',
    },
    {
      id: '2',
      owner: 'user2',
      title: 'Quechua Waterproof Tent (4 Person)',
      category: Category.PARTY_EVENTS,
      productType: ProductType.TENT,
      description: 'Spacious, easy to set up, and ideal for camping in Bangladesh.',
      location: 'Sylhet',
      securityDeposit: 2000,
      purchaseYear: '2021',
      originalPrice: 18000,
      ownershipHistory: 'Second owner',
      status: 'AVAILABLE',
      statusMessage: null,
      statusChangedAt: null,
      images: [
        { id: 'img2', image: 'https://images.unsplash.com/photo-1534950947221-dcaca2836ce8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', createdAt: '2024-01-02' } // 4 person tent
      ],
      unavailableDates: [],
      pricingTiers: [
        { id: 'pt2', durationUnit: 'day' as DurationUnit, price: 300, maxPeriod: 10 }
      ],
      viewsCount: 5,
      rentalCount: 1,
      averageRating: 4.3,
      createdAt: '2024-01-02',
      updatedAt: '2024-04-02',
    },
    {
      id: '3',
      owner: 'user3',
      title: 'Phoenix Mountain Bicycle',
      category: Category.SPORTS_FITNESS,
      productType: ProductType.BICYCLE,
      description: 'Durable, lightweight, and great for city or trail rides.',
      location: 'Chattogram',
      securityDeposit: 1500,
      purchaseYear: '2023',
      originalPrice: 25000,
      ownershipHistory: 'First owner',
      status: 'AVAILABLE',
      statusMessage: null,
      statusChangedAt: null,
      images: [
        { id: 'img3', image: 'https://images.unsplash.com/photo-1534150034764-046bf225d3fa?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', createdAt: '2024-01-03' } // Mountain bike
      ],
      unavailableDates: [],
      pricingTiers: [
        { id: 'pt3', durationUnit: 'day' as DurationUnit, price: 200, maxPeriod: 5 }
      ],
      viewsCount: 7,
      rentalCount: 0,
      averageRating: 4.7,
      createdAt: '2024-01-03',
      updatedAt: '2024-04-03',
    },
    {
      id: '4',
      owner: 'user4',
      title: 'Sony Bluetooth Speaker',
      category: Category.ELECTRONICS,
      productType: ProductType.SPEAKER,
      description: 'High-quality sound, portable, and perfect for parties or picnics.',
      location: 'Khulna',
      securityDeposit: 800,
      purchaseYear: '2020',
      originalPrice: 8000,
      ownershipHistory: 'First owner',
      status: 'AVAILABLE',
      statusMessage: null,
      statusChangedAt: null,
      images: [
        { id: 'img4', image: 'https://images.unsplash.com/photo-1617766376513-148515e5d3b8?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', createdAt: '2024-01-04' } // Sony Bluetooth speaker
      ],
      unavailableDates: [],
      pricingTiers: [
        { id: 'pt4', durationUnit: 'day' as DurationUnit, price: 100, maxPeriod: 3 }
      ],
      viewsCount: 4,
      rentalCount: 1,
      averageRating: 4.6,
      createdAt: '2024-01-04',
      updatedAt: '2024-04-04',
    },
  ];
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuickView = (itemId: string) => {
    setSelectedItem(itemId);
    setIsItemModalOpen(true);
  };

  const getSelectedItem = () => {
    return mockListings.find(item => item.id === selectedItem) || null;
  };

  return (
    <section className="py-12 md:py-24 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-up">
          <span className="inline-block px-4 py-1.5 text-xs md:text-sm font-medium rounded-full bg-green-600/10 text-green-600 mb-4">
            Featured
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-green-800 mb-4">
            Popular Items Near You
          </h2>
          <p className="text-green-700/80 mb-3 text-center text-[0.85rem]">
            Discover items available for rent in your area
          </p>
        </div>

        <section className="md:py-6 animate-fade-up delay-200">
          <div className="container mx-auto px-4">
            <ListingsGrid
              displayedListings={mockListings}
              handleQuickView={handleQuickView}
            />
          </div>
          <ItemModal
            isOpen={isItemModalOpen}
            onOpenChange={setIsItemModalOpen}
            selectedItem={getSelectedItem()}
          />
        </section>

        <div className="text-center mt-6 animate-fade-up delay-300">
          <Button
            variant="outline"
            className="py-6 px-8 text-sm md:text-md rounded-full font-semibold shadow-lg cursor-pointer transition-transform duration-300 ease-in-out hover:translate-y-[-2px] hover:shadow-xl text-black/70 hover:text-white border border-green-600 text-green-700 bg-white hover:bg-lime-600 hover:border-none"
            style={{ animationDelay: '0.5s' }}
            onClick={() => {
              navigate('/advertisements');
            }}
          >
            See All Available Items
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;