export interface RegistrationData {
  email: string;
  username: string;
  password: string;
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

export type RegistrationFormErrors = {
  [K in keyof RegistrationData]?: string;
} & RegistrationValidationErrors;

export type LoginFormErrors = {
  [K in keyof LoginData]?: string;
};