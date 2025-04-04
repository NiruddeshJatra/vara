import api from './api.service';
import { ProductStatus } from '../constants/productStatus';
import { Listing, ListingFormData } from '../types/listings';
import config from '../config';

/**
 * Service for handling product-related operations
 */
class ProductService {
  /**
   * Get all active products (visible to all users)
   * @returns List of active products
   */
  async getActiveProducts(): Promise<Listing[]> {
    const response = await api.get(config.products.listEndpoint);
    return response.data;
  }

  /**
   * Get all products for the current user
   * @returns List of products
   */
  async getUserProducts(): Promise<Listing[]> {
    const response = await api.get(config.products.userProductsEndpoint);
    return response.data;
  }

  /**
   * Get a single product by ID
   * @param productId The ID of the product to retrieve
   * @returns The product
   */
  async getProduct(productId: string): Promise<Listing> {
    const response = await api.get(config.products.detailEndpoint(productId));
    return response.data;
  }

  /**
   * Create a new product
   * @param data The product data to create
   * @returns The created product
   * @throws Error if image upload fails
   */
  async createProduct(data: ListingFormData): Promise<Listing> {
    try {
      const formData = new FormData();
      
      // Append basic fields
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('product_type', data.productType);
      formData.append('description', data.description);
      formData.append('location', data.location);
      formData.append('security_deposit', data.securityDeposit.toString());
      formData.append('condition', data.condition);
      formData.append('purchase_year', data.purchaseYear);
      formData.append('original_price', data.originalPrice.toString());
      formData.append('ownership_history', data.ownershipHistory);
      
      // Append images
      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }
      
      // Append unavailable dates (convert to ISO strings)
      if (data.unavailableDates && data.unavailableDates.length > 0) {
        const isoDates = data.unavailableDates.map(date => date.toISOString().split('T')[0]);
        formData.append('unavailable_dates', JSON.stringify(isoDates));
      }
      
      // Append pricing tiers
      if (data.pricingTiers && data.pricingTiers.length > 0) {
        const transformedTiers = data.pricingTiers.map(tier => ({
          duration_unit: tier.durationUnit,
          max_period: tier.maxPeriod,
          price: Number(tier.price)
        }));
        formData.append('pricing_tiers', JSON.stringify(transformedTiers));
      }
      
      const response = await api.post(config.products.createEndpoint, formData, {
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
   * Update an existing product
   * @param productId The ID of the product to update
   * @param data The updated product data
   * @returns The updated product
   * @throws Error if image upload fails
   */
  async updateProduct(productId: string, data: Partial<ListingFormData>): Promise<Listing> {
    try {
      const formData = new FormData();
      
      // Append only the fields that are being updated
      if (data.title) formData.append('title', data.title);
      if (data.category) formData.append('category', data.category);
      if (data.productType) formData.append('product_type', data.productType);
      if (data.description) formData.append('description', data.description);
      if (data.location) formData.append('location', data.location);
      if (data.securityDeposit) formData.append('security_deposit', data.securityDeposit.toString());
      if (data.condition) formData.append('condition', data.condition);
      if (data.purchaseYear) formData.append('purchase_year', data.purchaseYear);
      if (data.originalPrice) formData.append('original_price', data.originalPrice.toString());
      if (data.ownershipHistory) formData.append('ownership_history', data.ownershipHistory);
      
      // Append images if they're being updated
      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }
      
      // Append unavailable dates if they're being updated (convert to ISO strings)
      if (data.unavailableDates && data.unavailableDates.length > 0) {
        const isoDates = data.unavailableDates.map(date => date.toISOString().split('T')[0]);
        formData.append('unavailable_dates', JSON.stringify(isoDates));
      }
      
      // Append pricing tiers if they're being updated
      if (data.pricingTiers && data.pricingTiers.length > 0) {
        const transformedTiers = data.pricingTiers.map(tier => ({
          duration_unit: tier.durationUnit,
          max_period: tier.maxPeriod,
          price: Number(tier.price)
        }));
        formData.append('pricing_tiers', JSON.stringify(transformedTiers));
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
   * Submit a product for admin review
   * @param productId The ID of the product to submit
   * @returns The updated product
   */
  async submitForReview(productId: string): Promise<Listing> {
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
  async updateStatus(productId: string, status: ProductStatus, message?: string): Promise<Listing> {
    const response = await api.post(config.products.updateStatusEndpoint(productId), {
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