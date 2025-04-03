import api from './api.service';
import { ProductStatus } from '../constants/productStatus';
import { Listing } from '../types/listings';

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
    const response = await api.post(`/products/${productId}/submit_for_review/`);
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
    const response = await api.post(`/products/${productId}/update_status/`, {
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
    const response = await api.get('/products/user/');
    return response.data;
  }

  /**
   * Get all active products (visible to all users)
   * @returns List of active products
   */
  async getActiveProducts(): Promise<Listing[]> {
    const response = await api.get('/products/');
    return response.data;
  }

  /**
   * Get a single product by ID
   * @param productId The ID of the product to retrieve
   * @returns The product
   */
  async getProduct(productId: string): Promise<Listing> {
    const response = await api.get(`/products/${productId}/`);
    return response.data;
  }
}

export default new ProductService(); 