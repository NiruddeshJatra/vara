import api from '@/lib/axios';
import { Product, ListingFormData } from '../types/listings';
import config from '../config';
import i18n from '@/i18n';
import { toast } from '@/components/ui/use-toast';
import { queryClient } from '../lib/react-query';
import { getApiError } from '@/utils/apiError';

interface PaginatedData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Service for handling product-related operations
 */
class ProductService {
  /**
   * Unwrap the {success, message, data} envelope from a response
   */
  private unwrap<T>(response: { data: { data: T } }): T {
    return response.data.data;
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
      return `${config.mediaUrl}${imageUrl}`;
    }

    // If it's a relative URL (starts with media/), add the base URL
    if (imageUrl.startsWith('media/')) {
      return `${config.mediaUrl}/${imageUrl}`;
    }

    // For all other cases, prepend the base URL and media path
    return `${config.mediaUrl}/media/${imageUrl}`;
  }

  /**
   * Normalize image URLs on a product
   */
  private withFullImageUrls(product: Product): Product {
    return {
      ...product,
      images: (product.images || []).map((img) => ({
        ...img,
        image: this.ensureFullImageUrl(img.image),
      })),
    };
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
        }
      });
      const data = this.unwrap<PaginatedData<Product>>(response);
      const products = (data.results || []).map((product) => this.withFullImageUrls(product));
      return { products, count: data.count || products.length };
    } catch (error) {
      toast({
        title: i18n.t('common.toastError'),
        description: i18n.t('services.fetchProductsFailed'),
        variant: "destructive"
      });
      return { products: [], count: 0 };
    }
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
      const data = this.unwrap<PaginatedData<Product>>(response);
      const products = (data.results || []).map((product) => this.withFullImageUrls(product));
      return { products, count: data.count || products.length };
    } catch (error) {
      toast({
        title: i18n.t('common.toastError'),
        description: i18n.t('services.fetchYourProductsFailed'),
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
      return this.withFullImageUrls(this.unwrap<Product>(response));
    } catch (error) {
      toast({
        title: i18n.t('common.toastError'),
        description: i18n.t('services.fetchProductFailed'),
        variant: "destructive"
      });
      throw error;
    }
  }

  /**
   * Build the multipart form body for create/update
   */
  private buildFormData(data: Partial<ListingFormData>): FormData {
    const formData = new FormData();

    if (data.title !== undefined) formData.append('title', data.title);
    if (data.category !== undefined) formData.append('category', data.category);
    if (data.product_type !== undefined) formData.append('product_type', data.product_type);
    if (data.description !== undefined) formData.append('description', data.description || '');
    if (data.location !== undefined) formData.append('location', data.location);
    if (data.security_deposit !== undefined && data.security_deposit !== null) {
      formData.append('security_deposit', String(data.security_deposit));
    }
    if (data.purchase_year !== undefined) formData.append('purchase_year', data.purchase_year);
    if (data.original_price !== undefined) formData.append('original_price', String(data.original_price));
    if (data.ownership_history !== undefined) formData.append('ownership_history', data.ownership_history);

    if (data.images && data.images.length > 0) {
      data.images.forEach((image, idx) => {
        if (image instanceof File) {
          formData.append('images', image);
        } else {
          console.error(`Image at index ${idx} is not a File:`, image, typeof image);
        }
      });
    }

    if (data.unavailable_periods && data.unavailable_periods.length > 0) {
      const formattedPeriods = data.unavailable_periods.map(period => ({
        date: period.date ? new Date(period.date).toISOString().split('T')[0] : null,
        is_range: period.is_range,
        range_start: period.range_start ? new Date(period.range_start).toISOString().split('T')[0] : null,
        range_end: period.range_end ? new Date(period.range_end).toISOString().split('T')[0] : null
      }));
      formData.append('unavailable_periods', JSON.stringify(formattedPeriods));
    }

    if (data.pricing_tiers && data.pricing_tiers.length > 0) {
      const formattedTiers = data.pricing_tiers.map(tier => ({
        duration_unit: tier.duration_unit.toLowerCase(),
        price: tier.price,
        max_period: tier.max_period || null
      }));
      formData.append('pricing_tiers', JSON.stringify(formattedTiers));
    }

    return formData;
  }

  /**
   * Create a new product
   * @param data The product data to create
   * @returns The created product
   */
  async createProduct(data: ListingFormData): Promise<Product> {
    try {
      const formData = this.buildFormData(data);

      const response = await api.post(config.products.createEndpoint, formData);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });

      toast({
        title: i18n.t('common.toastSuccess'),
        description: i18n.t('services.productCreated'),
      });

      return this.unwrap<Product>(response);
    } catch (error: any) {
      console.error('Product creation error:', error);

      if (error.response?.status === 401) {
        toast({
          title: i18n.t('services.authErrorTitle'),
          description: i18n.t('services.loginAgainToCreate'),
          variant: "destructive"
        });
      } else {
        toast({
          title: i18n.t('services.productCreateFailedTitle'),
          description: getApiError(error),
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
      const formData = this.buildFormData(data);

      const response = await api.patch(config.products.updateEndpoint(productId), formData);

      // Invalidate specific product and related queries
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });

      toast({
        title: i18n.t('common.toastSuccess'),
        description: i18n.t('services.productUpdated'),
      });

      return this.unwrap<Product>(response);
    } catch (error: any) {
      const fieldErrors = error.response?.data?.data;
      if (fieldErrors?.images) {
        toast({
          title: i18n.t('services.imageUploadFailed'),
          description: fieldErrors.images.join(', '),
          variant: "destructive"
        });
        throw new Error(`Image upload failed: ${fieldErrors.images.join(', ')}`);
      }

      toast({
        title: i18n.t('services.updateFailedTitle'),
        description: getApiError(error),
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
      await api.delete(config.products.deleteEndpoint(productId));

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      // Remove specific product from cache
      queryClient.removeQueries({ queryKey: ['product', productId] });

      toast({
        title: i18n.t('common.toastSuccess'),
        description: i18n.t('services.productDeleted'),
      });
    } catch (error) {
      toast({
        title: i18n.t('services.deleteFailedTitle'),
        description: i18n.t('profilePage.deleteFailed'),
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
          page_size: 5
        }
      });

      const data = this.unwrap<PaginatedData<Product>>(response);
      return (data.results || [])
        .filter((product) => product.id !== excludeProductId)
        .slice(0, 4)
        .map((product) => this.withFullImageUrls(product));
    } catch (error) {
      console.error('Error fetching similar products:', error);
      return [];
    }
  }
}

export default new ProductService();
