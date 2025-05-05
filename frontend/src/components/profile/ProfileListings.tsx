import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Banknote, Star, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Product } from '@/types/listings';
import { Category, CATEGORY_DISPLAY } from '@/constants/productTypes';
import productService from '@/services/product.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { normalizeProductToFormData } from '@/utils/normalizeProductToFormData';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateProducts, removeProductFromCache } from '@/lib/query-invalidation';

const ProfileListings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Fetch user's listings using React Query
  const { data: listings = [], isLoading, error } = useQuery({
    queryKey: ['userProducts'],
    queryFn: async () => {
      const result = await productService.getUserProducts();
      return result.products;
    },
    staleTime: 1000 * 30, // Data considered fresh for 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true
  });

  // Delete product mutation with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: (productId: string) => productService.deleteProduct(productId),
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['userProducts'] });
      await queryClient.cancelQueries({ queryKey: ['products'] });

      // Snapshot the previous value
      const previousUserProducts = queryClient.getQueryData(['userProducts']);

      // Optimistically update the cache
      queryClient.setQueryData(['userProducts'], (old: any) => ({
        ...old,
        products: old.products.filter((p: Product) => p.id !== productId)
      }));

      return { previousUserProducts };
    },
    onSuccess: (_, productId) => {
      // Remove the product from cache completely
      removeProductFromCache(productId);
      // Invalidate related queries to refetch fresh data
      invalidateProducts();
      
      setDeleteConfirmationOpen(false);
      setProductToDelete(null);
      
      toast({
        title: "Success",
        description: "Product deleted successfully.",
        variant: "default"
      });
    },
    onError: (error, _, context) => {
      // Rollback to the previous value if mutation fails
      if (context?.previousUserProducts) {
        queryClient.setQueryData(['userProducts'], context.previousUserProducts);
      }
      
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleEditListing = (listingId: string) => {
    const product = listings.find(listing => listing.id === listingId);
    if (!product) return;
    
    navigate('/upload-product', {
      state: {
        initialData: normalizeProductToFormData(product),
        isEditing: true,
        productId: listingId
      }
    });
  };

  // Handle view listing
  const handleViewListing = (listingId: string) => {
    navigate(`/items/${listingId}`);
  };

  const handleDeleteListing = (productId: string) => {
    setProductToDelete(productId);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-red-600">Error Loading Products</h3>
        <p className="mt-2 text-sm text-gray-500">
          Failed to load your products. Please try again later.
        </p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">No Products Yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          You haven't uploaded any products for rent yet.
        </p>
        <Button
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow-md font-semibold text-sm sm:text-base transition-all duration-200"
          onClick={() => navigate('/upload-product/')}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            'Upload Your First Product'
          )}
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
                src={listing.images?.[0]?.image || '/images/placeholder-image.jpg'}
                alt={listing.title}
                className="w-full h-full object-cover"
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
                disabled={deleteMutation.isPending}
              >
                <Eye className="w-4 h-4 mr-2" />
                {deleteMutation.isPending ? 'Please wait...' : 'View'}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-700 border-green-200 hover:bg-green-100 hover:text-green-700"
                  onClick={() => handleEditListing(listing.id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Edit className="w-4 h-4 mr-2" />
                  )}
                  {deleteMutation.isPending ? 'Processing...' : 'Edit'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-100 hover:text-red-600"
                  onClick={() => handleDeleteListing(listing.id)}
                  disabled={deleteMutation.isPending && productToDelete === listing.id}
                >
                  {deleteMutation.isPending && productToDelete === listing.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-1" />
                  )}
                  {deleteMutation.isPending && productToDelete === listing.id ? 'Deleting...' : 'Delete'}
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
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmationOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileListings;