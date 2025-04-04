// Application configuration
const config = {
  // API endpoint (for regular API calls)
  apiUrl: 'http://localhost:8000',
  
  // Base URL for the application
  baseUrl: 'http://localhost:8000',
  
  // Development mode (set to false in production)
  isDevelopment: true,
  
  // Authentication settings
  auth: {
    // Local storage keys
    tokenStorageKey: 'access_token',
    refreshTokenStorageKey: 'refresh_token',
    userStorageKey: 'user',
    
    // Authentication endpoints (note: these don't use the /api prefix)
    loginEndpoint: '/auth/login/',
    registerEndpoint: '/auth/register/',
    logoutEndpoint: '/auth/logout/',
    verifyEmailEndpoint: '/auth/verify-email/',
    resendVerificationEndpoint: '/auth/resend-verification/',
    passwordResetEndpoint: '/auth/password-reset/',
    passwordResetConfirmEndpoint: '/auth/password-reset-confirm/',
    refreshTokenEndpoint: '/auth/token/refresh/',
    profileEndpoint: "/users/profiles/me/",
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
  },
};

export default config;
