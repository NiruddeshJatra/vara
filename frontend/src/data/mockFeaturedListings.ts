import { Product } from '@/types/listings';
import { DurationUnit } from '@/constants/rental';

export const mockFeaturedListings: Product[] = [
  {
    id: '1',
    owner: '1',
    title: 'Professional DSLR Camera',
    category: 'electronics',
    productType: 'camera',
    description: 'High-quality DSLR camera with 24.2MP sensor, perfect for photography enthusiasts.',
    location: 'Dhaka',
    securityDeposit: 500,
    purchaseYear: '2022',
    originalPrice: 1500,
    ownershipHistory: 'Owned for 1 year',
    status: 'active',
    statusMessage: 'Available for rent',
    statusChangedAt: new Date().toISOString(),
    images: [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        createdAt: new Date().toISOString()
      }
    ],
    unavailableDates: [],
    pricingTiers: [
      {
        id: '1',
        durationUnit: DurationUnit.DAY,
        price: 500,
        maxPeriod: 30
      },
      {
        id: '2',
        durationUnit: DurationUnit.WEEK,
        price: 3000,
        maxPeriod: 30
      },
      {
        id: '3',
        durationUnit: DurationUnit.MONTH,
        price: 1000,
        maxPeriod: 30
      }
    ],
    viewsCount: 125,
    rentalCount: 8,
    averageRating: 4.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    owner: '2',
    title: 'Premium Camping Tent',
    category: 'outdoor',
    productType: 'tent',
    description: 'Spacious 4-person tent with waterproof design and easy setup.',
    location: 'Dhaka',
    securityDeposit: 300,
    purchaseYear: '2021',
    originalPrice: 1200,
    ownershipHistory: 'Owned for 2 years',
    status: 'active',
    statusMessage: 'Available for rent',
    statusChangedAt: new Date().toISOString(),
    images: [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        image: 'https://images.unsplash.com/photo-1557682250-33bd308c5acb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        createdAt: new Date().toISOString()
      }
    ],
    unavailableDates: [],
    pricingTiers: [
      {
        id: '1',
        durationUnit: DurationUnit.DAY,
        price: 300,
        maxPeriod: 30
      },
      {
        id: '2',
        durationUnit: DurationUnit.WEEK,
        price: 1800,
        maxPeriod: 30
      },
      {
        id: '3',
        durationUnit: DurationUnit.MONTH,
        price: 600,
        maxPeriod: 30
      }
    ],
    viewsCount: 98,
    rentalCount: 5,
    averageRating: 4.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    owner: '3',
    title: 'Camera Tripod Kit',
    category: 'electronics',
    productType: 'accessories',
    description: 'Professional photography tripod kit with ball head and carrying case.',
    location: 'Dhaka',
    securityDeposit: 400,
    purchaseYear: '2022',
    originalPrice: 1800,
    ownershipHistory: 'Owned for 1 year',
    status: 'active',
    statusMessage: 'Available for rent',
    statusChangedAt: new Date().toISOString(),
    images: [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1587204760600-77d8d18d143e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        image: 'https://images.unsplash.com/photo-1588077447514-2960da4dab1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        createdAt: new Date().toISOString()
      }
    ],
    unavailableDates: [],
    pricingTiers: [
      {
        id: '1',
        durationUnit: DurationUnit.DAY,
        price: 400,
        maxPeriod: 30
      },
      {
        id: '2',
        durationUnit: DurationUnit.WEEK,
        price: 2400,
        maxPeriod: 30
      },
      {
        id: '3',
        durationUnit: DurationUnit.MONTH,
        price: 800,
        maxPeriod: 30
      }
    ],
    viewsCount: 150,
    rentalCount: 10,
    averageRating: 4.9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    owner: '4',
    title: 'SteadyGrip Camera Stabilizer',
    category: 'electronics',
    productType: 'gimbal',
    description: 'Professional 3-axis gimbal stabilizer for smooth video capture.',
    location: 'Dhaka',
    securityDeposit: 350,
    purchaseYear: '2021',
    originalPrice: 1300,
    ownershipHistory: 'Owned for 2 years',
    status: 'active',
    statusMessage: 'Available for rent',
    statusChangedAt: new Date().toISOString(),
    images: [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1503177757247-03a572161a63?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        image: 'https://images.unsplash.com/photo-1556905055-8a5031077131?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        createdAt: new Date().toISOString()
      }
    ],
    unavailableDates: [],
    pricingTiers: [
      {
        id: '1',
        durationUnit: DurationUnit.DAY,
        price: 350,
        maxPeriod: 30
      },
      {
        id: '2',
        durationUnit: DurationUnit.WEEK,
        price: 2100,
        maxPeriod: 30
      },
      {
        id: '3',
        durationUnit: DurationUnit.MONTH,
        price: 700,
        maxPeriod: 30
      }
    ],
    viewsCount: 112,
    rentalCount: 6,
    averageRating: 4.7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
