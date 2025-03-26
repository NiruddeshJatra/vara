import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductDescriptionProps {
  description: string;
  title: string;
  condition: string;
  category: string;
}

export default function ProductDescription({
  description,
  title,
  condition,
  category
}: ProductDescriptionProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  return (
    <div className="mb-10 pb-10 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">About this item</h2>
      <div className={`text-gray-600 space-y-4 ${!showFullDescription && 'line-clamp-4'}`}>
        <p>{description}</p>

        {/* Placeholder for longer descriptions */}
        <p>This {title} is in {condition} condition and ready for rental. It comes with all the standard features and is perfect for {category.toLowerCase()} enthusiasts.</p>
      </div>
      
      {description && description.length > 100 && (
        <Button 
          variant="ghost" 
          className="mt-3 text-green-600 font-medium px-0 hover:bg-transparent hover:underline"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? (
            <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
          ) : (
            <>Show more <ChevronDown className="h-4 w-4 ml-1" /></>
          )}
        </Button>
      )}
    </div>
  );
} 