import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  category,
}: ProductDescriptionProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="mb-6 sm:mb-10 pb-6 sm:pb-10 border-b border-gray-200">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">
        About this item
      </h3>
      <div
        className={`text-gray-600 space-y-2 sm:space-y-4 ${
          !showFullDescription && "line-clamp-4"
        }`}
      >
        <p className="text-sm/6 sm:text-base/6">{description}</p>

        {/* Placeholder for longer descriptions */}
        <p className="text-sm/6 sm:text-base/6">
          This {title} is in {condition} condition and ready for rental. It
          comes with all the standard features and is perfect for{" "}
          {category.toLowerCase()} enthusiasts.
        </p>
      </div>

      {description && description.length > 100 && (
        <Button
          variant="ghost"
          className="mt-2 sm:mt-3 text-green-600 font-medium px-0 hover:bg-transparent hover:underline text-xs sm:text-base"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? (
            <>
              Show less <ChevronUp className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              Show more <ChevronDown className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
