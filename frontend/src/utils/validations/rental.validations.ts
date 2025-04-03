import { RentalRequestData } from '@/types/rental';

export const validateStartDate = (startDate: string): string | null => {
  if (!startDate) return 'Start date is required';
  const date = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date < today) return 'Start date cannot be in the past';
  return null;
};

export const validateEndDate = (startDate: string, endDate: string): string | null => {
  if (!endDate) return 'End date is required';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (end < today) return 'End date cannot be in the past';
  if (end < start) return 'End date must be after start date';
  
  // Calculate the difference in days
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 30) return 'Rental period cannot exceed 30 days';
  return null;
};

export const validateQuantity = (quantity: number): string | null => {
  if (!quantity) return 'Quantity is required';
  if (quantity <= 0) return 'Quantity must be greater than 0';
  if (quantity > 10) return 'Maximum quantity allowed is 10';
  return null;
};

export const validateMessage = (message: string): string | null => {
  if (!message) return 'Message is required';
  if (message.length < 10) return 'Message must be at least 10 characters';
  if (message.length > 500) return 'Message must be less than 500 characters';
  return null;
};

export const validateRentalRequest = (data: RentalRequestData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  const startDateError = validateStartDate(data.startDate);
  if (startDateError) errors.startDate = startDateError;
  
  const endDateError = validateEndDate(data.startDate, data.endDate);
  if (endDateError) errors.endDate = endDateError;
  
  const quantityError = validateQuantity(data.quantity);
  if (quantityError) errors.quantity = quantityError;
  
  const messageError = validateMessage(data.message);
  if (messageError) errors.message = messageError;
  
  return errors;
}; 