import { Button } from '../ui/button';
import ListingsGrid from '../advertisements/ListingsGrid';
import { useState } from 'react';
import ItemModal from '@/components/advertisements/ItemModal';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/listings';
import { DurationUnit } from '@/constants/rental';
import { Category, ProductType } from '@/constants/productTypes';
import { useTranslation } from 'react-i18next';

const FeaturedListings = () => {
  const { t } = useTranslation();
  // Generate mock listings for display
  const mockListings: Product[] = [
    {
      id: '1',
      owner: { id: 'user1', full_name: 'Rahim Uddin', trust_level: 'verified' as const, average_rating: '4.5' },
      title: 'Canon EOS 80D DSLR Camera',
      category: Category.PHOTOGRAPHY_VIDEOGRAPHY,
      product_type: ProductType.CAMERA,
      description: 'Perfect for events, travel, and content creation. Comes with 18-135mm lens.',
      location: 'Dhaka',
      security_deposit: '5000',
      purchase_year: '2022',
      original_price: '80000',
      ownership_history: 'First owner',
      status: 'AVAILABLE',
      images: [
        { id: 'img1', image: 'https://images.unsplash.com/photo-1549800026-02dd1c2bca6c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', created_at: '2024-01-01' } // Canon DSLR
      ],
      unavailable_periods: [],
      pricing_tiers: [
        { id: 'pt1', duration_unit: 'day' as DurationUnit, price: 800, max_period: 7 }
      ],
      views_count: 10,
      rental_count: 2,
      average_rating: '4.5',
      created_at: '2024-01-01',
      updated_at: '2024-04-01',
    },
    {
      id: '2',
      owner: { id: 'user2', full_name: 'Karim Hossain', trust_level: 'verified' as const, average_rating: '4.3' },
      title: 'Quechua Waterproof Tent (4 Person)',
      category: Category.CAMPING_HIKING,
      product_type: ProductType.TENT,
      description: 'Spacious, easy to set up, and ideal for camping in Bangladesh.',
      location: 'Sylhet',
      security_deposit: '2000',
      purchase_year: '2021',
      original_price: '18000',
      ownership_history: 'Second owner',
      status: 'AVAILABLE',
      images: [
        { id: 'img2', image: 'https://images.unsplash.com/photo-1534950947221-dcaca2836ce8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', created_at: '2024-01-02' } // 4 person tent
      ],
      unavailable_periods: [],
      pricing_tiers: [
        { id: 'pt2', duration_unit: 'day' as DurationUnit, price: 300, max_period: 10 }
      ],
      views_count: 5,
      rental_count: 1,
      average_rating: '4.3',
      created_at: '2024-01-02',
      updated_at: '2024-04-02',
    },
    {
      id: '3',
      owner: { id: 'user3', full_name: 'Fatema Begum', trust_level: 'verified' as const, average_rating: '4.7' },
      title: 'Phoenix Mountain Bicycle',
      category: Category.SPORTS_OUTDOOR,
      product_type: ProductType.BICYCLE,
      description: 'Durable, lightweight, and great for city or trail rides.',
      location: 'Chattogram',
      security_deposit: '1500',
      purchase_year: '2023',
      original_price: '25000',
      ownership_history: 'First owner',
      status: 'AVAILABLE',
      images: [
        { id: 'img3', image: 'https://images.unsplash.com/photo-1534150034764-046bf225d3fa?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', created_at: '2024-01-03' } // Mountain bike
      ],
      unavailable_periods: [],
      pricing_tiers: [
        { id: 'pt3', duration_unit: 'day' as DurationUnit, price: 200, max_period: 5 }
      ],
      views_count: 7,
      rental_count: 0,
      average_rating: '4.7',
      created_at: '2024-01-03',
      updated_at: '2024-04-03',
    },
    {
      id: '4',
      owner: { id: 'user4', full_name: 'Sumon Ahmed', trust_level: 'verified' as const, average_rating: '4.6' },
      title: 'Sony Bluetooth Speaker',
      category: Category.ELECTRONICS,
      product_type: ProductType.SPEAKER,
      description: 'High-quality sound, portable, and perfect for parties or picnics.',
      location: 'Khulna',
      security_deposit: '800',
      purchase_year: '2020',
      original_price: '8000',
      ownership_history: 'First owner',
      status: 'AVAILABLE',
      images: [
        { id: 'img4', image: 'https://images.unsplash.com/photo-1617766376513-148515e5d3b8?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', created_at: '2024-01-04' } // Sony Bluetooth speaker
      ],
      unavailable_periods: [],
      pricing_tiers: [
        { id: 'pt4', duration_unit: 'day' as DurationUnit, price: 100, max_period: 3 }
      ],
      views_count: 4,
      rental_count: 1,
      average_rating: '4.6',
      created_at: '2024-01-04',
      updated_at: '2024-04-04',
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
            {t('home.featured.badge')}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-green-800 mb-4">
            {t('home.featured.title')}
          </h2>
          <p className="text-green-700/80 mb-3 text-center text-[0.85rem]">
            {t('home.featured.subtitle')}
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
            {t('home.featured.viewAll')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;