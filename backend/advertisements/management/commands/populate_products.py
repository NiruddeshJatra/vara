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
from django.db import transaction
from django.db.utils import IntegrityError

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
            '--total',
            type=int,
            default=0,
            help='Total number of products to create across all categories'
        )
        parser.add_argument(
            '--images',
            type=int,
            default=3,
            help='Number of images per product'
        )
        parser.add_argument(
            '--setup-dirs',
            action='store_true',
            help='Create directory structure for product images by product type'
        )

    def handle(self, *args, **kwargs):
        # Check if we need to set up the directory structure
        if kwargs['setup_dirs']:
            self.setup_product_images_directory()
            return
            
        count_per_category = kwargs['count']
        total_products = kwargs['total'] or 100  # Default to 100 products
        images_per_product = kwargs['images']
        
        # Check if users exist in the database
        users = list(User.objects.all())
        if not users:
            self.stdout.write(self.style.ERROR('No users found in the database. Please create users first.'))
            return
            
        self.stdout.write(self.style.SUCCESS(f'Found {len(users)} users'))
        
        # Get all available product type folders
        base_dir = "media/product_images"
        product_type_folders = [d.name for d in os.scandir(base_dir) if d.is_dir()]
        
        # Map product types to their categories
        product_type_to_category = {
            "camera": "photography_videography",
            "lens": "photography_videography",
            "gimbal": "photography_videography",
            "accessories": "photography_videography",
            "bicycle": "sports_fitness",
            "fitness_equipment": "sports_fitness",
            "laptop": "electronics",
            "smartphone": "electronics",
            "tablet": "electronics",
            "headphones": "electronics",
            "guitar": "musical_instruments",
            "piano": "musical_instruments",
            "drums": "musical_instruments",
            "keyboard": "musical_instruments",
            "tent": "party_events",
            "sound_system": "party_events",
            "lighting": "party_events",
            "decor": "party_events",
            "watch": "fashion_accessories",
            "jewelry": "fashion_accessories",
            "handbag": "fashion_accessories",
            "sunglasses": "fashion_accessories",
            "furniture": "home_garden",
            "decor": "home_garden",
            "garden_tools": "home_garden",
            "appliances": "home_garden",
            "books": "books_media",
            "musical_instruments": "books_media",
            "games": "books_media",
            "board_games": "toys_games",
            "video_games": "toys_games",
            "car": "automotive",
            "motorbike": "automotive",
            "boat": "automotive",
            "miscellaneous": "other",
            "collection": "other",
            "antique": "other",
        }
        
        # Filter product types to only include those with available folders
        available_product_types = [pt for pt in product_type_folders if pt in product_type_to_category]
        
        # Calculate number of products per product type
        products_per_type = total_products // len(available_product_types)
        remaining_products = total_products % len(available_product_types)

        # Track total products created
        total_created = 0

        # Create products for each available product type
        for product_type in available_product_types:
            # Calculate number of products for this product type
            products_to_create = products_per_type
            if remaining_products > 0:
                products_to_create += 1
                remaining_products -= 1

            category = product_type_to_category[product_type]
            self.stdout.write(self.style.SUCCESS(f'Creating {products_to_create} products of type {product_type} in category {category}'))
            
            for _ in range(products_to_create):
                # Create the product with unique title and description
                title = self.generate_title(product_type)
                description = self.generate_description(product_type, title)
                
                # Create the product
                product = Product.objects.create(
                    title=title,
                    description=description,
                    category=category,
                    product_type=product_type,
                    owner=random.choice(users),
                    original_price=self.generate_original_price(product_type)
                )
                
                # Add multiple pricing tiers
                self.create_pricing_tiers(product, product_type)
                
                # Add random unavailable dates
                self.create_unavailable_dates(product)
                
                # Add images
                self.add_images(product, category, product_type, random.randint(3, 8))
                
                self.stdout.write(f'Created product {product.title}')
                total_created += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully created {total_created} products across all available product types'))

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
        """Create multiple pricing tiers with realistic prices and durations"""
        # Base price factors by product type
        price_factors = {
            'camera': 50000,  # 50,000 BDT
            'lens': 30000,   # 30,000 BDT
            'gimbal': 20000, # 20,000 BDT
            'accessories': 5000, # 5,000 BDT
            'bicycle': 10000, # 10,000 BDT
            'fitness_equipment': 15000, # 15,000 BDT
            'laptop': 40000, # 40,000 BDT
            'smartphone': 25000, # 25,000 BDT
            'tablet': 15000, # 15,000 BDT
            'headphones': 10000, # 10,000 BDT
            'guitar': 20000, # 20,000 BDT
            'piano': 50000, # 50,000 BDT
            'drums': 30000, # 30,000 BDT
            'keyboard': 25000, # 25,000 BDT
            'tent': 15000, # 15,000 BDT
            'sound_system': 30000, # 30,000 BDT
            'lighting': 20000, # 20,000 BDT
            'decor': 10000, # 10,000 BDT
            'watch': 15000, # 15,000 BDT
            'jewelry': 25000, # 25,000 BDT
            'handbag': 10000, # 10,000 BDT
            'sunglasses': 5000, # 5,000 BDT
            'furniture': 20000, # 20,000 BDT
            'garden_tools': 10000, # 10,000 BDT
            'appliances': 25000, # 25,000 BDT
            'books': 5000, # 5,000 BDT
            'games': 10000, # 10,000 BDT
            'board_games': 5000, # 5,000 BDT
            'video_games': 10000, # 10,000 BDT
            'car': 100000, # 100,000 BDT
            'motorbike': 50000, # 50,000 BDT
            'boat': 150000, # 150,000 BDT
            'miscellaneous': 10000, # 10,000 BDT
            'collection': 20000, # 20,000 BDT
            'antique': 30000, # 30,000 BDT
        }

        base_price = price_factors.get(product_type, 10000)  # Default to 10,000 BDT
        
        # Create multiple pricing tiers
        tiers = [
            {  # Daily tier
                'duration_unit': 'day',
                'price': round(base_price * 0.05),  # 5% of base price
                'max_period': 30  # Maximum 30 days
            },
            {  # Weekend tier
                'duration_unit': 'day',
                'price': round(base_price * 0.12),  # 12% of base price
                'max_period': 3  # Maximum 3 days
            },
            {  # Weekly tier
                'duration_unit': 'week',
                'price': round(base_price * 0.25),  # 25% of base price
                'max_period': 4  # Maximum 4 weeks
            },
            {  # Monthly tier
                'duration_unit': 'month',
                'price': round(base_price * 0.6),  # 60% of base price
                'max_period': 6  # Maximum 6 months
            }
        ]

        # Create pricing tiers only if they don't exist
        for tier in tiers:
            existing_tier = PricingTier.objects.filter(
                product=product,
                duration_unit=tier['duration_unit']
            ).first()
            
            if not existing_tier:
                PricingTier.objects.create(
                    product=product,
                    duration_unit=tier['duration_unit'],
                    price=tier['price'],
                    max_period=tier['max_period']
                )

    def create_unavailable_dates(self, product):
        """Create random unavailable dates for the product"""
        # Get the current date
        today = timezone.now().date()
        
        # Create between 5-10 unavailability periods
        periods = random.randint(5, 10)
        
        for _ in range(periods):
            # Random start date between 1-6 months from now
            start_days = random.randint(30, 180)
            start_date = today + timedelta(days=start_days)
            
            # Random duration based on product type
            product_type = product.product_type
            
            # Duration ranges by product type
            duration_ranges = {
                'camera': (1, 7),    # 1-7 days
                'lens': (1, 7),      # 1-7 days
                'gimbal': (2, 14),   # 2-14 days
                'accessories': (1, 3), # 1-3 days
                'bicycle': (1, 14),  # 1-14 days
                'fitness_equipment': (3, 30), # 3-30 days
                'laptop': (2, 14),   # 2-14 days
                'smartphone': (1, 7), # 1-7 days
                'tablet': (1, 7),    # 1-7 days
                'headphones': (1, 3), # 1-3 days
                'guitar': (3, 14),   # 3-14 days
                'piano': (7, 30),    # 7-30 days
                'drums': (3, 14),    # 3-14 days
                'keyboard': (3, 14), # 3-14 days
                'tent': (3, 7),      # 3-7 days
                'sound_system': (3, 14), # 3-14 days
                'lighting': (2, 7),  # 2-7 days
                'decor': (1, 7),     # 1-7 days
                'watch': (1, 3),     # 1-3 days
                'jewelry': (1, 3),   # 1-3 days
                'handbag': (1, 3),   # 1-3 days
                'sunglasses': (1, 3), # 1-3 days
                'furniture': (7, 30), # 7-30 days
                'garden_tools': (3, 14), # 3-14 days
                'appliances': (7, 30), # 7-30 days
                'books': (1, 7),     # 1-7 days
                'games': (1, 7),     # 1-7 days
                'board_games': (1, 3), # 1-3 days
                'video_games': (1, 3), # 1-3 days
                'car': (7, 30),      # 7-30 days
                'motorbike': (3, 14), # 3-14 days
                'boat': (7, 30),     # 7-30 days
                'miscellaneous': (1, 7), # 1-7 days
                'collection': (3, 14), # 3-14 days
                'antique': (7, 30),  # 7-30 days
            }
            
            min_days, max_days = duration_ranges.get(product_type, (1, 7))
            duration = random.randint(min_days, max_days)
            end_date = start_date + timedelta(days=duration)
            
            # Create the unavailability period
            try:
                with transaction.atomic():
                    UnavailableDate.objects.create(
                        product=product,
                        is_range=True,
                        range_start=start_date,
                        range_end=end_date
                    )
            except IntegrityError:
                # Skip if this period overlaps with existing periods
                continue

    def add_images(self, product, category, product_type, image_count):
        """Add images to a product from local directories organized by product type"""
        # Base directory for product images
        base_dir = "media/product_images"
        product_type_dir = os.path.join(base_dir, product_type)
        
        # Check if the directory exists
        if not os.path.exists(product_type_dir):
            self.stdout.write(self.style.WARNING(f"Directory {product_type_dir} does not exist, using fallback images"))
            return self.add_fallback_images(product, category, product_type, image_count)
        
        # Get list of image files in the directory
        image_files = [f for f in os.listdir(product_type_dir) 
                      if os.path.isfile(os.path.join(product_type_dir, f)) 
                      and f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))]
        
        if not image_files:
            self.stdout.write(self.style.WARNING(f"No images found in {product_type_dir}, using fallback images"))
            return self.add_fallback_images(product, category, product_type, image_count)
        
        # Determine how many images to add (between 3 and 8, or maximum available)
        actual_image_count = min(random.randint(3, 8), len(image_files))
        
        # Randomly select images
        selected_images = random.sample(image_files, actual_image_count)
        
        # Add each selected image to the product
        for i, image_filename in enumerate(selected_images):
            try:
                # Create a unique filename for the saved image
                new_filename = f"{category}_{product.id}_{i}_{int(timezone.now().timestamp())}{os.path.splitext(image_filename)[1]}"
                
                # Create a ProductImage instance
                product_image = ProductImage(product=product)
                
                # Open the image file and save it to the ProductImage
                image_path = os.path.join(product_type_dir, image_filename)
                with open(image_path, 'rb') as img_file:
                    product_image.image.save(
                        new_filename,
                        ContentFile(img_file.read()),
                        save=True
                    )
                self.stdout.write(f"Added image {i+1} from {image_filename} to product {product.title}")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error adding image {image_filename}: {str(e)}"))
                # Try next image

    def add_fallback_images(self, product, category, product_type, image_count):
        """Original image adding method as fallback"""
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

    def setup_product_images_directory(self):
        """Create a directory structure for product images based on product types"""
        base_dir = "media/product_images"
        
        # Create base directory if it doesn't exist
        if not os.path.exists(base_dir):
            os.makedirs(base_dir)
            self.stdout.write(self.style.SUCCESS(f'Created base directory: {base_dir}'))
        
        # Extract all product types from PRODUCT_TYPE_CHOICES
        all_product_types = set()
        for product_type, _ in PRODUCT_TYPE_CHOICES:
            all_product_types.add(product_type)
        
        # Create a directory for each product type
        for product_type in all_product_types:
            product_type_dir = os.path.join(base_dir, product_type)
            if not os.path.exists(product_type_dir):
                os.makedirs(product_type_dir)
                self.stdout.write(self.style.SUCCESS(f'Created directory: {product_type_dir}'))
        
        # Create a README file with instructions
        readme_path = os.path.join(base_dir, "README.txt")
        with open(readme_path, "w") as f:
            f.write("""# Product Images Directory

This directory contains subdirectories for each product type in the system.
Place your product images in the appropriate product type directory.

## Directory Structure

Each product type has its own directory. For example:
- product_images/camera/
- product_images/laptop/
- product_images/bicycle/
- etc.

## How to Use

1. Place your product images in the appropriate product type directory.
2. Images should be in .jpg, .jpeg, .png, or .gif format.
3. When you run the populate_products command, images will be randomly selected from these directories.

## Available Product Types
""")
            # List all product types in the README
            for product_type in sorted(all_product_types):
                f.write(f"- {product_type}\n")
                
        self.stdout.write(self.style.SUCCESS(f'Created README file: {readme_path}'))
        self.stdout.write(self.style.SUCCESS(f'Directory structure setup complete. Please add your images to the appropriate directories.'))
        self.stdout.write(self.style.SUCCESS(f'Then run the command again without --setup-dirs to generate products.')) 