from django.utils.translation import gettext_lazy as _

# Database values (snake_case) and their display names
CATEGORY_CHOICES = [
    ("photography_videography", _("Photography & Videography")),
    ("sports_fitness", _("Sports & Fitness")),
    ("tools_equipment", _("Tools & Equipment")),
    ("electronics", _("Electronics")),
    ("musical_instruments", _("Musical Instruments")),
    ("party_events", _("Party & Events")),
    ("fashion_accessories", _("Fashion & Accessories")),
    ("home_garden", _("Home & Garden")),
    ("books_media", _("Books & Media")),
    ("toys_games", _("Toys & Games")),
    ("automotive", _("Automotive")),
    ("other", _("Other")),
]

# Product types mapped to their categories (using database values)
PRODUCT_TYPE_CHOICES = [
    # Photography & Videography
    ("camera", "photography_videography"),
    ("lens", "photography_videography"),
    ("gimbal", "photography_videography"),
    ("drone", "photography_videography"),
    ("lighting", "photography_videography"),
    ("tripod", "photography_videography"),
    ("microphone", "photography_videography"),
    ("video_camera", "photography_videography"),
    # Sports & Fitness
    ("bicycle", "sports_fitness"),
    ("treadmill", "sports_fitness"),
    ("yoga_mat", "sports_fitness"),
    ("dumbbells", "sports_fitness"),
    ("sports_equipment", "sports_fitness"),
    # Tools & Equipment
    ("power_tools", "tools_equipment"),
    ("hand_tools", "tools_equipment"),
    ("gardening_tools", "tools_equipment"),
    ("cleaning_equipment", "tools_equipment"),
    # Electronics
    ("laptop", "electronics"),
    ("tablet", "electronics"),
    ("smartphone", "electronics"),
    ("gaming_console", "electronics"),
    ("tv", "electronics"),
    ("speaker", "electronics"),
    # Musical Instruments
    ("guitar", "musical_instruments"),
    ("piano", "musical_instruments"),
    ("drums", "musical_instruments"),
    ("microphone", "musical_instruments"),
    ("amplifier", "musical_instruments"),
    # Party & Events
    ("tent", "party_events"),
    ("table", "party_events"),
    ("chair", "party_events"),
    ("decorations", "party_events"),
    ("sound_system", "party_events"),
    # Fashion & Accessories
    ("formal_wear", "fashion_accessories"),
    ("costume", "fashion_accessories"),
    ("jewelry", "fashion_accessories"),
    ("accessories", "fashion_accessories"),
    # Home & Garden
    ("furniture", "home_garden"),
    ("kitchen_appliance", "home_garden"),
    ("garden_tools", "home_garden"),
    ("decor", "home_garden"),
    # Books & Media
    ("book", "books_media"),
    ("magazine", "books_media"),
    ("movie", "books_media"),
    ("game", "books_media"),
    # Toys & Games
    ("board_game", "toys_games"),
    ("video_game", "toys_games"),
    ("toy", "toys_games"),
    ("puzzle", "toys_games"),
    # Automotive
    ("car", "automotive"),
    ("bike", "automotive"),
    ("scooter", "automotive"),
    ("accessories", "automotive"),
    # Other
    ("other", "other"),
]

# Display names for product types (for UI)
PRODUCT_TYPE_DISPLAY = {
    "camera": _("Camera"),
    "lens": _("Lens"),
    "gimbal": _("Gimbal"),
    "drone": _("Drone"),
    "lighting": _("Lighting"),
    "tripod": _("Tripod"),
    "microphone": _("Microphone"),
    "video_camera": _("Video Camera"),
    "bicycle": _("Bicycle"),
    "treadmill": _("Treadmill"),
    "yoga_mat": _("Yoga Mat"),
    "dumbbells": _("Dumbbells"),
    "sports_equipment": _("Sports Equipment"),
    "power_tools": _("Power Tools"),
    "hand_tools": _("Hand Tools"),
    "gardening_tools": _("Gardening Tools"),
    "cleaning_equipment": _("Cleaning Equipment"),
    "laptop": _("Laptop"),
    "tablet": _("Tablet"),
    "smartphone": _("Smartphone"),
    "gaming_console": _("Gaming Console"),
    "tv": _("TV"),
    "speaker": _("Speaker"),
    "guitar": _("Guitar"),
    "piano": _("Piano"),
    "drums": _("Drums"),
    "amplifier": _("Amplifier"),
    "tent": _("Tent"),
    "table": _("Table"),
    "chair": _("Chair"),
    "decorations": _("Decorations"),
    "sound_system": _("Sound System"),
    "formal_wear": _("Formal Wear"),
    "costume": _("Costume"),
    "jewelry": _("Jewelry"),
    "accessories": _("Accessories"),
    "furniture": _("Furniture"),
    "kitchen_appliance": _("Kitchen Appliance"),
    "garden_tools": _("Garden Tools"),
    "decor": _("Decor"),
    "book": _("Book"),
    "magazine": _("Magazine"),
    "movie": _("Movie"),
    "game": _("Game"),
    "board_game": _("Board Game"),
    "video_game": _("Video Game"),
    "toy": _("Toy"),
    "puzzle": _("Puzzle"),
    "car": _("Car"),
    "bike": _("Bike"),
    "scooter": _("Scooter"),
    "other": _("Other"),
}

DURATION_UNITS = [
    ("day", _("Per Day")),
    ("week", _("Per Week")),
    ("month", _("Per Month")),
]

OWNERSHIP_HISTORY_CHOICES = [
    ("firsthand", _("First Hand")),
    ("secondhand", _("Second Hand")),
]

STATUS_CHOICES = [
    ("draft", _("Draft - Pending Review")),
    ("active", _("Active - Available for Rent")),
    ("maintenance", _("Under Maintenance - Needs Action")),
    ("suspended", _("Suspended - Listing Disabled")),
]

