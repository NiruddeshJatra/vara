// components/advertisements/ImageCarousel.tsx
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

export default function ImageCarousel({ images }: { images: string[] }) {
  return (
    <Carousel>
      <CarouselContent>
        {images.map((img, index) => (
          <CarouselItem key={index}>
            <img 
              src={img} 
              alt={`Product view ${index + 1}`}
              className="w-full h-96 object-cover rounded-lg"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}