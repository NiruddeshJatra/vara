import api from '@/lib/axios';
import { RentalRequest, RentalRequestFormData } from '../types/rentals';
import config from '../config';
import { toast } from '@/components/ui/use-toast';
import { queryClient } from '../lib/react-query';
import { invalidateRentals } from '../lib/query-invalidation';

interface PaginatedData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Service for handling rental-related operations
 */
class RentalService {
  /**
   * Unwrap the {success, message, data} envelope from a response
   */
  private unwrap<T>(response: { data: { data: T } }): T {
    return response.data.data;
  }

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
        start_date: data.start_date ? data.start_date.toISOString().split('T')[0] : null,
        duration: data.duration,
        duration_unit: data.duration_unit,
        purpose: data.purpose,
        notes: data.notes || ''
      };

      const response = await api.post(config.rentals.createEndpoint, rentalData);

      // Invalidate relevant rental queries
      invalidateRentals();
      // Invalidate product queries since rental affects availability
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });

      toast({
        title: "Rental Request Created",
        description: "Your rental request has been submitted successfully"
      });

      return this.unwrap<RentalRequest>(response);
    } catch (error: any) {
      const message = error.response?.data?.message;
      const fieldErrors = error.response?.data?.data;

      if (fieldErrors?.non_field_errors?.length) {
        toast({
          title: "Rental Request Failed",
          description: fieldErrors.non_field_errors[0],
          variant: "destructive"
        });
        throw new Error(fieldErrors.non_field_errors[0]);
      }

      if (message) {
        toast({
          title: "Rental Request Failed",
          description: message,
          variant: "destructive"
        });
        throw new Error(message);
      }

      toast({
        title: "Request Failed",
        description: "Failed to create rental request. Please try again.",
        variant: "destructive"
      });
      throw new Error('Failed to create rental request. Please try again.');
    }
  }

  /**
   * Accept a pending rental request (owner)
   */
  async acceptRental(rentalId: string): Promise<RentalRequest> {
    return this.transitionRental(config.rentals.acceptEndpoint(rentalId), rentalId, "Rental request accepted");
  }

  /**
   * Reject a pending rental request (owner)
   */
  async rejectRental(rentalId: string, reason?: string): Promise<RentalRequest> {
    return this.transitionRental(config.rentals.rejectEndpoint(rentalId), rentalId, "Rental request rejected", { reason });
  }

  /**
   * Cancel a rental request (renter, pending/accepted before start)
   */
  async cancelRental(rentalId: string): Promise<RentalRequest> {
    return this.transitionRental(config.rentals.cancelEndpoint(rentalId), rentalId, "Rental request cancelled");
  }

  private async transitionRental(
    endpoint: string,
    rentalId: string,
    successMessage: string,
    body?: Record<string, unknown>
  ): Promise<RentalRequest> {
    try {
      const response = await api.post(endpoint, body);

      // Invalidate rental queries
      invalidateRentals();
      queryClient.invalidateQueries({ queryKey: ['rental', rentalId] });

      const rental = this.unwrap<RentalRequest>(response);
      queryClient.setQueryData(['rental', rentalId], rental);

      toast({
        title: "Status Updated",
        description: successMessage
      });

      return rental;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update rental status";
      toast({
        title: "Status Update Failed",
        description: message,
        variant: "destructive"
      });
      throw new Error(message);
    }
  }

  /**
   * Get all rentals where the current user is the renter
   * @returns List of rental requests
   */
  async getUserRentals(): Promise<RentalRequest[]> {
    try {
      const response = await api.get(config.rentals.myRentalsEndpoint);
      const data = this.unwrap<PaginatedData<RentalRequest>>(response);
      return data.results || [];
    } catch (error) {
      toast({
        title: "Fetch Failed",
        description: "Failed to fetch your rentals",
        variant: "destructive"
      });
      throw new Error('Failed to fetch user rentals');
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
      return this.unwrap<RentalRequest>(response);
    } catch (error) {
      toast({
        title: "Fetch Failed",
        description: "Failed to fetch rental request details",
        variant: "destructive"
      });
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
      const data = this.unwrap<PaginatedData<RentalRequest>>(response);
      return data.results || [];
    } catch (error) {
      toast({
        title: "Fetch Failed",
        description: "Failed to fetch your listings' rentals",
        variant: "destructive"
      });
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
      const data = this.unwrap<any>(response);
      return Array.isArray(data) ? data : (data.results || []);
    } catch (error) {
      toast({
        title: "Fetch Failed",
        description: "Failed to fetch rental photos",
        variant: "destructive"
      });
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

      // Invalidate rental photos query
      queryClient.invalidateQueries({ queryKey: ['rental', rentalId, 'photos'] });

      toast({
        title: "Photo Uploaded",
        description: "Rental photo uploaded successfully"
      });

      return this.unwrap<any>(response);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload rental photo",
        variant: "destructive"
      });
      throw new Error('Failed to upload rental photo');
    }
  }
}

export default new RentalService();
