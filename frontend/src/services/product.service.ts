import api, { verifyAuth } from './api.service';
import { ProductStatus } from '../constants/productStatus';
import { Product, ListingFormData } from '../types/listings';
import config from '../config';
import { toast } from '@/components/ui/use-toast';
import { queryClient } from '../lib/react-query';

interface ProductResponse {
  data: any;
  results?: any[];
}

/**
 * Service for handling product-related operations
 */
class ProductService {
  /**
   * Transform a raw product from API to frontend format
   * @param product Raw product data from API
   * @returns Transformed product
   */
  private transformProduct(product: any): Product {
    const productImages = product.productImages || [];
    
    const images = productImages.map((img: any) => ({
      ...img,
      image: this.ensureFullImageUrl(img.image)
    }));

    const pricingTiers = (product.pricing_tiers || product.pricingTiers || []).map((tier: any) => ({
      ...tier,
      durationUnit: tier.duration_unit || tier.durationUnit || 'day',
      maxPeriod: tier.max_period || tier.maxPeriod || 1,
      price: typeof tier.price === 'number' ? tier.price : 0
    }));

    const unavailableDates = (product.unavailable_dates || product.unavailableDates || []).map((date: any) => ({
      ...date,
      isRange: date.is_range || date.isRange,
      rangeStart: date.range_start || date.rangeStart,
      rangeEnd: date.range_end || date.rangeEnd
    }));

    return {
      ...product,
      productType: product.product_type || product.productType,
      securityDeposit: product.security_deposit || product.securityDeposit,
      purchaseYear: product.purchase_year || product.purchaseYear,
      originalPrice: product.original_price || product.originalPrice,
      ownershipHistory: product.ownership_history || product.ownershipHistory,
      statusMessage: product.status_message || product.statusMessage,
      statusChangedAt: product.status_changed_at || product.statusChangedAt,
      viewsCount: product.views_count || product.viewsCount,
      rentalCount: product.rental_count || product.rentalCount,
      averageRating: product.average_rating !== null && product.average_rating !== undefined ? parseFloat(product.average_rating) : 0,
      createdAt: product.created_at || product.createdAt,
      updatedAt: product.updated_at || product.updatedAt,
      images,
      pricingTiers: pricingTiers.length > 0 ? pricingTiers : [{
        durationUnit: 'day',
        maxPeriod: 1,
        price: 0
      }],
      unavailableDates
    };
  }

  /**
   * Extract products from API response
   * @param response API response
   * @returns Array of raw products
   */
  private extractProducts(response: ProductResponse): any[] {
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  }

  /**
   * Get all active products (visible to all users)
   * @param page Page number
   * @param pageSize Number of products per page
   * @returns List of active products and total count
   */
  async getActiveProducts(page = 1, pageSize = 20): Promise<{ products: Product[]; count: number }> {
    try {
      const response = await api.get(config.products.listEndpoint, {
        params: { 
          page, 
          page_size: pageSize
          // Removed status filter to show all products
        }
      });
      const products = this.extractProducts(response).map(product => this.transformProduct(product));
      return { products, count: response.data.count || products.length };
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to fetch products", 
        variant: "destructive" 
      });
      return { products: [], count: 0 };
    }
  }

  /**
   * Ensure the image URL is a complete URL
   * @param imageUrl The image URL to check
   * @returns Complete image URL
   */
  private ensureFullImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return 'https://placehold.co/600x400?text=No+Image';
    }
    
    // If it's already a full URL (starts with http:// or https://), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative URL (starts with /media/), add the base URL
    if (imageUrl.startsWith('/media/')) {
      return `${config.baseUrl}${imageUrl}`;
    }

    // If it's a relative URL (starts with media/), add the base URL
    if (imageUrl.startsWith('media/')) {
      return `${config.baseUrl}/${imageUrl}`;
    }
    
    // For all other cases, prepend the base URL and media path
    return `${config.baseUrl}/media/${imageUrl}`;
  }

  /**
   * Get all products for the current user (paginated)
   * @param page Page number
   * @param pageSize Number of products per page
   * @returns List of products and total count
   */
  async getUserProducts(page = 1, pageSize = 40): Promise<{ products: Product[]; count: number }> {
    try {
      const response = await api.get(config.products.userProductsEndpoint, {
        params: { page, page_size: pageSize }
      });
      const products = this.extractProducts(response).map(product => this.transformProduct(product));
      return { products, count: response.data.count || products.length };
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to fetch your products", 
        variant: "destructive" 
      });
      return { products: [], count: 0 };
    }
  }

  /**
   * Get a single product by ID
   * @param productId The ID of the product to retrieve
   * @returns The product
   */
  async getProduct(productId: string): Promise<Product> {
    try {
      const response = await api.get(config.products.detailEndpoint(productId));
      // If the API returns paginated data, extract the first product
      if (Array.isArray(response.data.results) && response.data.results.length > 0) {
        return this.transformProduct(response.data.results[0]);
      }
      return this.transformProduct(response.data);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: `Failed to fetch product ${productId}`,
        variant: "destructive" 
      });
      throw error;
    }
  }

  /**
   * Create a new product
   * @param data The product data to create
   * @returns The created product
   */
  async createProduct(data: ListingFormData): Promise<Product> {
    try {
      verifyAuth();
      
      console.log('Creating product, user is authenticated');

      const formData = new FormData();
      
      // Append basic fields
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('product_type', data.productType);
      formData.append('description', data.description || '');
      formData.append('location', data.location);
      if (data.securityDeposit !== null) {
        formData.append('security_deposit', String(data.securityDeposit));
      }
      formData.append('purchase_year', data.purchaseYear);
      formData.append('original_price', String(data.originalPrice));
      formData.append('ownership_history', data.ownershipHistory);

      // Append images
      if (data.images?.length > 0) {
        data.images.forEach((image, idx) => {
          if (image instanceof File) {
            formData.append('images', image);
          } else {
            console.error(`Image at index ${idx} is not a File:`, image, typeof image);
          }
        });
      }

      // Format and append unavailable dates
      if (data.unavailableDates?.length > 0) {
        const formattedDates = data.unavailableDates.map(date => ({
          date: date.date ? new Date(date.date).toISOString().split('T')[0] : null,
          is_range: date.isRange,
          range_start: date.rangeStart ? new Date(date.rangeStart).toISOString().split('T')[0] : null,
          range_end: date.rangeEnd ? new Date(date.rangeEnd).toISOString().split('T')[0] : null
        }));
        formData.append('unavailable_dates', JSON.stringify(formattedDates));
      }

      // Format and append pricing tiers
      if (data.pricingTiers?.length > 0) {
        const formattedTiers = data.pricingTiers.map(tier => ({
          duration_unit: tier.durationUnit.toLowerCase(),
          price: tier.price,
          max_period: tier.maxPeriod || null
        }));
        formData.append('pricing_tiers', JSON.stringify(formattedTiers));
      }

      // Get token and explicitly add it to request
      const token = localStorage.getItem(config.auth.tokenStorageKey);
      
      // Log request details for debugging
      console.log('Sending product creation request', {
        url: config.products.createEndpoint,
        authenticated: !!token,
        formDataEntries: Array.from(formData.entries()).map(([key]) => key)
      });

      // Add explicit authorization header for this specific request
      const response = await api.post<Product>(
        config.products.createEndpoint, 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            // Content-Type will be set automatically by axios for FormData
          }
        }
      );
      
      console.log('Product created successfully');
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      
      toast({ 
        title: "Success", 
        description: "Product created successfully", 
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Product creation error:', error);
      
      // Enhanced error handling
      if (error.response?.status === 401) {
        toast({ 
          title: "Authentication Error", 
          description: "Please log in again to create a product.", 
          variant: "destructive" 
        });
        window.location.href = config.auth.loginEndpoint;
      } else {
        toast({ 
          title: "Product Creation Failed", 
          description: error.response?.data?.detail || error.message || "Failed to create product", 
          variant: "destructive" 
        });
      }
      throw error;
    }
  }

  /**
   * Update an existing product
   * @param productId The ID of the product to update
   * @param data The updated product data
   * @returns The updated product
   */
  async updateProduct(productId: string, data: Partial<ListingFormData>): Promise<Product> {
    try {
      const formData = new FormData();

      // Append only the fields that are being updated
      if (data.title) formData.append('title', data.title);
      if (data.category) formData.append('category', data.category);
      if (data.productType) formData.append('product_type', data.productType);
      if (data.description) formData.append('description', data.description);
      if (data.location) formData.append('location', data.location);
      if (data.securityDeposit !== undefined) {
        formData.append('security_deposit', data.securityDeposit?.toString());
      }
      if (data.purchaseYear) formData.append('purchase_year', data.purchaseYear);
      if (data.originalPrice) formData.append('original_price', data.originalPrice.toString());
      if (data.ownershipHistory) formData.append('ownership_history', data.ownershipHistory);

      if (data.images && data.images.length > 0) {
        data.images.forEach((image, idx) => {
          if (image instanceof File) {
            formData.append('images', image);
          } else {
            console.error(`Image at index ${idx} is not a File:`, image, typeof image);
          }
        });
      }

      if (data.unavailableDates && data.unavailableDates.length > 0) {
        const unavailableDates = data.unavailableDates.map(date => ({
          date: date.date ? new Date(date.date).toISOString().split('T')[0] : null,
          is_range: date.isRange,
          range_start: date.rangeStart ? new Date(date.rangeStart).toISOString().split('T')[0] : null,
          range_end: date.rangeEnd ? new Date(date.rangeEnd).toISOString().split('T')[0] : null
        }));
        formData.append('unavailable_dates', JSON.stringify(unavailableDates));
      }

      if (data.pricingTiers && data.pricingTiers.length > 0) {
        const pricingTiers = data.pricingTiers.map(tier => ({
          duration_unit: tier.durationUnit.toLowerCase(),
          price: tier.price,
          max_period: tier.maxPeriod || null
        }));
        formData.append('pricing_tiers', JSON.stringify(pricingTiers));
      }

      const response = await api.patch(config.products.updateEndpoint(productId), formData);
      
      // Invalidate specific product and related queries
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      
      toast({ 
        title: "Success", 
        description: "Product updated successfully", 
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.images) {
        toast({ 
          title: "Image Upload Failed", 
          description: error.response.data.images.join(', '), 
          variant: "destructive" 
        });
        throw new Error(`Image upload failed: ${error.response.data.images.join(', ')}`);
      }
      
      toast({ 
        title: "Update Failed", 
        description: error.response?.data?.detail || "Failed to update product", 
        variant: "destructive" 
      });
      
      throw error;
    }
  }

  /**
   * Delete a product
   * @param productId The ID of the product to delete
   */
  async deleteProduct(productId: string): Promise<void> {
    try {
      // Delete the product
      await api.delete(config.products.deleteEndpoint(productId));
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      // Remove specific product from cache
      queryClient.removeQueries({ queryKey: ['product', productId] });
      
      toast({ 
        title: "Success", 
        description: "Product deleted successfully", 
      });
    } catch (error) {
      toast({ 
        title: "Deletion Failed", 
        description: "Failed to delete product. Please try again.", 
        variant: "destructive" 
      });
      throw error;
    }
  }

  /**
   * Upload an image for a product
   * @param productId The ID of the product
   * @param image The image file to upload
   * @returns The created image
   */
  async uploadImage(productId: string, image: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('image', image);
      const response = await api.post(`${config.products.detailEndpoint(productId)}/upload_image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Invalidate the specific product to reflect the new image
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      
      toast({ 
        title: "Success", 
        description: "Image uploaded successfully", 
      });
      
      return response.data;
    } catch (error) {
      toast({ 
        title: "Upload Failed", 
        description: "Failed to upload image", 
        variant: "destructive" 
      });
      throw error;
    }
  }

  /**
   * Delete an image from a product
   * @param productId The ID of the product
   * @param imageId The ID of the image to delete
   */
  async deleteImage(productId: string, imageId: string): Promise<void> {
    try {
      await api.delete(`${config.products.detailEndpoint(productId)}/delete_image/`, {
        data: { image_id: imageId }
      });
      
      // Invalidate the specific product to reflect the deleted image
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      
      toast({ 
        title: "Success", 
        description: "Image deleted successfully", 
      });
    } catch (error) {
      toast({ 
        title: "Deletion Failed", 
        description: "Failed to delete image", 
        variant: "destructive" 
      });
      throw error;
    }
  }

  /**
   * Check product availability for a date or date range
   * @param productId The ID of the product
   * @param date Single date to check
   * @param startDate Start date of range
   * @param endDate End date of range
   * @returns Availability status
   */
  async checkAvailability(
    productId: string,
    date?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ available: boolean }> {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const response = await api.get(
        `${config.products.availabilityEndpoint(productId)}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      toast({ 
        title: "Availability Check Failed", 
        description: "Failed to check product availability", 
        variant: "destructive" 
      });
      throw error;
    }
  }

  /**
   * Get pricing information for a product
   * @param productId The ID of the product
   * @param duration Duration of rental
   * @param unit Duration unit (day/week/month)
   * @returns Price information
   */
  async getPricing(
    productId: string,
    duration: number,
    unit: string
  ): Promise<{ price: number }> {
    try {
      const response = await api.get(
        `${config.products.pricingEndpoint(productId)}?duration=${duration}&unit=${unit}`
      );
      return response.data;
    } catch (error) {
      toast({ 
        title: "Pricing Information Failed", 
        description: "Failed to get pricing information", 
        variant: "destructive" 
      });
      throw error;
    }
  }

  /**
   * Submit a product for admin review
   * @param productId The ID of the product to submit
   * @returns The updated product
   */
  async submitForReview(productId: string): Promise<Product> {
    try {
      const response = await api.post(config.products.submitForReviewEndpoint(productId));
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      
      toast({ 
        title: "Success", 
        description: "Product submitted for review", 
      });
      
      return response.data;
    } catch (error) {
      toast({ 
        title: "Submission Failed", 
        description: "Failed to submit product for review", 
        variant: "destructive" 
      });
      throw error;
    }
  }

  /**
   * Update a product's status
   * @param productId The ID of the product
   * @param status The new status
   * @param message Optional message explaining the status change
   * @returns The updated product
   */
  async updateStatus(productId: string, status: keyof typeof ProductStatus, message?: string): Promise<Product> {
    try {
      const response = await api.patch(config.products.updateStatusEndpoint(productId), {
        status,
        message,
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      
      toast({ 
        title: "Status Updated", 
        description: `Product status changed to ${status}`, 
      });
      
      return response.data;
    } catch (error) {
      toast({ 
        title: "Status Update Failed", 
        description: "Failed to update product status", 
        variant: "destructive" 
      });
      throw error;
    }
  }

  /**
   * Increment a product's view count
   * @param productId The ID of the product
   * @returns The updated view count
   */
  async incrementViews(productId: string): Promise<number> {
    try {
      const response = await api.post(config.products.incrementViewsEndpoint(productId));
      
      // Optionally update the product in the cache with the new view count
      const existingProduct = queryClient.getQueryData<Product>(['product', productId]);
      if (existingProduct) {
        queryClient.setQueryData(['product', productId], {
          ...existingProduct,
          viewsCount: response.data.views_count
        });
      }
      
      return response.data.views_count;
    } catch (error) {
      // Silent failure for view counts
      return 0;
    }
  }

  /**
   * Update a product's rating
   * @param productId The ID of the product
   * @param rating The new rating (0-5)
   * @returns The updated average rating
   */
  async updateRating(productId: string, rating: number): Promise<number> {
    try {
      const response = await api.post(config.products.updateRatingEndpoint(productId), {
        rating,
      });
      
      // Invalidate the specific product to reflect the new rating
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      
      toast({ 
        title: "Rating Updated", 
        description: "Thank you for your rating", 
      });
      
      return response.data.average_rating;
    } catch (error) {
      toast({ 
        title: "Rating Failed", 
        description: "Failed to update product rating", 
        variant: "destructive" 
      });
      throw error;
    }
  }

  /**
   * Get similar products based on category
   * @param category The product category
   * @param excludeProductId ID of the product to exclude
   * @returns List of similar products
   */
  async getSimilarProducts(category: string, excludeProductId: string): Promise<Product[]> {
    try {
      const response = await api.get(config.products.listEndpoint, {
        params: {
          category,
          exclude_id: excludeProductId,
          limit: 4
        }
      });
      
      return this.extractProducts(response).map(product => this.transformProduct(product));
    } catch (error) {
      console.error('Error fetching similar products:', error);
      return [];
    }
  }
}

export default new ProductService();