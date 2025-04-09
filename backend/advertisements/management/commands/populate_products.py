import random
import requests
import json
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.files.base import ContentFile
from advertisements.models import Product, ProductImage, PricingTier, UnavailableDate
from advertisements.constants import CATEGORY_CHOICES, PRODUCT_TYPE_CHOICES, OWNERSHIP_HISTORY_CHOICES
import os
from urllib.parse import urlparse

User = get_user_model()

# Dictionary mapping categories to Unsplash search terms for better image results
CATEGORY_IMAGE_SEARCH = {
    "photography_videography": ["camera", "photography", "videography", "drone", "lens"],
    "sports_fitness": ["fitness", "sports", "yoga", "gym", "bicycle"],
    "tools_equipment": ["tools", "equipment", "drill", "garden tools", "workshop"],
    "electronics": ["electronics", "laptop", "smartphone", "gadget", "headphones"],
    "musical_instruments": ["guitar", "piano", "drums", "music", "instrument"],
    "party_events": ["party", "celebration", "event", "decoration", "tent"],
    "fashion_accessories": ["fashion", "accessories", "watch", "jewelry", "designer"],
    "home_garden": ["furniture", "home", "interior", "garden", "decor"],
    "books_media": ["books", "media", "library", "reading", "magazine"],
    "toys_games": ["toys", "games", "puzzle", "board game", "play"],
    "automotive": ["car", "automotive", "motorbike", "vehicle", "transport"],
    "other": ["items", "miscellaneous", "collection", "things", "stuff"],
}

# Product title templates by category
PRODUCT_TITLES = {
    "camera": [
        "Professional {brand} {model} DSLR Camera", 
        "{brand} {model} Mirrorless Camera",
        "High-end {brand} {model} Digital Camera",
        "{brand} {model} Camera with 4K Video"
    ],
    "lens": [
        "{brand} {focal_length}mm {aperture} Lens",
        "Professional {brand} {focal_length}mm Zoom Lens",
        "{brand} {focal_length}-{focal_length2}mm Zoom Lens",
        "Wide-angle {brand} {focal_length}mm Lens"
    ],
    "laptop": [
        "{brand} {model} Laptop - {processor} {ram}GB RAM",
        "{brand} {model} Gaming Laptop - {screen}\" Display",
        "Ultrabook {brand} {model} - {processor}",
        "{brand} {model} Business Laptop"
    ],
    "bicycle": [
        "{brand} {model} Mountain Bike",
        "{brand} {model} Racing Bike",
        "Professional {brand} {model} Bicycle",
        "{brand} {model} City Bike"
    ],
    # Add more templates for other product types...
}

# Brand names by product type
BRANDS = {
    "camera": ["Canon", "Nikon", "Sony", "Fujifilm", "Panasonic"],
    "lens": ["Canon", "Nikon", "Sigma", "Tamron", "Zeiss"],
    "laptop": ["Dell", "HP", "Lenovo", "Apple", "Asus", "Acer"],
    "bicycle": ["Trek", "Giant", "Specialized", "Cannondale", "Scott"],
    "smartphone": ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi"],
    # Add more brands...
}

# Common product attributes
PROCESSORS = ["Intel i5", "Intel i7", "Intel i9", "AMD Ryzen 5", "AMD Ryzen 7"]
RAM_OPTIONS = [8, 16, 32, 64]
SCREEN_SIZES = [13, 14, 15, 17]
FOCAL_LENGTHS = [24, 35, 50, 70, 85, 105, 200]
APERTURES = ["f/1.4", "f/1.8", "f/2.8", "f/4"]

# Common model numbers/names
MODELS = {
    "camera": ["EOS R5", "Z6 II", "Alpha A7 III", "X-T4", "GH5"],
    "lens": ["EF", "Nikkor", "G Master", "Art", "XF"],
    "laptop": ["XPS", "Spectre", "ThinkPad", "MacBook Pro", "ZenBook"],
    "bicycle": ["Domane", "Defy", "Roubaix", "CAAD", "Addict"],
    # Add more models...
}

# Location data for Bangladesh
LOCATIONS = [
    "Dhaka, Gulshan", "Dhaka, Banani", "Dhaka, Dhanmondi", "Dhaka, Uttara", 
    "Dhaka, Mirpur", "Dhaka, Mohakhali", "Chittagong, GEC Circle", 
    "Chittagong, Agrabad", "Khulna City", "Sylhet City", "Rajshahi City",
    "Rangpur City", "Barisal City", "Comilla City", "Mymensingh City"
]

# Add a list of reliable image URLs as fallbacks
FALLBACK_IMAGE_URLS = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",  # Headphones
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30",  # Watch
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",  # Camera
    "https://images.unsplash.com/photo-1581591524376-251701e6e104",  # Laptop
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff",  # Shoes
    "https://images.unsplash.com/photo-1570222094114-d054a817e56b",  # Bicycle
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",  # Tablet
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03",  # Gaming Console
    "https://images.unsplash.com/photo-1551184451-76b792a9a5a1",  # Guitar
    "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137",  # Furniture
    "https://images.unsplash.com/photo-1540103711724-ebf833bde8d1",  # Drone
    "https://images.unsplash.com/photo-1574158622682-e40e69881006",  # Tool
    "https://images.unsplash.com/photo-1613483811459-1c4bb7a7ab99",  # Camping gear
    "https://images.unsplash.com/photo-1619127277698-a3e9ec888c4b",  # Board game
    "https://images.unsplash.com/photo-1583394838336-acd977736f90",  # Fitness equipment
]

class Command(BaseCommand):
    help = 'Populates the database with realistic product data for all categories'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=5,
            help='Number of products to create per category'
        )
        parser.add_argument(
            '--images',
            type=int,
            default=3,
            help='Number of images per product'
        )

    def handle(self, *args, **kwargs):
        count_per_category = kwargs['count']
        images_per_product = kwargs['images']
        
        # Check if users exist in the database
        users = list(User.objects.all())
        if not users:
            self.stdout.write(self.style.ERROR('No users found in the database. Please create users first.'))
            return
            
        self.stdout.write(self.style.SUCCESS(f'Found {len(users)} users'))
        
        # Total number of products to create
        total_products = count_per_category * len(dict(CATEGORY_CHOICES))
        
        # Create products for each category
        created_count = 0
        
        # Group product types by category
        product_types_by_category = {}
        for product_type, category in PRODUCT_TYPE_CHOICES:
            if category not in product_types_by_category:
                product_types_by_category[category] = []
            product_types_by_category[category].append(product_type)
            
        for category_code, category_name in CATEGORY_CHOICES:
            self.stdout.write(self.style.SUCCESS(f'Creating products for category: {category_name}'))
            
            # Get product types for this category
            product_types = product_types_by_category.get(category_code, ["other"])
            
            for _ in range(count_per_category):
                # Select a product type for this category
                product_type = random.choice(product_types)
                
                # Create the product
                product = self.create_product(product_type, category_code, users)
                
                # Add pricing tiers
                self.create_pricing_tiers(product, product_type)
                
                # Add unavailable dates
                self.create_unavailable_dates(product)
                
                # Add images
                self.add_images(product, category_code, product_type, images_per_product)
                
                created_count += 1
                self.stdout.write(f'Created product {created_count}/{total_products}: {product.title}')
                
        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} products'))

    def create_product(self, product_type, category, users):
        """Create a product with realistic data based on type and category"""
        # Select a random owner
        owner = random.choice(users)
        
        # Generate a realistic title
        title = self.generate_title(product_type)
        
        # Generate a realistic description
        description = self.generate_description(product_type, title)
        
        # Pick a location
        location = random.choice(LOCATIONS)
        
        # Generate purchase year (between 2015 and current year)
        purchase_year = str(random.randint(2015, datetime.now().year))
        
        # Generate random price based on product type
        original_price = self.generate_original_price(product_type)
        
        # Pick a random ownership history
        ownership_history = random.choice([x[0] for x in OWNERSHIP_HISTORY_CHOICES])
        
        # Generate random security deposit (0-30% of original price)
        if random.random() < 0.8:  # 80% chance of having a security deposit
            security_deposit = round(original_price * random.uniform(0.05, 0.3), 2)
        else:
            security_deposit = None
            
        # Generate random ratings
        if random.random() < 0.7:  # 70% chance of having ratings
            average_rating = round(random.uniform(3.0, 5.0), 2)
            rental_count = random.randint(1, 30)
        else:
            average_rating = 0
            rental_count = 0
            
        # Create and save the product
        product = Product(
            owner=owner,
            title=title,
            category=category,
            product_type=product_type,
            description=description,
            location=location,
            security_deposit=security_deposit,
            purchase_year=purchase_year,
            original_price=original_price,
            ownership_history=ownership_history,
            status="active",  # All products active by default
            views_count=random.randint(10, 500),
            rental_count=rental_count,
            average_rating=average_rating,
        )
        product.save()
        return product
        
    def generate_title(self, product_type):
        """Generate a realistic title for a product based on its type"""
        # Get title templates for this product type, or use generic if not found
        templates = PRODUCT_TITLES.get(product_type, ["{brand} {model} {product_type}"])
        
        # Pick a random template
        template = random.choice(templates)
        
        # Populate template with realistic values
        title_data = {
            'brand': random.choice(BRANDS.get(product_type, ["Premium", "Quality", "Professional"])),
            'model': random.choice(MODELS.get(product_type, ["X1", "Pro", "Ultra", "Max"])),
            'product_type': product_type.replace('_', ' ').title(),
            'processor': random.choice(PROCESSORS),
            'ram': random.choice(RAM_OPTIONS),
            'screen': random.choice(SCREEN_SIZES),
            'focal_length': random.choice(FOCAL_LENGTHS),
            'focal_length2': random.choice(FOCAL_LENGTHS) + 100,
            'aperture': random.choice(APERTURES),
        }
        
        return template.format(**title_data)
        
    def generate_description(self, product_type, title):
        """Generate a realistic and detailed product description"""
        condition = random.choice(["Excellent", "Very Good", "Good", "Like New", "Mint"])
        age = random.randint(1, 5)
        
        description_parts = [
            f"# {title}",
            "",
            f"**Condition:** {condition}",
            f"**Age:** {age} year{'s' if age > 1 else ''}",
            "",
            "## Features",
            "* " + "\n* ".join([
                self.generate_feature(product_type) for _ in range(random.randint(3, 6))
            ]),
            "",
            "## Rental Information",
            "* Perfect for events, projects, and temporary needs",
            "* Available for pickup or delivery (within city limits)",
            f"* {self.generate_product_advantage(product_type)}",
            "",
            "## Owner's Notes",
            self.generate_owner_notes(product_type)
        ]
        
        return "\n".join(description_parts)
        
    def generate_feature(self, product_type):
        """Generate a realistic feature based on product type"""
        features = {
            "camera": [
                "High-resolution sensor for professional quality photos",
                "4K video recording capabilities",
                "Fast autofocus system",
                "Weather-sealed body for outdoor shooting",
                "Multiple shooting modes for different scenarios",
                "Excellent low-light performance",
                "Wi-Fi and Bluetooth connectivity",
                "Touch screen interface",
                "Long battery life"
            ],
            "laptop": [
                "Fast processor for multitasking",
                "High-resolution display",
                "Solid-state drive for quick loading times",
                "Backlit keyboard for working in dark environments",
                "Long battery life for all-day use",
                "Lightweight and portable design",
                "Multiple ports for connectivity",
                "Powerful graphics card for gaming and editing",
                "High-quality speakers"
            ],
            # Add more product-specific features...
        }
        
        # Get features for this product type, or use generic if not found
        product_features = features.get(product_type, [
            "Premium quality and performance",
            "Easy to use and set up",
            "Compact and portable design",
            "Reliable and tested functionality",
            "Complete with all necessary accessories",
            "Perfect for professional and personal use"
        ])
        
        return random.choice(product_features)
        
    def generate_product_advantage(self, product_type):
        """Generate a product advantage for rental"""
        advantages = [
            "Try before you buy - test this product for your needs",
            "Save money on expensive equipment you only need temporarily",
            "Access to professional-grade equipment without the investment",
            "Perfect for one-time projects or events",
            "Ideal for those who need equipment only occasionally"
        ]
        return random.choice(advantages)
        
    def generate_owner_notes(self, product_type):
        """Generate realistic owner notes"""
        notes = [
            "I've taken great care of this item and it's in excellent condition.",
            "This has been my go-to equipment for years, very reliable.",
            "Barely used, almost like new. Decided to rent it out when not in use.",
            "Used professionally but well-maintained. All functions work perfectly.",
            "Purchased recently but don't use it as often as expected. Perfect for someone who needs it temporarily."
        ]
        return random.choice(notes)
        
    def generate_original_price(self, product_type):
        """Generate a realistic original price based on product type"""
        # Price ranges by product type (min, max)
        price_ranges = {
            "camera": (15000, 50000),
            "lens": (10000, 40000),
            "laptop": (30000, 120000),
            "smartphone": (20000, 80000),
            "bicycle": (8000, 30000),
            # More product types can be added here
        }
        
        # Get price range for this product type, or use default
        min_price, max_price = price_ranges.get(product_type, (1000, 20000))
        
        # Generate a random price within the range
        return round(random.uniform(min_price, max_price), 2)
    
    def create_pricing_tiers(self, product, product_type):
        """Create realistic pricing tiers for a product"""
        # Determine how many pricing tiers to create (1-3)
        tier_count = random.randint(1, 3)
        
        # Available duration units
        durations = ["day", "week", "month"]
        
        # Price multipliers based on duration (relative to original price)
        multipliers = {
            "day": (0.001, 0.01),   # 0.1% to 1% of original price per day
            "week": (0.005, 0.05),  # 0.5% to 5% of original price per week
            "month": (0.02, 0.2)    # 2% to 20% of original price per month
        }
        
        # Higher value items have lower percentage rates
        if product.original_price > 50000:
            multipliers = {k: (v[0]*0.5, v[1]*0.5) for k, v in multipliers.items()}
        
        # Select random durations
        selected_durations = random.sample(durations, tier_count)
        
        for duration in selected_durations:
            # Calculate price based on original price and duration
            min_mult, max_mult = multipliers[duration]
            price_rate = random.uniform(min_mult, max_mult)
            price = max(int(product.original_price * price_rate), 100)  # Minimum 100 taka
            
            # Set maximum rental period
            if duration == "day":
                max_period = random.choice([7, 14, 30])
            elif duration == "week":
                max_period = random.choice([2, 4, 8])
            else:  # month
                max_period = random.choice([1, 2, 3, 6])
            
            # Create the pricing tier
            PricingTier.objects.create(
                product=product,
                duration_unit=duration,
                price=price,
                max_period=max_period
            )

    def create_unavailable_dates(self, product):
        """Create realistic unavailable dates for a product"""
        # Determine if the product has unavailable dates (70% chance)
        if random.random() < 0.7:
            # Determine how many date ranges to create (1-3)
            date_count = random.randint(1, 3)
            
            today = timezone.now().date()
            
            for _ in range(date_count):
                # Decide between single date and date range (30% single, 70% range)
                is_range = random.random() < 0.7
                
                # Generate random dates in the future (within next 90 days)
                future_days = random.randint(1, 90)
                date_value = today + timedelta(days=future_days)
                
                if is_range:
                    # Create a date range (1-14 days)
                    range_length = random.randint(1, 14)
                    range_start = date_value
                    range_end = range_start + timedelta(days=range_length)
                    
                    UnavailableDate.objects.create(
                        product=product,
                        date=range_start,
                        is_range=True,
                        range_start=range_start,
                        range_end=range_end
                    )
                else:
                    # Create a single unavailable date
                    UnavailableDate.objects.create(
                        product=product,
                        date=date_value,
                        is_range=False
                    )

    def add_images(self, product, category, product_type, image_count):
        """Add images to a product with fallback mechanism"""
        placeholder_image = "product_images/placeholder.jpg"
        
        # Make sure we have at least some images for the product
        for i in range(image_count):
            # Check for existing images
            existing_images = ProductImage.objects.filter(product=product)
            if existing_images.exists() and i < existing_images.count():
                continue
            
            # Try to get an image from the fallback list
            try:
                # Determine which fallback URL to use to ensure variety
                fallback_url = FALLBACK_IMAGE_URLS[i % len(FALLBACK_IMAGE_URLS)]
                image_url = f"{fallback_url}?w=800&h=600&fit=crop&auto=format&q=80&{category}"
                
                # Download the image
                self.stdout.write(f"Downloading image from {image_url}")
                response = requests.get(image_url, stream=True, timeout=10)
                
                if response.status_code == 200:
                    # Generate a unique filename
                    filename = f"{category}_{product.id}_{i}_{int(timezone.now().timestamp())}.jpg"
                    
                    # Create a ProductImage instance
                    product_image = ProductImage(product=product)
                    
                    # Save the image content to the ProductImage
                    product_image.image.save(
                        filename,
                        ContentFile(response.content),
                        save=True
                    )
                    self.stdout.write(f"Added image {i+1} to product {product.title}")
                else:
                    # If download fails, create with placeholder
                    self.stdout.write(self.style.WARNING(f"Failed to download image (status {response.status_code}), using placeholder"))
                    ProductImage.objects.create(
                        product=product,
                        image=placeholder_image
                    )
            except Exception as e:
                # Log the error but continue with next image
                self.stdout.write(self.style.WARNING(f"Error downloading image: {str(e)}"))
                try:
                    # Create with placeholder
                    ProductImage.objects.create(
                        product=product,
                        image=placeholder_image
                    )
                    self.stdout.write(f"Added placeholder image {i+1} to product {product.title}")
                except Exception as inner_e:
                    self.stdout.write(self.style.ERROR(f"Could not add placeholder image: {str(inner_e)}")) 