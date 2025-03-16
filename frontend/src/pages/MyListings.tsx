// pages/MyListings.tsx
import { ListingCard } from '@/components/listings/ListingCard';
import { Button } from '@/components/ui/button';

export default function MyListings() {
  // Temporary data - replace with real data
  const listings: any[] = [];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Button asChild>
          <a href="/create-listing">+ Create New Listing</a>
        </Button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No listings found</p>
          <Button asChild>
            <a href="/create-listing">Create Your First Listing</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing, index) => (
            <ListingCard key={index} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}