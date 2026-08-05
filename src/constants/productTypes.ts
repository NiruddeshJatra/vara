/**
 * Product type constants for the frontend
 * These align exactly with the backend CATEGORY_CHOICES and PRODUCT_TYPE_CHOICES
 */

// Categories - matches CATEGORY_CHOICES
export const Category = {
  PHOTOGRAPHY_VIDEOGRAPHY: 'photography_videography',
  SPORTS_OUTDOOR: 'sports_outdoor',
  CAMPING_HIKING: 'camping_hiking',
  TRAVEL_LUGGAGE: 'travel_luggage',
  EVENT_PARTY: 'event_party',
  FASHION_ACCESSORIES: 'fashion_accessories',
  ELECTRONICS: 'electronics',
  TOOLS_EQUIPMENT: 'tools_equipment',
  MUSICAL_INSTRUMENTS: 'musical_instruments',
  OTHER: 'other'
} as const;

// Product Types - matches PRODUCT_TYPE_CHOICES
export const ProductType = {
  // Photography & Videography
  CAMERA: 'camera',
  LENS: 'lens',
  GIMBAL: 'gimbal',
  TRIPOD: 'tripod',
  DRONE: 'drone',
  LIGHTING: 'lighting',
  VIDEO_CAMERA: 'video_camera',
  MICROPHONE: 'microphone',
  STABILIZER: 'stabilizer',
  SLIDER: 'slider',
  REFLECTOR: 'reflector',
  MONITOR: 'monitor',
  MEMORY_CARD: 'memory_card',
  BATTERY: 'battery',
  CHARGER: 'charger',
  LIGHT_STAND: 'light_stand',
  SOFTBOX: 'softbox',
  BACKDROP: 'backdrop',

  // Sports & Outdoor
  CRICKET_BAT: 'cricket_bat',
  FOOTBALL: 'football',
  BADMINTON_RACKET: 'badminton_racket',
  HELMET: 'helmet',
  SPORTS_GEAR: 'sports_gear',
  RUNNING_SHOES: 'running_shoes',
  BICYCLE: 'bicycle',
  SKIPPING_ROPE: 'skipping_rope',

  // Camping & Hiking
  BACKPACK: 'backpack',
  HEADLAMP: 'headlamp',
  GAS_CAN: 'gas_can',
  RAINCOVER: 'raincover',
  PONCHO: 'poncho',
  JACKET: 'jacket',
  SLEEPING_BAG: 'sleeping_bag',
  TENT: 'tent',
  STOVE: 'stove',
  WATER_BOTTLE: 'water_bottle',
  HIKING_POLE: 'hiking_pole',
  CAMPING_CHAIR: 'camping_chair',

  // Travel & Luggage
  SUITCASE: 'suitcase',
  TRAVEL_ADAPTER: 'travel_adapter',
  POWER_BANK: 'power_bank',
  TRAVEL_BAG: 'travel_bag',
  TROLLEY: 'trolley',

  // Event & Party
  SOUND_SYSTEM: 'sound_system',
  DECORATIONS: 'decorations',
  CHAIR: 'chair',
  TABLE: 'table',
  STAGE_LIGHT: 'stage_light',
  PROJECTOR: 'projector',
  TENT_EVENT: 'tent_event',

  // Fashion & Accessories
  FORMAL_WEAR: 'formal_wear',
  JEWELRY: 'jewelry',
  COSTUME: 'costume',
  WATCH: 'watch',
  SUNGLASSES: 'sunglasses',

  // Electronics
  LAPTOP: 'laptop',
  TABLET: 'tablet',
  SMARTPHONE: 'smartphone',
  PROJECTOR_ELEC: 'projector_elec',
  SPEAKER: 'speaker',
  TV: 'tv',
  PRINTER: 'printer',
  SCANNER: 'scanner',
  ROUTER: 'router',

  // Tools & Equipment
  POWER_TOOLS: 'power_tools',
  HAND_TOOLS: 'hand_tools',
  MEASURING_TAPE: 'measuring_tape',
  DRILL_MACHINE: 'drill_machine',
  LADDER: 'ladder',
  CLEANING_EQUIPMENT: 'cleaning_equipment',

  // Musical Instruments
  GUITAR: 'guitar',
  KEYBOARD: 'keyboard',
  HARMONIUM: 'harmonium',
  TABLA: 'tabla',
  MICROPHONE_MUSIC: 'microphone_music',
  AMPLIFIER: 'amplifier',
  DRUM: 'drum',
  VIOLIN: 'violin',

  // Other
  OTHER: 'other'
} as const;

// Helper arrays for iteration
export const CATEGORY_VALUES = Object.values(Category);
export const PRODUCT_TYPE_VALUES = Object.values(ProductType);

// Display names for categories
export const CATEGORY_DISPLAY: Record<string, string> = {
  [Category.PHOTOGRAPHY_VIDEOGRAPHY]: 'Photography & Videography',
  [Category.SPORTS_OUTDOOR]: 'Sports & Outdoor',
  [Category.CAMPING_HIKING]: 'Camping & Hiking',
  [Category.TRAVEL_LUGGAGE]: 'Travel & Luggage',
  [Category.EVENT_PARTY]: 'Event & Party',
  [Category.FASHION_ACCESSORIES]: 'Fashion & Accessories',
  [Category.ELECTRONICS]: 'Electronics',
  [Category.TOOLS_EQUIPMENT]: 'Tools & Equipment',
  [Category.MUSICAL_INSTRUMENTS]: 'Musical Instruments',
  [Category.OTHER]: 'Other'
};

// Display names for product types
export const PRODUCT_TYPE_DISPLAY: Record<string, string> = {
  // Photography & Videography
  [ProductType.CAMERA]: 'Camera',
  [ProductType.LENS]: 'Lens',
  [ProductType.GIMBAL]: 'Gimbal',
  [ProductType.TRIPOD]: 'Tripod',
  [ProductType.DRONE]: 'Drone',
  [ProductType.LIGHTING]: 'Lighting Equipment',
  [ProductType.VIDEO_CAMERA]: 'Video Camera',
  [ProductType.MICROPHONE]: 'Microphone',
  [ProductType.STABILIZER]: 'Stabilizer',
  [ProductType.SLIDER]: 'Slider',
  [ProductType.REFLECTOR]: 'Reflector',
  [ProductType.MONITOR]: 'Monitor',
  [ProductType.MEMORY_CARD]: 'Memory Card',
  [ProductType.BATTERY]: 'Battery',
  [ProductType.CHARGER]: 'Charger',
  [ProductType.LIGHT_STAND]: 'Light Stand',
  [ProductType.SOFTBOX]: 'Softbox',
  [ProductType.BACKDROP]: 'Backdrop',

  // Sports & Outdoor
  [ProductType.CRICKET_BAT]: 'Cricket Bat',
  [ProductType.FOOTBALL]: 'Football',
  [ProductType.BADMINTON_RACKET]: 'Badminton Racket',
  [ProductType.HELMET]: 'Helmet',
  [ProductType.SPORTS_GEAR]: 'Sports Gear',
  [ProductType.RUNNING_SHOES]: 'Running Shoes',
  [ProductType.BICYCLE]: 'Bicycle',
  [ProductType.SKIPPING_ROPE]: 'Skipping Rope',

  // Camping & Hiking
  [ProductType.BACKPACK]: 'Backpack',
  [ProductType.HEADLAMP]: 'Headlamp',
  [ProductType.GAS_CAN]: 'Gas Can',
  [ProductType.RAINCOVER]: 'Raincover',
  [ProductType.PONCHO]: 'Poncho',
  [ProductType.JACKET]: 'Jacket',
  [ProductType.SLEEPING_BAG]: 'Sleeping Bag',
  [ProductType.TENT]: 'Tent',
  [ProductType.STOVE]: 'Stove',
  [ProductType.WATER_BOTTLE]: 'Water Bottle',
  [ProductType.HIKING_POLE]: 'Hiking Pole',
  [ProductType.CAMPING_CHAIR]: 'Camping Chair',

  // Travel & Luggage
  [ProductType.SUITCASE]: 'Suitcase',
  [ProductType.TRAVEL_ADAPTER]: 'Travel Adapter',
  [ProductType.POWER_BANK]: 'Power Bank',
  [ProductType.TRAVEL_BAG]: 'Travel Bag',
  [ProductType.TROLLEY]: 'Trolley',

  // Event & Party
  [ProductType.SOUND_SYSTEM]: 'Sound System',
  [ProductType.DECORATIONS]: 'Decorations',
  [ProductType.CHAIR]: 'Chair',
  [ProductType.TABLE]: 'Table',
  [ProductType.STAGE_LIGHT]: 'Stage Light',
  [ProductType.PROJECTOR]: 'Projector',
  [ProductType.TENT_EVENT]: 'Tent',

  // Fashion & Accessories
  [ProductType.FORMAL_WEAR]: 'Formal Wear',
  [ProductType.JEWELRY]: 'Jewelry',
  [ProductType.COSTUME]: 'Costume',
  [ProductType.WATCH]: 'Watch',
  [ProductType.SUNGLASSES]: 'Sunglasses',

  // Electronics
  [ProductType.LAPTOP]: 'Laptop',
  [ProductType.TABLET]: 'Tablet',
  [ProductType.SMARTPHONE]: 'Smartphone',
  [ProductType.PROJECTOR_ELEC]: 'Projector',
  [ProductType.SPEAKER]: 'Speaker',
  [ProductType.TV]: 'TV',
  [ProductType.PRINTER]: 'Printer',
  [ProductType.SCANNER]: 'Scanner',
  [ProductType.ROUTER]: 'Router',

  // Tools & Equipment
  [ProductType.POWER_TOOLS]: 'Power Tools',
  [ProductType.HAND_TOOLS]: 'Hand Tools',
  [ProductType.MEASURING_TAPE]: 'Measuring Tape',
  [ProductType.DRILL_MACHINE]: 'Drill Machine',
  [ProductType.LADDER]: 'Ladder',
  [ProductType.CLEANING_EQUIPMENT]: 'Cleaning Equipment',

  // Musical Instruments
  [ProductType.GUITAR]: 'Guitar',
  [ProductType.KEYBOARD]: 'Keyboard',
  [ProductType.HARMONIUM]: 'Harmonium',
  [ProductType.TABLA]: 'Tabla',
  [ProductType.MICROPHONE_MUSIC]: 'Microphone',
  [ProductType.AMPLIFIER]: 'Amplifier',
  [ProductType.DRUM]: 'Drum',
  [ProductType.VIOLIN]: 'Violin',

  // Other
  [ProductType.OTHER]: 'Other'
};

// Product type to category mapping - matches PRODUCT_TYPE_CHOICES
export const PRODUCT_TYPE_CATEGORY: Record<string, string> = {
  // Photography & Videography
  [ProductType.CAMERA]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.LENS]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.GIMBAL]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.TRIPOD]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.DRONE]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.LIGHTING]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.VIDEO_CAMERA]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.MICROPHONE]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.STABILIZER]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.SLIDER]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.REFLECTOR]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.MONITOR]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.MEMORY_CARD]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.BATTERY]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.CHARGER]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.LIGHT_STAND]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.SOFTBOX]: Category.PHOTOGRAPHY_VIDEOGRAPHY,
  [ProductType.BACKDROP]: Category.PHOTOGRAPHY_VIDEOGRAPHY,

  // Sports & Outdoor
  [ProductType.CRICKET_BAT]: Category.SPORTS_OUTDOOR,
  [ProductType.FOOTBALL]: Category.SPORTS_OUTDOOR,
  [ProductType.BADMINTON_RACKET]: Category.SPORTS_OUTDOOR,
  [ProductType.HELMET]: Category.SPORTS_OUTDOOR,
  [ProductType.SPORTS_GEAR]: Category.SPORTS_OUTDOOR,
  [ProductType.RUNNING_SHOES]: Category.SPORTS_OUTDOOR,
  [ProductType.BICYCLE]: Category.SPORTS_OUTDOOR,
  [ProductType.SKIPPING_ROPE]: Category.SPORTS_OUTDOOR,

  // Camping & Hiking
  [ProductType.BACKPACK]: Category.CAMPING_HIKING,
  [ProductType.HEADLAMP]: Category.CAMPING_HIKING,
  [ProductType.GAS_CAN]: Category.CAMPING_HIKING,
  [ProductType.RAINCOVER]: Category.CAMPING_HIKING,
  [ProductType.PONCHO]: Category.CAMPING_HIKING,
  [ProductType.JACKET]: Category.CAMPING_HIKING,
  [ProductType.SLEEPING_BAG]: Category.CAMPING_HIKING,
  [ProductType.TENT]: Category.CAMPING_HIKING,
  [ProductType.STOVE]: Category.CAMPING_HIKING,
  [ProductType.WATER_BOTTLE]: Category.CAMPING_HIKING,
  [ProductType.HIKING_POLE]: Category.CAMPING_HIKING,
  [ProductType.CAMPING_CHAIR]: Category.CAMPING_HIKING,

  // Travel & Luggage
  [ProductType.SUITCASE]: Category.TRAVEL_LUGGAGE,
  [ProductType.TRAVEL_ADAPTER]: Category.TRAVEL_LUGGAGE,
  [ProductType.POWER_BANK]: Category.TRAVEL_LUGGAGE,
  [ProductType.TRAVEL_BAG]: Category.TRAVEL_LUGGAGE,
  [ProductType.TROLLEY]: Category.TRAVEL_LUGGAGE,

  // Event & Party
  [ProductType.SOUND_SYSTEM]: Category.EVENT_PARTY,
  [ProductType.DECORATIONS]: Category.EVENT_PARTY,
  [ProductType.CHAIR]: Category.EVENT_PARTY,
  [ProductType.TABLE]: Category.EVENT_PARTY,
  [ProductType.STAGE_LIGHT]: Category.EVENT_PARTY,
  [ProductType.PROJECTOR]: Category.EVENT_PARTY,
  [ProductType.TENT_EVENT]: Category.EVENT_PARTY,

  // Fashion & Accessories
  [ProductType.FORMAL_WEAR]: Category.FASHION_ACCESSORIES,
  [ProductType.JEWELRY]: Category.FASHION_ACCESSORIES,
  [ProductType.COSTUME]: Category.FASHION_ACCESSORIES,
  [ProductType.WATCH]: Category.FASHION_ACCESSORIES,
  [ProductType.SUNGLASSES]: Category.FASHION_ACCESSORIES,

  // Electronics
  [ProductType.LAPTOP]: Category.ELECTRONICS,
  [ProductType.TABLET]: Category.ELECTRONICS,
  [ProductType.SMARTPHONE]: Category.ELECTRONICS,
  [ProductType.PROJECTOR_ELEC]: Category.ELECTRONICS,
  [ProductType.SPEAKER]: Category.ELECTRONICS,
  [ProductType.TV]: Category.ELECTRONICS,
  [ProductType.PRINTER]: Category.ELECTRONICS,
  [ProductType.SCANNER]: Category.ELECTRONICS,
  [ProductType.ROUTER]: Category.ELECTRONICS,

  // Tools & Equipment
  [ProductType.POWER_TOOLS]: Category.TOOLS_EQUIPMENT,
  [ProductType.HAND_TOOLS]: Category.TOOLS_EQUIPMENT,
  [ProductType.MEASURING_TAPE]: Category.TOOLS_EQUIPMENT,
  [ProductType.DRILL_MACHINE]: Category.TOOLS_EQUIPMENT,
  [ProductType.LADDER]: Category.TOOLS_EQUIPMENT,
  [ProductType.CLEANING_EQUIPMENT]: Category.TOOLS_EQUIPMENT,

  // Musical Instruments
  [ProductType.GUITAR]: Category.MUSICAL_INSTRUMENTS,
  [ProductType.KEYBOARD]: Category.MUSICAL_INSTRUMENTS,
  [ProductType.HARMONIUM]: Category.MUSICAL_INSTRUMENTS,
  [ProductType.TABLA]: Category.MUSICAL_INSTRUMENTS,
  [ProductType.MICROPHONE_MUSIC]: Category.MUSICAL_INSTRUMENTS,
  [ProductType.AMPLIFIER]: Category.MUSICAL_INSTRUMENTS,
  [ProductType.DRUM]: Category.MUSICAL_INSTRUMENTS,
  [ProductType.VIOLIN]: Category.MUSICAL_INSTRUMENTS,

  // Other
  [ProductType.OTHER]: Category.OTHER
}; 