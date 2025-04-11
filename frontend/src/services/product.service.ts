import api from './api.service';
import { ProductStatus } from '../constants/productStatus';
import { Product, ListingFormData } from '../types/listings';
import config from '../config';

/**
 * Service for handling product-related operations
 */
class ProductService {
  /**
   * Get all active products (visible to all users)
   * @returns List of active products
   */
  async getActiveProducts(): Promise<Product[]> {
    try {
      // Request all products by setting page_size to max_page_size
      const response = await api.get(config.products.listEndpoint, {
        params: {
          page_size: 100  // Request up to 100 products
        }
      });
      
      // Handle both array and paginated responses
      const products = Array.isArray(response.data) 
        ? response.data 
        : (response.data.results || []);
      
      // Transform the response data to match the frontend's expected structure
      return products.map((product: any) => {
        // Fix: Use camelCase property name that matches the API response
        const productImages = product.productImages || [];
        
        // Transform image URLs to be complete URLs if they're relative paths
        const images = productImages.map((img: any) => ({
          ...img,
          image: this.ensureFullImageUrl(img.image)
        }));
        
        // Transform pricing tiers - use camelCase from API response
        const pricingTiers = product.pricingTiers?.map((tier: any) => ({
          id: tier.id,
          durationUnit: tier.durationUnit,
          price: tier.price,
          maxPeriod: tier.maxPeriod
        })) || [];

        // Transform unavailable dates - use camelCase from API response
        const unavailableDates = product.unavailableDates?.map((date: any) => ({
          id: date.id,
          date: date.date,
          isRange: date.isRange,
          rangeStart: date.rangeStart,
          rangeEnd: date.rangeEnd
        })) || [];
        
        return {
          ...product,
          productType: product.productType,
          securityDeposit: product.securityDeposit,
          purchaseYear: product.purchaseYear,
          originalPrice: product.originalPrice,
          ownershipHistory: product.ownershipHistory,
          statusMessage: product.statusMessage,
          statusChangedAt: product.statusChangedAt,
          viewsCount: product.viewsCount,
          rentalCount: product.rentalCount,
          averageRating: product.averageRating,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          images: images,
          pricingTiers: pricingTiers,
          unavailableDates: unavailableDates
        };
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
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
   * Get all products for the current user
   * @returns List of products
   */
  async getUserProducts(): Promise<Product[]> {
    try {
      const response = await api.get(config.products.userProductsEndpoint);
      const products = response.data.results || response.data;
      
      return products.map((product: any) => {
        // Fix: Use camelCase property name that matches the API response
        const productImages = product.productImages || [];
        
        // Transform image URLs to be complete URLs if they're relative paths
        const images = productImages.map((img: any) => ({
          ...img,
          image: this.ensureFullImageUrl(img.image)
        }));
        
        return {
          ...product,
          productType: product.product_type,
          securityDeposit: product.security_deposit,
          purchaseYear: product.purchase_year,
          originalPrice: product.original_price,
          ownershipHistory: product.ownership_history,
          statusMessage: product.status_message,
          statusChangedAt: product.status_changed_at,
          viewsCount: product.views_count,
          rentalCount: product.rental_count,
          averageRating: product.average_rating ? parseFloat(product.average_rating) : 0,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
          images: images,
          unavailableDates: product.unavailable_dates?.map((date: any) => ({
            ...date,
            isRange: date.is_range,
            rangeStart: date.range_start,
            rangeEnd: date.range_end
          })) || [],
          pricingTiers: product.pricing_tiers?.map((tier: any) => ({
            ...tier,
            durationUnit: tier.duration_unit,
            maxPeriod: tier.max_period
          })) || []
        };
      });
    } catch (error) {
      console.error("Error fetching user products:", error);
      return [];
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
      const product = response.data;
      
      // Fix: Use camelCase property name that matches the API response
      const productImages = product.productImages || [];
      
      // Transform image URLs to be complete URLs if they're relative paths
      const images = productImages.map((img: any) => ({
        ...img,
        image: this.ensureFullImageUrl(img.image)
      }));
      
      return {
        ...product,
        productType: product.product_type,
        securityDeposit: product.security_deposit,
        purchaseYear: product.purchase_year,
        originalPrice: product.original_price,
        ownershipHistory: product.ownership_history,
        statusMessage: product.status_message,
        statusChangedAt: product.status_changed_at,
        viewsCount: product.views_count,
        rentalCount: product.rental_count,
        averageRating: product.average_rating ? parseFloat(product.average_rating) : 0,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        images: images,
        unavailableDates: product.unavailable_dates?.map((date: any) => ({
          ...date,
          isRange: date.is_range,
          rangeStart: date.range_start,
          rangeEnd: date.range_end
        })) || [],
        pricingTiers: product.pricing_tiers?.map((tier: any) => ({
          ...tier,
          durationUnit: tier.duration_unit,
          maxPeriod: tier.max_period
        })) || []
      };
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
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
      const formData = new FormData();
      
      // Append basic fields with proper field names
      if (data.title) formData.append('title', data.title);
      if (data.category) formData.append('category', data.category);
      if (data.productType) formData.append('product_type', data.productType);
      if (data.description) formData.append('description', data.description);
      if (data.location) formData.append('location', data.location);
      if (data.securityDeposit !== undefined) {
        formData.append('security_deposit', data.securityDeposit.toString());
      }
      if (data.purchaseYear) formData.append('purchase_year', data.purchaseYear);
      if (data.originalPrice !== undefined) {
        formData.append('original_price', data.originalPrice.toString());
      }
      if (data.ownershipHistory) formData.append('ownership_history', data.ownershipHistory);

      // Append images
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      // Format and append unavailable dates
      if (data.unavailableDates && data.unavailableDates.length > 0) {
        const formattedDates = data.unavailableDates.map(date => ({
          date: date.date ? new Date(date.date).toISOString().split('T')[0] : null,
          is_range: date.isRange,
          range_start: date.rangeStart ? new Date(date.rangeStart).toISOString().split('T')[0] : null,
          range_end: date.rangeEnd ? new Date(date.rangeEnd).toISOString().split('T')[0] : null
        }));
        formData.append('unavailable_dates_input', JSON.stringify(formattedDates));
      }

      // Format and append pricing tiers
      if (data.pricingTiers && data.pricingTiers.length > 0) {
        const formattedTiers = data.pricingTiers.map(tier => ({
          duration_unit: tier.durationUnit.toLowerCase(),
          price: tier.price,
          max_period: tier.maxPeriod || null
        }));
        formData.append('pricing_tiers_input', JSON.stringify(formattedTiers));
      }

      const response = await api.post<Product>(config.products.createEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Full API Error:', error);
      throw new Error('Failed to create product. Please try again.');
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
        data.images.forEach((image) => {
          formData.append('images', image);
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

      const response = await api.patch(config.products.updateEndpoint(productId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.images) {
        throw new Error(`Image upload failed: ${error.response.data.images.join(', ')}`);
      }
      throw error;
    }
  }

  /**
   * Delete a product
   * @param productId The ID of the product to delete
   */
  async deleteProduct(productId: string): Promise<void> {
    await api.delete(config.products.deleteEndpoint(productId));
  }

  /**
   * Upload an image for a product
   * @param productId The ID of the product
   * @param image The image file to upload
   * @returns The created image
   */
  async uploadImage(productId: string, image: File): Promise<any> {
    const formData = new FormData();
    formData.append('image', image);
    const response = await api.post(`${config.products.detailEndpoint(productId)}/upload_image/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Delete an image from a product
   * @param productId The ID of the product
   * @param imageId The ID of the image to delete
   */
  async deleteImage(productId: string, imageId: string): Promise<void> {
    await api.delete(`${config.products.detailEndpoint(productId)}/delete_image/`, {
      data: { image_id: imageId }
    });
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
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await api.get(
      `${config.products.availabilityEndpoint(productId)}?${params.toString()}`
    );
    return response.data;
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
    const response = await api.get(
      `${config.products.pricingEndpoint(productId)}?duration=${duration}&unit=${unit}`
    );
    return response.data;
  }

  /**
   * Submit a product for admin review
   * @param productId The ID of the product to submit
   * @returns The updated product
   */
  async submitForReview(productId: string): Promise<Product> {
    const response = await api.post(config.products.submitForReviewEndpoint(productId));
    return response.data;
  }

  /**
   * Update a product's status
   * @param productId The ID of the product
   * @param status The new status
   * @param message Optional message explaining the status change
   * @returns The updated product
   */
  async updateStatus(productId: string, status: keyof typeof ProductStatus, message?: string): Promise<Product> {
    const response = await api.patch(config.products.updateStatusEndpoint(productId), {
      status,
      message,
    });
    return response.data;
  }

  /**
   * Increment a product's view count
   * @param productId The ID of the product
   * @returns The updated view count
   */
  async incrementViews(productId: string): Promise<number> {
    const response = await api.post(config.products.incrementViewsEndpoint(productId));
    return response.data.views_count;
  }

  /**
   * Update a product's rating
   * @param productId The ID of the product
   * @param rating The new rating (0-5)
   * @returns The updated average rating
   */
  async updateRating(productId: string, rating: number): Promise<number> {
    const response = await api.post(config.products.updateRatingEndpoint(productId), {
      rating,
    });
    return response.data.average_rating;
  }
}

export default new ProductService(); 