// types/auth.ts
export type FormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  dateOfBirth: string;
  termsAgreed: boolean;
  dataConsent: boolean;
  marketingConsent: boolean;
};

export type FormErrors = {
  [K in keyof FormData]?: string;
}; 