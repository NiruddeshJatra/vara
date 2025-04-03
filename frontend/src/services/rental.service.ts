import api from './api.service';
import { RentalStatus } from '../constants/rental';
import { RentalRequest, RentalRequestFormData } from '../types/listings';

/**
 * Service for handling rental-related operations
 */
class RentalService {
  /**
   * Create a new rental request
   * @param productId The ID of the product to rent
   * @param data The rental request data
   * @returns The created rental request
   */
  async createRentalRequest(productId: string, data: RentalRequestFormData): Promise<RentalRequest> {
    const response = await api.post(`/products/${productId}/rent/`, data);
    return response.data;
  }

  /**
   * Update the status of a rental request (owner only)
   * @param requestId The ID of the rental request to update
   * @param status The new status
   * @returns The updated rental request
   */
  async updateRentalStatus(requestId: string, status: RentalStatus): Promise<RentalRequest> {
    const response = await api.post(`/rentals/${requestId}/update_status/`, { status });
    return response.data;
  }

  /**
   * Get all rental requests for the current user (as owner or renter)
   * @returns List of rental requests
   */
  async getUserRentals(): Promise<RentalRequest[]> {
    const response = await api.get('/rentals/user/');
    return response.data;
  }

  /**
   * Get rental requests for a specific product (owner only)
   * @param productId The ID of the product
   * @returns List of rental requests
   */
  async getProductRentals(productId: string): Promise<RentalRequest[]> {
    const response = await api.get(`/products/${productId}/rentals/`);
    return response.data;
  }

  /**
   * Get a single rental request by ID
   * @param requestId The ID of the rental request to retrieve
   * @returns The rental request
   */
  async getRentalRequest(requestId: string): Promise<RentalRequest> {
    const response = await api.get(`/rentals/${requestId}/`);
    return response.data;
  }
}

export default new RentalService(); 