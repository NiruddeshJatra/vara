/**
 * Product type constants for the frontend
 * These align with the backend CATEGORY_CHOICES and PRODUCT_TYPE_CHOICES
 */

export enum Category {
  PHOTOGRAPHY_VIDEOGRAPHY = 'Photography & Videography',
  SPORTS_FITNESS = 'Sports & Fitness',
  TOOLS_EQUIPMENT = 'Tools & Equipment',
  ELECTRONICS = 'Electronics',
  MUSICAL_INSTRUMENTS = 'Musical Instruments',
  PARTY_EVENTS = 'Party & Events',
  FASHION_ACCESSORIES = 'Fashion & Accessories',
  HOME_GARDEN = 'Home & Garden',
  BOOKS_MEDIA = 'Books & Media',
  TOYS_GAMES = 'Toys & Games',
  AUTOMOTIVE = 'Automotive',
  OTHER = 'Other'
}

export enum ProductType {
  // Photography & Videography
  CAMERA = 'camera',
  GIMBAL = 'gimbal',
  LIGHTING = 'lighting',
  VIDEO_ACC = 'video_acc',
  MICROPHONE = 'microphone',
  STUDIO_EQUIP = 'studio_equip',
  
  // Sports & Fitness
  BICYCLE = 'bicycle',
  SAFETY_GEAR = 'safety_gear',
  CRICKET = 'cricket',
  FOOTBALL = 'football',
  BASKETBALL = 'basketball',
  TENNIS = 'tennis',
  GYM_EQUIP = 'gym_equip',
  
  // Tools & Equipment
  POWER_TOOL = 'power_tool',
  HAND_TOOL = 'hand_tool',
  GARDEN_TOOL = 'garden_tool',
  LADDER = 'ladder',
  PAINT_SPRAYER = 'paint_sprayer',
  
  // Electronics
  LAPTOP = 'laptop',
  TABLET = 'tablet',
  SMARTPHONE = 'smartphone',
  GAMING_CONSOLE = 'gaming_console',
  TV = 'tv',
  SPEAKER = 'speaker',
  
  // Musical Instruments
  GUITAR = 'guitar',
  PIANO = 'piano',
  DRUMS = 'drums',
  AMPLIFIER = 'amplifier',
  
  // Party & Events
  TENT = 'tent',
  TABLE = 'table',
  CHAIR = 'chair',
  DECORATIONS = 'decorations',
  SOUND_SYSTEM = 'sound_system',
  
  // Fashion & Accessories
  FORMAL_WEAR = 'formal_wear',
  COSTUME = 'costume',
  JEWELRY = 'jewelry',
  ACCESSORIES = 'accessories',
  
  // Home & Garden
  FURNITURE = 'furniture',
  KITCHEN_APPLIANCE = 'kitchen_appliance',
  
  // Books & Media
  BOOK = 'book',
  MAGAZINE = 'magazine',
  MOVIE = 'movie',
  GAME = 'game',
  
  // Toys & Games
  BOARD_GAME = 'board_game',
  VIDEO_GAME = 'video_game',
  TOY = 'toy',
  PUZZLE = 'puzzle',
  
  // Automotive
  CAR = 'car',
  BIKE = 'bike',
  SCOOTER = 'scooter',
  AUTO_ACCESSORIES = 'auto_accessories',
  
  // Other
  OTHER = 'other'
}

export const CATEGORY_VALUES = Object.values(Category);
export const PRODUCT_TYPE_VALUES = Object.values(ProductType);

export const CATEGORY_DISPLAY: Record<Category, string> = {
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

export const PRODUCT_TYPE_DISPLAY: Record<ProductType, string> = {
  [ProductType.CAMERA]: 'Camera',
  [ProductType.GIMBAL]: 'Gimbal',
  [ProductType.LIGHTING]: 'Lighting Equipment',
  [ProductType.VIDEO_ACC]: 'Video Accessories',
  [ProductType.MICROPHONE]: 'Microphone',
  [ProductType.STUDIO_EQUIP]: 'Studio Equipment',
  [ProductType.BICYCLE]: 'Bicycle',
  [ProductType.SAFETY_GEAR]: 'Helmets & Safety Gear',
  [ProductType.CRICKET]: 'Cricket Equipment',
  [ProductType.FOOTBALL]: 'Football & Soccer Equipment',
  [ProductType.BASKETBALL]: 'Basketball Equipment',
  [ProductType.TENNIS]: 'Tennis Equipment',
  [ProductType.GYM_EQUIP]: 'Gym Equipment',
  [ProductType.POWER_TOOL]: 'Power Tools',
  [ProductType.HAND_TOOL]: 'Hand Tools',
  [ProductType.GARDEN_TOOL]: 'Garden Tools',
  [ProductType.LADDER]: 'Ladder',
  [ProductType.PAINT_SPRAYER]: 'Paint Sprayer',
  [ProductType.LAPTOP]: 'Laptop',
  [ProductType.TABLET]: 'Tablet',
  [ProductType.SMARTPHONE]: 'Smartphone',
  [ProductType.GAMING_CONSOLE]: 'Gaming Console',
  [ProductType.TV]: 'TV',
  [ProductType.SPEAKER]: 'Speaker',
  [ProductType.GUITAR]: 'Guitar',
  [ProductType.PIANO]: 'Piano',
  [ProductType.DRUMS]: 'Drums',
  [ProductType.AMPLIFIER]: 'Amplifier',
  [ProductType.TENT]: 'Tent',
  [ProductType.TABLE]: 'Table',
  [ProductType.CHAIR]: 'Chair',
  [ProductType.DECORATIONS]: 'Decorations',
  [ProductType.SOUND_SYSTEM]: 'Sound System',
  [ProductType.FORMAL_WEAR]: 'Formal Wear',
  [ProductType.COSTUME]: 'Costume',
  [ProductType.JEWELRY]: 'Jewelry',
  [ProductType.ACCESSORIES]: 'Accessories',
  [ProductType.FURNITURE]: 'Furniture',
  [ProductType.KITCHEN_APPLIANCE]: 'Kitchen Appliance',
  [ProductType.BOOK]: 'Book',
  [ProductType.MAGAZINE]: 'Magazine',
  [ProductType.MOVIE]: 'Movie',
  [ProductType.GAME]: 'Game',
  [ProductType.BOARD_GAME]: 'Board Game',
  [ProductType.VIDEO_GAME]: 'Video Game',
  [ProductType.TOY]: 'Toy',
  [ProductType.PUZZLE]: 'Puzzle',
  [ProductType.CAR]: 'Car',
  [ProductType.BIKE]: 'Bike',
  [ProductType.SCOOTER]: 'Scooter',
  [ProductType.AUTO_ACCESSORIES]: 'Auto Accessories',
  [ProductType.OTHER]: 'Other'
};

export const CATEGORY_PRODUCT_TYPES: Record<Category, ProductType[]> = {
  [Category.PHOTOGRAPHY_VIDEOGRAPHY]: [
    ProductType.CAMERA,
    ProductType.GIMBAL,
    ProductType.LIGHTING,
    ProductType.VIDEO_ACC,
    ProductType.MICROPHONE,
    ProductType.STUDIO_EQUIP
  ],
  [Category.SPORTS_FITNESS]: [
    ProductType.BICYCLE,
    ProductType.SAFETY_GEAR,
    ProductType.CRICKET,
    ProductType.FOOTBALL,
    ProductType.BASKETBALL,
    ProductType.TENNIS,
    ProductType.GYM_EQUIP
  ],
  [Category.TOOLS_EQUIPMENT]: [
    ProductType.POWER_TOOL,
    ProductType.HAND_TOOL,
    ProductType.GARDEN_TOOL,
    ProductType.LADDER,
    ProductType.PAINT_SPRAYER
  ],
  [Category.ELECTRONICS]: [
    ProductType.LAPTOP,
    ProductType.TABLET,
    ProductType.SMARTPHONE,
    ProductType.GAMING_CONSOLE,
    ProductType.TV,
    ProductType.SPEAKER
  ],
  [Category.MUSICAL_INSTRUMENTS]: [
    ProductType.GUITAR,
    ProductType.PIANO,
    ProductType.DRUMS,
    ProductType.AMPLIFIER
  ],
  [Category.PARTY_EVENTS]: [
    ProductType.TENT,
    ProductType.TABLE,
    ProductType.CHAIR,
    ProductType.DECORATIONS,
    ProductType.SOUND_SYSTEM
  ],
  [Category.FASHION_ACCESSORIES]: [
    ProductType.FORMAL_WEAR,
    ProductType.COSTUME,
    ProductType.JEWELRY,
    ProductType.ACCESSORIES
  ],
  [Category.HOME_GARDEN]: [
    ProductType.FURNITURE,
    ProductType.KITCHEN_APPLIANCE
  ],
  [Category.BOOKS_MEDIA]: [
    ProductType.BOOK,
    ProductType.MAGAZINE,
    ProductType.MOVIE,
    ProductType.GAME
  ],
  [Category.TOYS_GAMES]: [
    ProductType.BOARD_GAME,
    ProductType.VIDEO_GAME,
    ProductType.TOY,
    ProductType.PUZZLE
  ],
  [Category.AUTOMOTIVE]: [
    ProductType.CAR,
    ProductType.BIKE,
    ProductType.SCOOTER,
    ProductType.AUTO_ACCESSORIES
  ],
  [Category.OTHER]: [
    ProductType.OTHER
  ]
}; 