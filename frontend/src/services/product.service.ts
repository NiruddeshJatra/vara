import api from './api.service';
import { ProductStatus } from '../constants/productStatus';
import { Listing, ListingFormData } from '../types/listings';
import config from '../config';

/**
 * Service for handling product-related operations
 */
class ProductService {
  /**
   * Submit a product for admin review
   * @param productId The ID of the product to submit
   * @returns The updated product
   */
  async submitForReview(productId: string): Promise<Listing> {
    const response = await api.post(config.products.submitForReviewEndpoint(productId));
    return response.data.product;
  }

  /**
   * Update the status of a product (admin only)
   * @param productId The ID of the product to update
   * @param status The new status
   * @param statusMessage Optional message explaining the status change
   * @returns The updated product
   */
  async updateStatus(
    productId: string, 
    status: ProductStatus, 
    statusMessage?: string
  ): Promise<Listing> {
    const response = await api.post(config.products.updateStatusEndpoint(productId), {
      status,
      status_message: statusMessage
    });
    return response.data.product;
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
   * Get all active products (visible to all users)
   * @returns List of active products
   */
  async getActiveProducts(): Promise<Listing[]> {
    const response = await api.get(config.products.listEndpoint);
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
   * Create a new product listing
   * @param productData The product data to create
   * @returns The created product
   */
  async createProduct(productData: ListingFormData): Promise<Listing> {
    const response = await api.post(config.products.createEndpoint, productData);
    return response.data;
  }

  /**
   * Update an existing product listing
   * @param productId The ID of the product to update
   * @param productData The updated product data
   * @returns The updated product
   */
  async updateProduct(productId: string, productData: Partial<ListingFormData>): Promise<Listing> {
    const response = await api.put(config.products.updateEndpoint(productId), productData);
    return response.data;
  }

  /**
   * Delete a product listing
   * @param productId The ID of the product to delete
   * @returns Success status
   */
  async deleteProduct(productId: string): Promise<boolean> {
    await api.delete(config.products.deleteEndpoint(productId));
    return true;
  }

  /**
   * Increment the view count for a product
   * @param productId The ID of the product
   * @returns Success status
   */
  async incrementViews(productId: string): Promise<boolean> {
    await api.post(config.products.incrementViewsEndpoint(productId));
    return true;
  }

  /**
   * Update the rating for a product
   * @param productId The ID of the product
   * @param rating The new rating value
   * @returns Success status
   */
  async updateRating(productId: string, rating: number): Promise<boolean> {
    await api.post(config.products.updateRatingEndpoint(productId), { rating });
    return true;
  }

  /**
   * Upload images for a product
   * @param productId The ID of the product
   * @param images The image files to upload
   * @returns The uploaded images
   */
  async uploadImages(productId: string, images: File[]): Promise<any[]> {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', image);
    });

    const response = await api.post(config.products.imagesEndpoint(productId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Get pricing tiers for a product
   * @param productId The ID of the product
   * @returns The pricing tiers
   */
  async getPricingTiers(productId: string): Promise<any[]> {
    const response = await api.get(config.products.pricingTiersEndpoint(productId));
    return response.data;
  }

  /**
   * Create a pricing tier for a product
   * @param productId The ID of the product
   * @param pricingTier The pricing tier data
   * @returns The created pricing tier
   */
  async createPricingTier(productId: string, pricingTier: any): Promise<any> {
    const response = await api.post(config.products.pricingTiersEndpoint(productId), pricingTier);
    return response.data;
  }
}

export default new ProductService(); 