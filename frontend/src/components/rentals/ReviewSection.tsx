// components/rentals/ReviewSection.tsx
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function ReviewsSection({ productId }: { productId: string }) {
  // Implement review fetching logic here
  
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>
      <div className="space-y-6">
        {/* Example Review */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-4 mb-2">
            <Avatar />
            <div>
              <h3 className="font-medium">John Doe</h3>
              <div className="flex items-center gap-1">
                ★★★★★ <span className="text-sm text-gray-500">2023-07-15</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600">"Great product, exactly as described!"</p>
        </div>
        
        <Button variant="outline" className="w-full">
          View All Reviews
        </Button>
      </div>
    </section>
  );
}