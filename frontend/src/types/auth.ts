export interface RegistrationData {
  email: string;
  username: string;
  password1: string;
  password2: string;
  termsAgreed: boolean;
  marketingConsent: boolean;
  profileCompleted: boolean;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  dateOfBirth: string;
  nationalIdNumber: string;
  nationalIdFront: File | null;
  nationalIdBack: File | null;
  profileCompleted?: boolean;
}

export interface ProfileCompletionData {
  profileCompleted: boolean;
}

// For login
export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// User data from the server
export interface UserData {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  profilePicture: string | null;
  isVerified: boolean;
  isTrusted: boolean;
  averageRating: number;
  dateOfBirth?: string;
  nationalIdNumber?: string;
  nationalIdFront?: string;
  nationalIdBack?: string;
  profileComplete: boolean;
}

// API response
export interface AuthResponse {
  user: UserData;
  accessToken?: string;
  refreshToken?: string;
}

// Form errors
export type ProfileFormErrors = {
  [K in keyof ProfileFormData]?: string;
};

export interface RegistrationValidationErrors {
  confirmPassword?: string;
}

export interface RegistrationFormErrors {
  email?: string;
  username?: string;
  password1?: string;
  password2?: string;
  termsAgreed?: string;
  confirmPassword?: string;
}

export type LoginFormErrors = {
  [K in keyof LoginData]?: string;
};