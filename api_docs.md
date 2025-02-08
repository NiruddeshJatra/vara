# API Documentation

## Authentication
- POST /auth/login/ - Login user
- POST /auth/register/ - Register new user
- POST /auth/verify-email/<uidb64>/<token>/ - Verify email
- POST /auth/logout/ - Logout user

## Users
- GET /api/users/me/ - Get current user profile
- PUT /api/users/me/ - Update current user profile
- POST /api/users/upload-picture/ - Upload profile picture
- DELETE /api/users/delete-account/ - Delete user account

## Products
- GET /api/products/ - List all products
- POST /api/products/ - Create new product
- GET /api/products/{id}/ - Get product details
- PUT /api/products/{id}/ - Update product
- DELETE /api/products/{id}/ - Delete product
- POST /api/products/{id}/toggle-status/ - Toggle product status

## Rentals
- GET /api/rentals/ - List all rentals
- POST /api/rentals/ - Create rental request
- GET /api/rentals/my-rentals/ - List user's rentals
- POST /api/rentals/{id}/accept/ - Accept rental request
- POST /api/rentals/{id}/reject/ - Reject rental request
- POST /api/rentals/{id}/complete/ - Complete rental
- POST /api/rentals/{id}/cancel/ - Cancel a pending rental request
