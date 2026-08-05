# Bhara - P2P Rental Marketplace Frontend

## Overview

Bhara is a peer-to-peer rental marketplace that allows users to list their items for rent and rent items from others. The platform serves as a trusted intermediary, handling communications, payments, and security deposits to ensure safe and reliable transactions between parties.

## Tech Stack

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Library**: Custom components built with shadcn/ui
- **State Management**: React Context and Hooks
- **Routing**: React Router
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Pages and User Flow

### 1. Authentication Pages

- **Login**: User authentication with email/password
- **Register**: New user registration with basic profile details
- **Forgot Password**: Password recovery flow

### 2. Homepage

- **Hero Section**: Main banner with value proposition
- **Featured Items**: Showcase of popular rental items
- **Categories**: Quick navigation to item categories
- **How It Works**: Step-by-step guide to using the platform
- **Testimonials**: User reviews of the platform

### 3. Item Browsing

- **Search Results**: Grid view of items matching search criteria
- **CompactSearchBar**: Allows filtering by:
  - Keywords
  - Location
  - Price range
  - Availability

### 4. Item Details

- **ItemDetail**: Comprehensive view of an item with:
  - Images gallery
  - Description
  - Specifications
  - Pricing information
  - Owner details
  - Availability calendar
  - Reviews
  - "Request to Rent" button

### 5. Item Listing

- **Create Listing**: Multi-step form to add a new item:
  - Basic details (title, category)
  - Description and specifications
  - Photos upload
  - Pricing (daily rate, security deposit)
  - Availability settings

### 6. Rental Management

- **My Rentals**: Central hub for managing all rental activities
- **RentalsStatusFilter**: Filter rentals by:
  - Status (pending, accepted, in_progress, completed, rejected, cancelled)
  - Date range
  - Search terms
  - Sort options

- **RentalCard**: Compact view of rental information:
  - Item image and title
  - Rental period and status
  - Price information
  - Action buttons

- **RentalDetailModal**: Comprehensive view of a rental with:
  - Item details and images
  - Rental timeline
  - Pricing breakdown with service fees
  - Documentation photos
  - Communication options
  - Status-based actions

### 7. User Profile

- **Profile View**: User information and statistics
- **Edit Profile**: Update personal information
- **Preferences**: Notification and privacy settings

### 8. Reviews System

- **ReviewForm**: Submit reviews after completed rentals
- **ReviewSection**: Display reviews for items and users

## User Journeys

### Renter Journey

1. **Browse & Search**: User searches for needed items using filters
2. **View Item**: User reviews item details, photos, and pricing
3. **Request Rental**: User selects dates and submits rental request
4. **Confirm Rental**: After owner acceptance, user confirms booking
5. **Pickup/Delivery**: User receives the item and confirms receipt
6. **Use Item**: User uses the item during the rental period
7. **Return Item**: User returns the item to the owner
8. **Complete Rental**: User marks the rental as complete
9. **Leave Review**: User reviews their experience

### Owner Journey

1. **Create Listing**: User lists an item with details, photos, and pricing
2. **Manage Requests**: User receives and reviews rental requests
3. **Accept/Reject**: User decides whether to accept rental requests
4. **Handover Item**: User provides the item to the renter
5. **Monitor Rental**: User tracks active rentals
6. **Receive Item**: User gets the item back from the renter
7. **Confirm Return**: User confirms item returned in good condition
8. **Complete Transaction**: User receives payment after rental completion
9. **Review Renter**: User reviews the renter's behavior

## Component Hierarchy

```
App
├── Layout
│   ├── Navbar
│   └── Footer
├── Pages
│   ├── Home
│   ├── Search
│   │   └── CompactSearchBar
│   ├── ItemDetail
│   │   ├── Gallery
│   │   ├── PricingCard
│   │   └── ReviewSection
│   ├── CreateListing
│   │   └── MultiStepForm
│   └── Rentals
│       ├── RentalsStatusFilter
│       ├── RentalCard
│       └── RentalDetailModal
│           └── ReviewForm
└── Shared Components
    ├── UI Components (Button, Input, etc.)
    ├── Loaders
    └── Modals
```

## State Management

- **Authentication State**: User login status and profile information
- **Search State**: Current search parameters and results
- **Rental State**: Active rentals and their statuses
- **UI State**: Modal visibility, active tabs, etc.

## Data Flow

1. **API Requests**: Components fetch data from backend APIs
2. **Context Providers**: Shared state is managed through React Context
3. **Props Drilling**: Parent components pass data to children
4. **Event Handlers**: User interactions trigger state updates and API calls

## Protected Features

Bhara implements a middleman model to protect both parties:

- **Secure Payments**: Bhara holds payments until rental completion
- **Security Deposits**: Deposits are managed by Bhara and returned after successful completion
- **Bhara-Protected Communication**: All communications happen through the platform
- **Documentation Photos**: Required photos before and after rental to prevent disputes

## Color System

The application follows a color-coded system for rental statuses:
- **Pending**: Yellow
- **Accepted**: Blue
- **In Progress**: Green
- **Completed**: Purple
- **Rejected**: Red
- **Cancelled**: Orange

The primary brand colors are shades of green, with neutral grays for base UI elements.
