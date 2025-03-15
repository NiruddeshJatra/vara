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
  
  const names = [
    "DSLR Camera with 2 Lenses", "Electric Mountain Bike", "4-Person Camping Tent", 
    "Bluetooth Party Speaker", "MacBook Pro 16\"", "Wireless Drill Set",
    "GoPro HERO10 Black", "Carbon Road Bike", "Backpacking Kit", 
    "Noise Cancelling Headphones", "iPad Pro 12.9\"", "Professional Lawn Mower",
    "Sony Alpha a7 III", "Indoor Exercise Bike", "Hammock Set with Stand",
    "Karaoke Machine", "Gaming Laptop", "Pressure Washer"
  ];
  
  const categories = [
    "Photography & Videography", "Sports & Fitness", "Outdoor & Camping",
    "Audio & Entertainment", "Electronics & Gadgets", "Tools & Equipment"
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const catIndex = i % categories.length;
    const nameIndex = i % names.length;
    const imageIndex = i % imageCategories.length;
    
    return {
      id: i + 1,
      name: names[nameIndex],
      image: imageCategories[imageIndex][0], // Use first image as main image
      images: imageCategories[imageIndex],
      category: categories[catIndex],
      price: 10 + Math.floor(Math.random() * 90),
      duration: Math.random() > 0.5 ? "day" : "week",
      distance: +(Math.random() * 10).toFixed(1),
      rating: +(4 + Math.random()).toFixed(1),
      reviewCount: Math.floor(Math.random() * 50) + 5
    };
  });
};

// Export all listings for reuse in other components
export const allListings = generateListings(40);
