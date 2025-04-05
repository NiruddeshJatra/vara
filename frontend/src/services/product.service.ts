import api from './api.service';
import { ProductStatus } from '../constants/productStatus';
import { Product, ListingFormData } from '../types/listings';
import { UnavailableDate, PricingTier } from '../types/listings';
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
    const response = await api.get(config.products.listEndpoint);
    return response.data;
  }

  /**
   * Get all products for the current user
   * @returns List of products
   */
  async getUserProducts(): Promise<Product[]> {
    const response = await api.get(config.products.userProductsEndpoint);
    return response.data;
  }

  /**
   * Get a single product by ID
   * @param productId The ID of the product to retrieve
   * @returns The product
   */
  async getProduct(productId: string): Promise<Product> {
    const response = await api.get(config.products.detailEndpoint(productId));
    return response.data;
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
        formData.append('unavailable_dates', JSON.stringify(formattedDates));
      }

      // Format and append pricing tiers
      if (data.pricingTiers && data.pricingTiers.length > 0) {
        const formattedTiers = data.pricingTiers.map(tier => ({
          duration_unit: tier.durationUnit.toLowerCase(),
          price: tier.price,
          max_period: tier.maxPeriod || null
        }));
        formData.append('pricing_tiers', JSON.stringify(formattedTiers));
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
        formData.append('security_deposit', data.securityDeposit?.toString() ?? '');
      }
      if (data.purchaseYear) formData.append('purchase_year', data.purchaseYear);
      if (data.originalPrice) formData.append('original_price', data.originalPrice.toString());
      if (data.ownershipHistory) formData.append('ownership_history', data.ownershipHistory);

      // Append images if they're being updated
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append('images', image); // Changed from uploaded_images to images
        });
      }

      // Append unavailable dates if they're being updated
      if (data.unavailableDates && data.unavailableDates.length > 0) {
        const unavailableDates = data.unavailableDates.map(date => ({
          date: date.date,
          is_range: date.isRange,
          range_start: date.rangeStart,
          range_end: date.rangeEnd
        }));
        formData.append('unavailable_dates', JSON.stringify(unavailableDates));
      }

      // Append pricing tiers if they're being updated
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
          'Content-Type': 'multipart/form-data',
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