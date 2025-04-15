import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Banknote, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Product } from '@/types/listings';
import { Category, CATEGORY_DISPLAY } from '@/constants/productTypes';
import productService from '@/services/product.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const ProfileListings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const { products } = await productService.getUserProducts();
      setListings(products);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Handle listing deletion
  const handleDeleteListing = async (listingId: string) => {
    setProductToDelete(listingId);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await productService.deleteProduct(productToDelete);
      // Fetch fresh listings after deletion
      await fetchListings();
      setListings(listings.filter(listing => listing.id !== productToDelete));
      toast({
        title: "Success",
        description: "Product deleted successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleteConfirmationOpen(false);
      setProductToDelete(null);
    }
  };

  // Handle listing edit
  const handleEditListing = (listingId: string) => {
    navigate(`/upload-product/`, {
      state: { 
        initialData: listings.find(listing => listing.id === listingId),
        isEditing: true,
        productId: listingId
      }
    });
  };

  // Handle view listing
  const handleViewListing = (listingId: string) => {
    navigate(`/items/${listingId}`);
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">No Products Yet</h3>
        <p className="mt-2 text-sm text-gray-500 bg-green-600">
          You haven't uploaded any products for rent yet.
        </p>
        <Button
          className="mt-4"
          onClick={() => navigate('/upload-product/')}
        >
          Upload Your First Product
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="relative h-60 overflow-hidden">
              <img
                src={listing.images[0]?.image || '/images/placeholder-image.jpg'}
                alt={listing.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-image.jpg';
                }}
              />
              <Badge variant="secondary" className="absolute top-2 left-2 bg-white/90 text-green-800">
                {CATEGORY_DISPLAY[listing.category as keyof typeof CATEGORY_DISPLAY]}
              </Badge>
            </div>
            
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">{listing.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-yellow-500">
                  <Star size={14} className="fill-current" />
                  <span className="ml-1 text-sm font-medium">
                    {typeof listing.averageRating === 'number' ? listing.averageRating.toFixed(1) : '0.0'}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Banknote size={16} className="text-green-700 mr-1" />
                  <span className="text-lg font-bold text-green-700">
                    {listing.pricingTiers?.[0]?.price || 'N/A'}
                  </span>
                  <span className="text-sm font-semibold text-green-700 ml-1">
                    /{listing.pricingTiers?.[0]?.durationUnit || 'N/A'}
                  </span>
                </div>
                {listing.securityDeposit > 0 && (
                  <div className="text-sm text-gray-500">
                    Deposit: {listing.securityDeposit}
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="text-green-700 border-green-200 hover:bg-green-100 hover:text-green-700"
                onClick={() => handleViewListing(listing.id)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-700 border-green-200 hover:bg-green-100 hover:text-green-700"
                  onClick={() => handleEditListing(listing.id)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-100 hover:text-red-600"
                  onClick={() => handleDeleteListing(listing.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileListings;