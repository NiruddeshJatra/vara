import { queryClient } from './react-query';

/**
 * Invalidate all product-related queries
 */
export const invalidateProducts = () => {
  queryClient.invalidateQueries({ queryKey: ['products'] });
  queryClient.invalidateQueries({ queryKey: ['userProducts'] });
};

/**
 * Invalidate all rental-related queries
 */
export const invalidateRentals = () => {
  queryClient.invalidateQueries({ queryKey: ['rentals', 'myRentals'] });
  queryClient.invalidateQueries({ queryKey: ['rentals', 'myListingsRentals'] });
};

/**
 * Invalidate all user data related queries
 */
export const invalidateUserData = () => {
  queryClient.invalidateQueries({ queryKey: ['user'] });
  queryClient.invalidateQueries({ queryKey: ['profile'] });
};

/**
 * Comprehensive invalidation after a profile update
 * This is needed because profile changes might affect products and rentals display
 */
export const invalidateAfterProfileUpdate = () => {
  invalidateUserData();
  invalidateProducts();
  invalidateRentals();
};

/**
 * Invalidate a specific product and all related product lists
 * @param productId The ID of the product that was modified
 */
export const invalidateProductById = (productId: string) => {
  queryClient.invalidateQueries({ queryKey: ['product', productId] });
  invalidateProducts();
};

/**
 * Remove a product from cache completely
 * Use this after deleting a product
 * @param productId The ID of the product to remove
 */
export const removeProductFromCache = (productId: string) => {
  // Remove specific product query
  queryClient.removeQueries({ queryKey: ['product', productId] });
  
  // Force refetch active products to ensure they're updated across all components
  queryClient.invalidateQueries({ 
    queryKey: ['products'], 
    refetchType: 'active', // Only refetch active queries
  });
  
  // Force refetch user products
  queryClient.invalidateQueries({ 
    queryKey: ['userProducts'],
    refetchType: 'active',
  });
  
  // Reset all queries that might include this product without parameters (like category pages)
  queryClient.resetQueries({
    queryKey: ['products'],
    exact: false,
  });
};

/**
 * Invalidate a rental and all related rental lists
 * @param rentalId The ID of the rental that was modified
 */
export const invalidateRentalById = (rentalId: string) => {
  queryClient.invalidateQueries({ queryKey: ['rental', rentalId] });
  invalidateRentals();
};

/**
 * Invalidate everything after a significant change
 * Use this when making changes that affect multiple data types
 */
export const invalidateAllData = () => {
  invalidateUserData();
  invalidateProducts();
  invalidateRentals();
};