// components/listings/ListingCard.tsx
import { ListingFormData } from '@/types/listings';
import { Button } from '@/components/ui/button';

export const ListingCard = ({ listing }: { listing: ListingFormData }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium">{listing.title}</h3>
      <p className="text-sm text-gray-600">{listing.category}</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-green-600 font-medium">
          {listing.basePrice} Taka/{listing.durationUnit}
        </span>
        <Button variant="outline">Manage</Button>
      </div>
    </div>
  );
};