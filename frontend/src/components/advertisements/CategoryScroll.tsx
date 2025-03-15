import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Camera, Dumbbell, Tent, Headphones, Smartphone, PartyPopper, Wrench, Car, Bed, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
type Category = {
  id: number;
  name: string;
  icon: string;
  image: string;
  count: number;
};
type CategoryScrollProps = {
  categories: Category[];
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
};

// Map of category names to Lucide icons
const getCategoryIcon = (name: string) => {
  const iconMap: Record<string, JSX.Element> = {
    'Photography': <Camera className="h-6 w-6 text-vhara-800" />,
    'Fitness': <Dumbbell className="h-6 w-6 text-vhara-800" />,
    'Camping': <Tent className="h-6 w-6 text-vhara-800" />,
    'Audio': <Headphones className="h-6 w-6 text-vhara-800" />,
    'Electronics': <Smartphone className="h-6 w-6 text-vhara-800" />,
    'Party': <PartyPopper className="h-6 w-6 text-vhara-800" />,
    'Tools': <Wrench className="h-6 w-6 text-vhara-800" />,
    'Vehicles': <Car className="h-6 w-6 text-vhara-800" />,
    'Furniture': <Bed className="h-6 w-6 text-vhara-800" />,
    'Gaming': <Gamepad2 className="h-6 w-6 text-vhara-800" />
  };
  return iconMap[name] || <Wrench className="h-6 w-6 text-vhara-600" />;
};
const CategoryScroll = ({
  categories,
  selectedCategory,
  setSelectedCategory
}: CategoryScrollProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };
  return <div className="relative border-b border-gray-200 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto ">
        <div className="flex items-center">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border border-gray-200 bg-white mr-3 shadow-sm flex-shrink-0 z-10" onClick={scrollLeft}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div ref={scrollContainerRef} style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }} className="flex space-x-2 overflow-x-auto py-3 scrollbar-hide">
            <div className={`flex flex-col items-center cursor-pointer min-w-[80px] transition-opacity duration-200 ${selectedCategory === null ? 'opacity-100' : 'opacity-60'}`} onClick={() => setSelectedCategory(null)}>
              <div className={`flex items-center justify-center w-12 h-10 mb-1 ${selectedCategory === null ? 'border-b-2 border-vhara-600' : ''}`}>
                <Wrench className="h-6 w-6 text-vhara-800" />
              </div>
              <span className="text-xs text-green-800 font-medium text-center">All Items</span>
            </div>
            
            {categories.map(category => <div key={category.id} className={`flex flex-col items-center cursor-pointer min-w-[80px] transition-opacity duration-200 ${selectedCategory === category.id ? 'opacity-100' : 'opacity-60'}`} onClick={() => setSelectedCategory(category.id)}>
                <div className={`flex items-center justify-center w-12 h-10 mb-1 ${selectedCategory === category.id ? 'border-b-2 border-vhara-600' : ''}`}>
                  {getCategoryIcon(category.name)}
                </div>
                <span className="text-xs text-green-800 font-medium text-center">{category.name}</span>
              </div>)}
          </div>
          
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border border-gray-200 bg-white ml-3 shadow-sm flex-shrink-0 z-10" onClick={scrollRight}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>;
};
export default CategoryScroll;