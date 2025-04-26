import { useRef, useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Dumbbell,
  Tent,
  Smartphone,
  PartyPopper,
  Wrench,
  Music,
  Shirt,
  MoreHorizontal,
  Luggage,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Category } from '@/constants/productTypes';

type Category = {
  id: string;
  name: string;
  icon: string;
  image: string;
  count: number;
};

type CategoryScrollProps = {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
};

// Map of icon names to Lucide icons (updated for new categories)
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, JSX.Element> = {
    // Photography & Videography
    'photography_videography': <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-vhara-800" />,
    // Sports & Outdoor
    'sports_outdoor': <Dumbbell className="h-5 w-5 sm:h-6 sm:w-6 text-vhara-800" />,
    // Camping & Hiking
    'camping_hiking': <Tent className="h-5 w-5 sm:h-6 sm:w-6 text-vhara-800" />,
    // Travel & Luggage
    'travel_luggage': <Luggage className="h-5 w-5 sm:h-6 sm:w-6 text-vhara-800" />,
    // Event & Party
    'event_party': <PartyPopper className="h-5 w-5 sm:h-6 sm:w-6 text-vhara-800" />,
    // Fashion & Accessories
    'fashion_accessories': <Shirt className="h-5 w-5 sm:h-6 sm:w-6 text-vhara-800" />,
    // Electronics
    'electronics': <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-vhara-800" />,
    // Tools & Equipment
    'tools_equipment': <Wrench className="h-5 w-5 sm:h-6 sm:w-6 text-vhara-800" />,
    // Musical Instruments
    'musical_instruments': <Music className="h-5 w-5 sm:h-6 sm:w-6 text-vhara-800" />,
    // Other
    'other': <MoreHorizontal className="h-5 w-5 sm:h-6 sm:w-6 text-vhara-800" />,
  };
  return iconMap[iconName] || <MoreHorizontal className="h-5 w-5 sm:h-6 sm:w-6 text-vhara-800" />;
};

const CategoryScroll = ({
  categories,
  selectedCategory,
  setSelectedCategory
}: CategoryScrollProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        setShowScrollButtons(
          scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth
        );
      }
    };

    // Check initially and on resize
    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  const categoryBarStyle = isScrolled 
    ? 'bg-green-50/90 backdrop-blur-md shadow-subtle' 
    : 'bg-transparent';

  return (
    <div className={`sticky top-[68px] sm:top-[68px] border-b border-gray-200 z-10 ${categoryBarStyle}`}>
      <div className="flex items-center justify-between container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-center w-full">
          {showScrollButtons && (
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 sm:h-8 sm:w-8 rounded-full border border-gray-200 bg-white mr-1 sm:mr-3 shadow-sm flex-shrink-0 z-10" 
              onClick={scrollLeft}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
          
          <div 
            ref={scrollContainerRef} 
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }} 
            className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 sm:py-3 scrollbar-hide justify-start sm:justify-center"
          >
            <div 
              className={`flex flex-col items-center cursor-pointer min-w-[60px] sm:min-w-[80px] transition-opacity duration-200 ${selectedCategory === null ? 'opacity-100' : 'opacity-70'}`} 
              onClick={() => setSelectedCategory(null)}
            >
              <div className={`flex items-center justify-center w-10 sm:w-12 h-8 sm:h-10 mb-1 ${selectedCategory === null ? 'border-b-2 border-vhara-600' : ''}`}>
                <Wrench className="h-5 w-5 sm:h-6 sm:w-6 text-vhara-800" />
              </div>
              <span className="text-[10px] sm:text-xs text-green-800 font-medium text-center">All Items</span>
            </div>
            
            {categories.map(category => (
              <div 
                key={category.id} 
                className={`flex flex-col items-center cursor-pointer min-w-[60px] sm:min-w-[80px] transition-opacity duration-200 ${selectedCategory === category.id ? 'opacity-100' : 'opacity-70'}`} 
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className={`flex items-center justify-center w-10 sm:w-12 h-8 sm:h-10 mb-1 ${selectedCategory === category.id ? 'border-b-2 border-vhara-600' : ''}`}>
                  {getIconComponent(category.icon)}
                </div>
                <span className="text-[10px] sm:text-xs text-green-800 font-medium text-center truncate max-w-[60px] sm:max-w-[80px]">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
          
          {showScrollButtons && (
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 sm:h-8 sm:w-8 rounded-full border border-gray-200 bg-white ml-1 sm:ml-3 shadow-sm flex-shrink-0 z-10" 
              onClick={scrollRight}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryScroll;