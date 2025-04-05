/**
 * Product type constants for the frontend
 * These align exactly with the backend CATEGORY_CHOICES and PRODUCT_TYPE_CHOICES
 */

// Categories - matches CATEGORY_CHOICES
export const Category = {
  PHOTOGRAPHY_VIDEOGRAPHY: 'photography_videography',
  SPORTS_FITNESS: 'sports_fitness',
  TOOLS_EQUIPMENT: 'tools_equipment',
  ELECTRONICS: 'electronics',
  MUSICAL_INSTRUMENTS: 'musical_instruments',
  PARTY_EVENTS: 'party_events',
  FASHION_ACCESSORIES: 'fashion_accessories',
  HOME_GARDEN: 'home_garden',
  BOOKS_MEDIA: 'books_media',
  TOYS_GAMES: 'toys_games',
  AUTOMOTIVE: 'automotive',
  OTHER: 'other'
} as const;

// Product Types - matches PRODUCT_TYPE_CHOICES
export const ProductType = {
  // Photography & Videography
  CAMERA: 'camera',
  LENS: 'lens',
  GIMBAL: 'gimbal',
  DRONE: 'drone',
  LIGHTING: 'lighting',
  TRIPOD: 'tripod',
  MICROPHONE: 'microphone',
  VIDEO_CAMERA: 'video_camera',
  
  // Sports & Fitness
  BICYCLE: 'bicycle',
  TREADMILL: 'treadmill',
  YOGA_MAT: 'yoga_mat',
  DUMBBELLS: 'dumbbells',
  SPORTS_EQUIPMENT: 'sports_equipment',
  
  // Tools & Equipment
  POWER_TOOLS: 'power_tools',
  HAND_TOOLS: 'hand_tools',
  GARDENING_TOOLS: 'gardening_tools',
  CLEANING_EQUIPMENT: 'cleaning_equipment',
  
  // Electronics
  LAPTOP: 'laptop',
  TABLET: 'tablet',
  SMARTPHONE: 'smartphone',
  GAMING_CONSOLE: 'gaming_console',
  TV: 'tv',
  SPEAKER: 'speaker',
  
  // Musical Instruments
  GUITAR: 'guitar',
  PIANO: 'piano',
  DRUMS: 'drums',
  AMPLIFIER: 'amplifier',
  
  // Party & Events
  TENT: 'tent',
  TABLE: 'table',
  CHAIR: 'chair',
  DECORATIONS: 'decorations',
  SOUND_SYSTEM: 'sound_system',
  
  // Fashion & Accessories
  FORMAL_WEAR: 'formal_wear',
  COSTUME: 'costume',
  JEWELRY: 'jewelry',
  FASHION_ACCESSORIES: 'fashion_accessories',
  
  // Home & Garden
  FURNITURE: 'furniture',
  KITCHEN_APPLIANCE: 'kitchen_appliance',
  GARDEN_TOOLS: 'garden_tools',
  DECOR: 'decor',
  
  // Books & Media
  BOOK: 'book',
  MAGAZINE: 'magazine',
  MOVIE: 'movie',
  GAME: 'game',
  
  // Toys & Games
  BOARD_GAME: 'board_game',
  VIDEO_GAME: 'video_game',
  TOY: 'toy',
  PUZZLE: 'puzzle',
  
  // Automotive
  CAR: 'car',
  BIKE: 'bike',
  SCOOTER: 'scooter',
  AUTO_ACCESSORIES: 'auto_accessories',
  
  // Other
  OTHER: 'other'
} as const;

// Helper arrays for iteration
export const CATEGORY_VALUES = Object.values(Category);
export const PRODUCT_TYPE_VALUES = Object.values(ProductType);

// Display names for categories
export const CATEGORY_DISPLAY: Record<string, string> = {
  [Category.PHOTOGRAPHY_VIDEOGRAPHY]: 'Photography & Videography',
  [Category.SPORTS_FITNESS]: 'Sports & Fitness',
  [Category.TOOLS_EQUIPMENT]: 'Tools & Equipment',
  [Category.ELECTRONICS]: 'Electronics',
  [Category.MUSICAL_INSTRUMENTS]: 'Musical Instruments',
  [Category.PARTY_EVENTS]: 'Party & Events',
  [Category.FASHION_ACCESSORIES]: 'Fashion & Accessories',
  [Category.HOME_GARDEN]: 'Home & Garden',
  [Category.BOOKS_MEDIA]: 'Books & Media',
  [Category.TOYS_GAMES]: 'Toys & Games',
  [Category.AUTOMOTIVE]: 'Automotive',
  [Category.OTHER]: 'Other'
};

// Display names for product types
export const PRODUCT_TYPE_DISPLAY: Record<string, string> = {
  // Photography & Videography
  [ProductType.CAMERA]: 'Camera',
  [ProductType.LENS]: 'Lens',
  [ProductType.GIMBAL]: 'Gimbal',
  [ProductType.DRONE]: 'Drone',
  [ProductType.LIGHTING]: 'Lighting Equipment',
  [ProductType.TRIPOD]: 'Tripod',
  [ProductType.MICROPHONE]: 'Microphone',
  [ProductType.VIDEO_CAMERA]: 'Video Camera',
  
  // Sports & Fitness
  [ProductType.BICYCLE]: 'Bicycle',
  [ProductType.TREADMILL]: 'Treadmill',
  [ProductType.YOGA_MAT]: 'Yoga Mat',
  [ProductType.DUMBBELLS]: 'Dumbbells',
  [ProductType.SPORTS_EQUIPMENT]: 'Sports Equipment',
  
  // Tools & Equipment
  [ProductType.POWER_TOOLS]: 'Power Tools',
  [ProductType.HAND_TOOLS]: 'Hand Tools',
  [ProductType.GARDENING_TOOLS]: 'Gardening Tools',
  [ProductType.CLEANING_EQUIPMENT]: 'Cleaning Equipment',
  
  // Electronics
  [ProductType.LAPTOP]: 'Laptop',
  [ProductType.TABLET]: 'Tablet',
  [ProductType.SMARTPHONE]: 'Smartphone',
  [ProductType.GAMING_CONSOLE]: 'Gaming Console',
  [ProductType.TV]: 'TV',
  [ProductType.SPEAKER]: 'Speaker',
  
  // Musical Instruments
  [ProductType.GUITAR]: 'Guitar',
  [ProductType.PIANO]: 'Piano',
  [ProductType.DRUMS]: 'Drums',
  [ProductType.AMPLIFIER]: 'Amplifier',
  
  // Party & Events
  [ProductType.TENT]: 'Tent',
  [ProductType.TABLE]: 'Table',
  [ProductType.CHAIR]: 'Chair',
  [ProductType.DECORATIONS]: 'Decorations',
  [ProductType.SOUND_SYSTEM]: 'Sound System',
  
  // Fashion & Accessories
  [ProductType.FORMAL_WEAR]: 'Formal Wear',
  [ProductType.COSTUME]: 'Costume',
  [ProductType.JEWELRY]: 'Jewelry',
  [ProductType.FASHION_ACCESSORIES]: 'Fashion Accessories',
  
  // Home & Garden
  [ProductType.FURNITURE]: 'Furniture',
  [ProductType.KITCHEN_APPLIANCE]: 'Kitchen Appliance',
  [ProductType.GARDEN_TOOLS]: 'Garden Tools',
  [ProductType.DECOR]: 'Decor',
  
  // Books & Media
  [ProductType.BOOK]: 'Book',
  [ProductType.MAGAZINE]: 'Magazine',
  [ProductType.MOVIE]: 'Movie',
  [ProductType.GAME]: 'Game',
  
  // Toys & Games
  [ProductType.BOARD_GAME]: 'Board Game',
  [ProductType.VIDEO_GAME]: 'Video Game',
  [ProductType.TOY]: 'Toy',
  [ProductType.PUZZLE]: 'Puzzle',
  
  // Automotive
  [ProductType.CAR]: 'Car',
  [ProductType.BIKE]: 'Bike',
  [ProductType.SCOOTER]: 'Scooter',
  [ProductType.AUTO_ACCESSORIES]: 'Auto Accessories',
  
  // Other
  [ProductType.OTHER]: 'Other'
};

// Product type to category mapping - matches PRODUCT_TYPE_CHOICES
export const PRODUCT_TYPE_CATEGORY: Record<string, string> = {
  // Photography & Videography
  [ProductType.CAMERA]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.LENS]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.GIMBAL]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.DRONE]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.LIGHTING]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.TRIPOD]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.MICROPHONE]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.VIDEO_CAMERA]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  
  // Sports & Fitness
  [ProductType.BICYCLE]: Category.SPORTS_FITNESS,
  [ProductType.TREADMILL]: Category.SPORTS_FITNESS,
  [ProductType.YOGA_MAT]: Category.SPORTS_FITNESS,
  [ProductType.DUMBBELLS]: Category.SPORTS_FITNESS,
  [ProductType.SPORTS_EQUIPMENT]: Category.SPORTS_FITNESS,
  
  // Tools & Equipment
  [ProductType.POWER_TOOLS]: Category.TOOLS_EQUIPMENT,
  [ProductType.HAND_TOOLS]: Category.TOOLS_EQUIPMENT,
  [ProductType.GARDENING_TOOLS]: Category.TOOLS_EQUIPMENT,
  [ProductType.CLEANING_EQUIPMENT]: Category.TOOLS_EQUIPMENT,
  
  // Electronics
  [ProductType.LAPTOP]: Category.ELECTRONICS,
  [ProductType.TABLET]: Category.ELECTRONICS,
  [ProductType.SMARTPHONE]: Category.ELECTRONICS,
  [ProductType.GAMING_CONSOLE]: Category.ELECTRONICS,
  [ProductType.TV]: Category.ELECTRONICS,
  [ProductType.SPEAKER]: Category.ELECTRONICS,
  
  // Musical Instruments
  [ProductType.GUITAR]: Category.MUSICAL_INSTRUMENTS,
  [ProductType.PIANO]: Category.MUSICAL_INSTRUMENTS,
  [ProductType.DRUMS]: Category.MUSICAL_INSTRUMENTS,
  [ProductType.AMPLIFIER]: Category.MUSICAL_INSTRUMENTS,
  
  // Party & Events
  [ProductType.TENT]: Category.PARTY_EVENTS,
  [ProductType.TABLE]: Category.PARTY_EVENTS,
  [ProductType.CHAIR]: Category.PARTY_EVENTS,
  [ProductType.DECORATIONS]: Category.PARTY_EVENTS,
  [ProductType.SOUND_SYSTEM]: Category.PARTY_EVENTS,
  
  // Fashion & Accessories
  [ProductType.FORMAL_WEAR]: Category.FASHION_ACCESSORIES,
  [ProductType.COSTUME]: Category.FASHION_ACCESSORIES,
  [ProductType.JEWELRY]: Category.FASHION_ACCESSORIES,
  [ProductType.FASHION_ACCESSORIES]: Category.FASHION_ACCESSORIES,
  
  // Home & Garden
  [ProductType.FURNITURE]: Category.HOME_GARDEN,
  [ProductType.KITCHEN_APPLIANCE]: Category.HOME_GARDEN,
  [ProductType.GARDEN_TOOLS]: Category.HOME_GARDEN,
  [ProductType.DECOR]: Category.HOME_GARDEN,
  
  // Books & Media
  [ProductType.BOOK]: Category.BOOKS_MEDIA,
  [ProductType.MAGAZINE]: Category.BOOKS_MEDIA,
  [ProductType.MOVIE]: Category.BOOKS_MEDIA,
  [ProductType.GAME]: Category.BOOKS_MEDIA,
  
  // Toys & Games
  [ProductType.BOARD_GAME]: Category.TOYS_GAMES,
  [ProductType.VIDEO_GAME]: Category.TOYS_GAMES,
  [ProductType.TOY]: Category.TOYS_GAMES,
  [ProductType.PUZZLE]: Category.TOYS_GAMES,
  
  // Automotive
  [ProductType.CAR]: Category.AUTOMOTIVE,
  [ProductType.BIKE]: Category.AUTOMOTIVE,
  [ProductType.SCOOTER]: Category.AUTOMOTIVE,
  [ProductType.AUTO_ACCESSORIES]: Category.AUTOMOTIVE,
  
  // Other
  [ProductType.OTHER]: Category.OTHER
}; 