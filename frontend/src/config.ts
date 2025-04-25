// Application configuration
const config = {
  // API endpoint (for regular API calls)
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:8000',
  
  // Development mode (set to false in production)
  isDevelopment: true,
  
  // Authentication settings
  auth: {
    // Local storage keys
    tokenStorageKey: 'access_token',
    refreshTokenStorageKey: 'refresh_token',
    userStorageKey: 'user',
    
    // Authentication endpoints
    loginEndpoint: '/auth/login/',
    registerEndpoint: '/auth/register/',
    logoutEndpoint: '/auth/logout/',
    verifyEmailEndpoint: '/auth/verify-email/',
    resendVerificationEndpoint: '/auth/resend-verification/',
    passwordResetEndpoint: '/auth/password/reset/',
    passwordResetConfirmEndpoint: '/auth/password-reset-confirm/',
    refreshTokenEndpoint: '/auth/token/refresh/',
    profileEndpoint: "/users/profiles/me/",
    updateEndpoint: "/users/profiles/update_profile/",
    completeProfileEndpoint: '/users/profiles/complete_profile/',
  },
  
  // Product settings
  products: {
    // Product endpoints
    listEndpoint: '/products/',
    userProductsEndpoint: '/products/my_products/',
    detailEndpoint: (id: string) => `/products/${id}/`,
    createEndpoint: '/products/',
    updateEndpoint: (id: string) => `/products/${id}/`,
    deleteEndpoint: (id: string) => `/products/${id}/`,
    updateStatusEndpoint: (id: string) => `/products/${id}/update_status/`,
    // Additional endpoints
    unavailableDatesEndpoint: (id: string) => `/products/${id}/unavailable_dates/`,
    pricingTiersEndpoint: (id: string) => `/products/${id}/pricing_tiers/`,
    availabilityEndpoint: (id: string) => `/products/${id}/availability/`,
    pricingEndpoint: (id: string) => `/products/${id}/pricing/`,
    submitForReviewEndpoint: (id: string) => `/products/${id}/submit_for_review/`,
    incrementViewsEndpoint: (id: string) => `/products/${id}/increment_views/`,
    updateRatingEndpoint: (id: string) => `/products/${id}/update_rating/`,
  },
  
  // Rental settings
  rentals: {
    // Rental endpoints
    listEndpoint: '/rentals/',
    myRentalsEndpoint: '/rentals/my-rentals/',
    myListingsRentalsEndpoint: '/rentals/my-listings-rentals/',
    detailEndpoint: (id: string) => `/rentals/${id}/`,
    createEndpoint: '/rentals/',
    updateEndpoint: (id: string) => `/rentals/${id}/`,
    deleteEndpoint: (id: string) => `/rentals/${id}/`,
    
    // Status change endpoints
    acceptEndpoint: (id: string) => `/rentals/${id}/accept/`,
    rejectEndpoint: (id: string) => `/rentals/${id}/reject/`,
    cancelEndpoint: (id: string) => `/rentals/${id}/cancel/`,
    
    // Rental photos endpoints
    photosEndpoint: (rentalId: string) => `/rentals/${rentalId}/photos/`,
    photoDetailEndpoint: (rentalId: string, photoId: string) => `/rentals/${rentalId}/photos/${photoId}/`,
  },
};

export default config;
