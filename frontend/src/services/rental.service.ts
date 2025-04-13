import api from './api.service';
import { RentalStatus } from '../constants/rental';
import { RentalRequest, RentalRequestFormData } from '../types/rentals';
import config from '../config';

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
    try {
      const rentalData = {
        product: productId,
        start_time: data.startDate?.toISOString(),
        end_time: this.calculateEndTime(data.startDate, data.duration, data.durationUnit),
        duration: data.duration,
        duration_unit: data.durationUnit,
        purpose: data.purpose,
        notes: data.notes || '',
        total_cost: data.totalCost,
        service_fee: data.serviceFee
      };

      const response = await api.post(config.rentals.createEndpoint, rentalData);
      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle own product error
        if (errorData.code === 'own_product_rental') {
          throw new Error("You cannot rent your own product");
        }
        
        // Handle product unavailable error
        if (errorData.code === 'product_unavailable') {
          throw new Error("Product is not available during the selected period");
        }

        // Handle other validation errors
        if (errorData.detail) {
          throw new Error(errorData.detail);
        }
      }
      
      throw new Error('Failed to create rental request. Please try again.');
    }
  }

  private calculateEndTime(startDate: Date, duration: number, durationUnit: string): string {
    let endDate = new Date(startDate);
    
    switch (durationUnit) {
      case 'day':
        endDate.setDate(endDate.getDate() + duration);
        break;
      case 'week':
        endDate.setDate(endDate.getDate() + duration * 7);
        break;
      case 'month':
        endDate.setMonth(endDate.getMonth() + duration);
        break;
      default:
        throw new Error(`Invalid duration unit: ${durationUnit}`);
    }

    return endDate.toISOString();
  }

  /**
   * Update the status of a rental request (owner only)
   * @param requestId The ID of the rental request to update
   * @param status The new status
   * @returns The updated rental request
   */
  async updateRentalStatus(requestId: string, status: RentalStatus): Promise<RentalRequest> {
    try {
      let endpoint: string;
      switch (status) {
        case RentalStatus.APPROVED:
          endpoint = config.rentals.acceptEndpoint(requestId);
          break;
        case RentalStatus.REJECTED:
          endpoint = config.rentals.rejectEndpoint(requestId);
          break;
        case RentalStatus.CANCELLED:
          endpoint = config.rentals.cancelEndpoint(requestId);
          break;
        default:
          throw new Error(`Invalid rental status: ${status}`);
      }
      
      const response = await api.post(endpoint, {
        reason: status === RentalStatus.REJECTED ? 'No reason provided' : undefined
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update rental status to ${status}`);
    }
  }

  /**
   * Get all rental requests for the current user (as owner or renter)
   * @returns List of rental requests
   */
  async getUserRentals(): Promise<RentalRequest[]> {
    try {
      const response = await api.get(config.rentals.myRentalsEndpoint);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user rentals');
    }
  }

  /**
   * Get rental requests for a specific product (owner only)
   * @param productId The ID of the product
   * @returns List of rental requests
   */
  async getProductRentals(productId: string): Promise<RentalRequest[]> {
    try {
      const response = await api.get(config.rentals.listEndpoint);
      return response.data.filter(rental => rental.product.id === productId);
    } catch (error) {
      throw new Error('Failed to fetch product rentals');
    }
  }

  /**
   * Get a single rental request by ID
   * @param requestId The ID of the rental request to retrieve
   * @returns The rental request
   */
  async getRentalRequest(requestId: string): Promise<RentalRequest> {
    try {
      const response = await api.get(config.rentals.detailEndpoint(requestId));
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch rental request');
    }
  }

  /**
   * Get all rental requests for the current user's listings
   * @returns List of rental requests
   */
  async getUserListingsRentals(): Promise<RentalRequest[]> {
    try {
      const response = await api.get(config.rentals.myListingsRentalsEndpoint);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user listings rentals');
    }
  }

  /**
   * Get rental photos for a specific rental
   * @param rentalId The ID of the rental
   * @returns List of rental photos
   */
  async getRentalPhotos(rentalId: string): Promise<any[]> {
    try {
      const response = await api.get(config.rentals.photosEndpoint(rentalId));
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch rental photos');
    }
  }

  /**
   * Upload a rental photo
   * @param rentalId The ID of the rental
   * @param photo The photo file
   * @param photoType The type of photo (pre_rental or post_rental)
   * @returns The uploaded photo
   */
  async uploadRentalPhoto(rentalId: string, photo: File, photoType: string): Promise<any> {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('photo_type', photoType);

    try {
      const response = await api.post(config.rentals.photosEndpoint(rentalId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to upload rental photo');
    }
  }

  private async getProduct(productId: string): Promise<any> {
    try {
      const response = await api.get(config.products.detailEndpoint(productId));
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch product');
    }
  }
}

export default new RentalService();