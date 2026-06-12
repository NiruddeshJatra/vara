// Application configuration
// Single API base URL — set VITE_API_URL in .env (e.g. http://localhost:8000/api)
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const config = {
  // API endpoint (all backend responses use the {success, message, data} envelope)
  apiUrl,
  // Origin for relative media paths (apiUrl minus the /api suffix)
  mediaUrl: apiUrl.replace(/\/api\/?$/, ''),

  isDevelopment: import.meta.env.DEV,

  // Authentication endpoints (phone + OTP)
  auth: {
    otpRequestEndpoint: '/auth/otp/request/',
    otpVerifyEndpoint: '/auth/otp/verify/',
    signupCompleteEndpoint: '/auth/signup/complete/',
    loginEndpoint: '/auth/login/',
    logoutEndpoint: '/auth/logout/',
    refreshTokenEndpoint: '/auth/token/refresh/',
    passwordResetCompleteEndpoint: '/auth/password-reset/complete/',
    profileEndpoint: '/users/profile/',
    profileStep1Endpoint: '/users/profile/step1/',
    profileStep2Endpoint: '/users/profile/step2/',
  },

  // Listing endpoints
  products: {
    listEndpoint: '/listings/',
    userProductsEndpoint: '/listings/my_products/',
    detailEndpoint: (id: string) => `/listings/${id}/`,
    createEndpoint: '/listings/',
    updateEndpoint: (id: string) => `/listings/${id}/`,
    deleteEndpoint: (id: string) => `/listings/${id}/`,
  },

  // Rental endpoints
  rentals: {
    listEndpoint: '/rentals/',
    myRentalsEndpoint: '/rentals/my-rentals/',
    myListingsRentalsEndpoint: '/rentals/my-listings-rentals/',
    detailEndpoint: (id: string) => `/rentals/${id}/`,
    createEndpoint: '/rentals/',

    // Status change endpoints (owner accept/reject, renter cancel)
    acceptEndpoint: (id: string) => `/rentals/${id}/accept/`,
    rejectEndpoint: (id: string) => `/rentals/${id}/reject/`,
    cancelEndpoint: (id: string) => `/rentals/${id}/cancel/`,

    // Rental photos endpoints
    photosEndpoint: (rentalId: string) => `/rentals/${rentalId}/photos/`,
  },

  // Review endpoints
  reviews: {
    listEndpoint: '/reviews/',
    createEndpoint: '/reviews/',
    pendingEndpoint: '/reviews/pending/',
  },
};

export default config;
