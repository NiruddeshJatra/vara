import api from '@/lib/axios';
import { Review } from '../types/rentals';
import config from '../config';

interface PaginatedData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Service for handling review-related operations
 */
class ReviewService {
  /**
   * Unwrap the {success, message, data} envelope from a response
   */
  private unwrap<T>(response: { data: { data: T } }): T {
    return response.data.data;
  }

  /**
   * Get public reviews for a product (renter-to-owner only)
   */
  async getProductReviews(productId: string): Promise<{ reviews: Review[]; count: number }> {
    const response = await api.get(config.reviews.listEndpoint, {
      params: { product: productId }
    });
    const data = this.unwrap<PaginatedData<Review>>(response);
    return { reviews: data.results || [], count: data.count || 0 };
  }

  /**
   * Create a review for a completed rental. Direction and reviewee are
   * derived server-side from who the reviewer is.
   */
  async createReview(rentalId: string, rating: number, comment: string): Promise<Review> {
    const response = await api.post(config.reviews.createEndpoint, {
      rental: rentalId,
      rating,
      comment,
    });
    return this.unwrap<Review>(response);
  }
}

export default new ReviewService();
