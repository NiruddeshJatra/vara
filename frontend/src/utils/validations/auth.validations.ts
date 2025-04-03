import { LoginData, RegistrationData, ProfileFormData } from '@/types/auth';

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 20) return 'Username must be less than 20 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  return null;
};

export const validatePhoneNumber = (phoneNumber: string): string | null => {
  if (!phoneNumber) return 'Phone number is required';
  const phoneRegex = /^(\+?88)?01[3-9]\d{8}$/;
  if (!phoneRegex.test(phoneNumber)) return 'Please enter a valid Bangladeshi phone number';
  return null;
};

export const validateNationalId = (nationalId: string): string | null => {
  if (!nationalId) return 'National ID number is required';
  if (!/^\d{10}$/.test(nationalId)) return 'National ID must be 10 digits';
  return null;
};

export const validateDateOfBirth = (dateOfBirth: string): string | null => {
  if (!dateOfBirth) return 'Date of birth is required';
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (age < 18 || (age === 18 && monthDiff < 0)) {
    return 'You must be at least 18 years old';
  }
  return null;
};

export const validateLocation = (location: string): string | null => {
  if (!location) return 'Location is required';
  return null;
};

export const validateLoginForm = (data: LoginData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

export const validateRegistrationForm = (data: RegistrationData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const usernameError = validateUsername(data.username);
  if (usernameError) errors.username = usernameError;
  
  const passwordError = validatePassword(data.password1);
  if (passwordError) errors.password1 = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(data.password1, data.password2);
  if (confirmPasswordError) errors.password2 = confirmPasswordError;
  
  if (!data.termsAgreed) {
    errors.termsAgreed = 'You must agree to the terms and conditions';
  }
  
  return errors;
};

export const validateProfileForm = (data: ProfileFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!data.firstName) errors.firstName = 'First name is required';
  if (!data.lastName) errors.lastName = 'Last name is required';
  
  const phoneError = validatePhoneNumber(data.phoneNumber);
  if (phoneError) errors.phoneNumber = phoneError;
  
  const locationError = validateLocation(data.location);
  if (locationError) errors.location = locationError;
  
  const dateOfBirthError = validateDateOfBirth(data.dateOfBirth);
  if (dateOfBirthError) errors.dateOfBirth = dateOfBirthError;
  
  const nationalIdError = validateNationalId(data.nationalIdNumber);
  if (nationalIdError) errors.nationalIdNumber = nationalIdError;
  
  if (!data.nationalIdFront) errors.nationalIdFront = 'National ID front photo is required';
  if (!data.nationalIdBack) errors.nationalIdBack = 'National ID back photo is required';
  
  return errors;
}; 