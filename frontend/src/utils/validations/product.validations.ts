import { ListingFormData } from '@/types/listings';

export const validateTitle = (title: string): string | null => {
  if (!title) return 'Title is required';
  if (title.length < 3) return 'Title must be at least 3 characters';
  if (title.length > 100) return 'Title must be less than 100 characters';
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (!description) return 'Description is required';
  if (description.length < 10) return 'Description must be at least 10 characters';
  if (description.length > 1000) return 'Description must be less than 1000 characters';
  return null;
};

export const validatePrice = (price: number): string | null => {
  if (!price) return 'Price is required';
  if (price <= 0) return 'Price must be greater than 0';
  if (price > 1000000) return 'Price must be less than 1,000,000';
  return null;
};

export const validateCategory = (category: string): string | null => {
  if (!category) return 'Category is required';
  return null;
};

export const validateImages = (images: File[]): string | null => {
  if (!images || images.length === 0) return 'At least one image is required';
  if (images.length > 5) return 'Maximum 5 images allowed';
  
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  for (const image of images) {
    if (!validTypes.includes(image.type)) {
      return 'Only JPEG, PNG images are allowed';
    }
    if (image.size > maxSize) {
      return 'Image size must be less than 5MB';
    }
  }
  
  return null;
};

export const validateProductForm = (data: ListingFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  const titleError = validateTitle(data.title);
  if (titleError) errors.title = titleError;
  
  const descriptionError = validateDescription(data.description);
  if (descriptionError) errors.description = descriptionError;
  
  const priceError = validatePrice(data.basePrice);
  if (priceError) errors.price = priceError;
  
  const categoryError = validateCategory(data.category);
  if (categoryError) errors.category = categoryError;
  
  const imagesError = validateImages(data.images);
  if (imagesError) errors.images = imagesError;
  
  return errors;
}; 