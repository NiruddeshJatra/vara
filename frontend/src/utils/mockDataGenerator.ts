// Generate mock data for listings and categories

// Mock categories data
export const categories = [
  {
    id: 1,
    name: 'Photography',
    icon: 'camera',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 345
  },
  {
    id: 2,
    name: 'Sports',
    icon: 'dumbbell',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 452
  },
  {
    id: 3,
    name: 'Camping',
    icon: 'tent',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 287
  },
  {
    id: 4,
    name: 'Audio',
    icon: 'headphones',
    image: 'https://images.unsplash.com/photo-1558379330-cbcc3e522b5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 368
  },
  {
    id: 5,
    name: 'Electronics',
    icon: 'smartphone',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 512
  },
  {
    id: 6,
    name: 'Party',
    icon: 'party-popper',
    image: 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 189
  },
  {
    id: 7,
    name: 'Tools',
    icon: 'wrench',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 276
  },
  {
    id: 8,
    name: 'Vehicles',
    icon: 'car',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 189
  },
  {
    id: 9,
    name: 'Furniture',
    icon: 'bed',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 230
  },
  {
    id: 10,
    name: 'Games',
    icon: 'gamepad-2',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 312
  }
];

// Generator function for mock listings
export const generateListings = (count: number) => {
  const imageCategories = [
    // Camera/Photo equipment
    ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
     'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
     'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    
    // Bike/Sports equipment
    ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
     'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
     'https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    
    // Camping
    ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
     'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
     'https://images.unsplash.com/photo-1539183204366-63a0589187ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    
    // Audio
    ['https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
     'https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
     'https://images.unsplash.com/photo-1558379330-cbcc3e522b5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    
    // Electronics
    ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
     'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
     'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    
    // Tools
    ['https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
     'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
     'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80']
  ];
  
  const products = [
    {
      title: "Canon EOS 5D Mark IV DSLR Camera",
      category: "Photography",
      description: "Professional-grade DSLR with 30.4MP full-frame sensor. Perfect for events, portraits, and landscapes. Includes 24-70mm and 50mm lenses.",
      basePrice: 1500,
      images: imageCategories[0]
    },
    {
      title: "Sony Alpha a7 III Mirrorless Camera",
      category: "Photography",
      description: "Full-frame mirrorless camera with exceptional low-light performance. 24.2MP sensor with 5-axis stabilization. Includes charging equipment.",
      basePrice: 1200,
      images: imageCategories[0]
    },
    {
      title: "Trek Marlin 7 Mountain Bike",
      category: "Sports",
      description: "High-performance mountain bike with lightweight aluminum frame. 29-inch wheels, hydraulic disc brakes, and front suspension.",
      basePrice: 700,
      images: imageCategories[1]
    },
    {
      title: "Specialized Road Bike - Carbon Frame",
      category: "Sports",
      description: "Carbon fiber road bike for racing or training. Shimano 105 groupset, 22 speeds. Recently serviced and in excellent condition.",
      basePrice: 900,
      images: imageCategories[1]
    },
    {
      title: "Coleman 4-Person Dome Tent",
      category: "Camping",
      description: "Spacious tent that sets up in under 10 minutes. Weatherproof with reinforced seams. Includes rainfly, stakes, and carrying bag.",
      basePrice: 300,
      images: imageCategories[2]
    },
    {
      title: "Complete Backpacking Kit - Tent, Sleeping Bag & Pad",
      category: "Camping",
      description: "Everything you need for a weekend adventure. Lightweight 2-person tent, 20°F sleeping bag, and inflatable sleeping pad.",
      basePrice: 450,
      images: imageCategories[2]
    },
    {
      title: "JBL PartyBox 300 Bluetooth Speaker",
      category: "Audio",
      description: "Powerful portable speaker with vivid light show. 18 hours of battery life, 120W output. Perfect for parties and outdoor events.",
      basePrice: 250,
      images: imageCategories[3]
    },
    {
      title: "Sony WH-1000XM4 Noise Cancelling Headphones",
      category: "Audio",
      description: "Industry-leading noise cancellation headphones with 30-hour battery life. Bluetooth, touch controls, and exceptional sound quality.",
      basePrice: 150,
      images: imageCategories[3]
    },
    {
      title: "MacBook Pro 16\" (2021, M1 Pro)",
      category: "Electronics",
      description: "Apple's flagship laptop with M1 Pro chip. 16GB RAM, 512GB SSD. Perfect for professional video editing, design work, or development.",
      basePrice: 2000,
      images: imageCategories[4]
    },
    {
      title: "iPad Pro 12.9\" with Apple Pencil",
      category: "Electronics",
      description: "Latest iPad Pro with Liquid Retina XDR display. Includes Apple Pencil (2nd gen) for drawing or note-taking. 256GB storage.",
      basePrice: 1100,
      images: imageCategories[4]
    },
    {
      title: "DeWalt Cordless Drill Set (20V)",
      category: "Tools",
      description: "Professional drill with 2 batteries, charger, and hard case. Includes 30-piece bit set for various projects. Lightweight and powerful.",
      basePrice: 180,
      images: imageCategories[5]
    },
    {
      title: "Pressure Washer - 3000 PSI Electric",
      category: "Tools",
      description: "Electric pressure washer with 25ft hose and 5 interchangeable nozzles. Perfect for cleaning decks, patios, cars, and more.",
      basePrice: 220,
      images: imageCategories[5]
    },
  ];
  
  const locations = [
    "GEC, Chittagong", 
    "Agrabad, Chittagong", 
    "Khulshi, Chittagong", 
    "Halishahar, Chittagong",
    "Nasirabad, Chittagong"
  ];
  
  const owners = [
    "Rohit Sharma", 
    "Ananya Khan", 
    "Mahfuz Ahmed", 
    "Priya Chowdhury",
    "Safwan Rahman"
  ];
  
  const conditions = ["excellent", "good", "fair"] as const;
  
  const DURATION_CHOICES = [
    { value: 'hour' },
    { value: 'day' },
    { value: 'week' },
    { value: 'month' }
  ];

  return Array.from({ length: count }, (_, i) => {
    const product = products[i % products.length];
    return {
      id: `item-${i}`,
      title: product.title,
      owner: owners[i % owners.length],
      category: product.category,
      description: product.description,
      location: locations[i % locations.length],
      basePrice: product.basePrice + (i % 5) * 100,
      durationUnit: DURATION_CHOICES[i % DURATION_CHOICES.length].value,
      minRentalPeriod: 1 + (i % 3),
      maxRentalPeriod: i % 2 === 0 ? 7 + (i % 8) : undefined,
      availabilityPeriods: [{
        startDate: new Date(Date.now()).toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        available: true,
        notes: "Available anytime"
      }],
      images: product.images,
      totalRentals: Math.floor(Math.random() * 50) + 5,
      averageRating: 3.5 + Math.random() * 1.5,
      condition: conditions[i % conditions.length],
      itemAge: 1 + i % 5,
      securityDeposit: Math.round(product.basePrice * 0.3)
    };
  });
};

// Export all listings for reuse in other components
export const allListings = generateListings(40);
