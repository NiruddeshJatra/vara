from django.utils.translation import gettext_lazy as _

CATEGORY_CHOICES = [
    ("Photography & Videography", _("Photography & Videography")),
    ("Sports & Fitness", _("Sports & Fitness")),
    ("Tools & Equipment", _("Tools & Equipment")),
    ("Electronics", _("Electronics")),
    ("Musical Instruments", _("Musical Instruments")),
    ("Party & Events", _("Party & Events")),
    ("Fashion & Accessories", _("Fashion & Accessories")),
    ("Home & Garden", _("Home & Garden")),
    ("Books & Media", _("Books & Media")),
    ("Toys & Games", _("Toys & Games")),
    ("Automotive", _("Automotive")),
    ("Other", _("Other")),
]

PRODUCT_TYPE_CHOICES = [
    # Photography & Videography
    ("camera", "Photography & Videography"),
    ("lens", "Photography & Videography"),
    ("gimbal", "Photography & Videography"),
    ("drone", "Photography & Videography"),
    ("lighting", "Photography & Videography"),
    ("tripod", "Photography & Videography"),
    ("microphone", "Photography & Videography"),
    ("video_camera", "Photography & Videography"),
    # Sports & Fitness
    ("bicycle", "Sports & Fitness"),
    ("treadmill", "Sports & Fitness"),
    ("yoga_mat", "Sports & Fitness"),
    ("dumbbells", "Sports & Fitness"),
    ("sports_equipment", "Sports & Fitness"),
    # Tools & Equipment
    ("power_tools", "Tools & Equipment"),
    ("hand_tools", "Tools & Equipment"),
    ("gardening_tools", "Tools & Equipment"),
    ("cleaning_equipment", "Tools & Equipment"),
    # Electronics
    ("laptop", "Electronics"),
    ("tablet", "Electronics"),
    ("smartphone", "Electronics"),
    ("gaming_console", "Electronics"),
    ("tv", "Electronics"),
    ("speaker", "Electronics"),
    # Musical Instruments
    ("guitar", "Musical Instruments"),
    ("piano", "Musical Instruments"),
    ("drums", "Musical Instruments"),
    ("microphone", "Musical Instruments"),
    ("amplifier", "Musical Instruments"),
    # Party & Events
    ("tent", "Party & Events"),
    ("table", "Party & Events"),
    ("chair", "Party & Events"),
    ("decorations", "Party & Events"),
    ("sound_system", "Party & Events"),
    # Fashion & Accessories
    ("formal_wear", "Fashion & Accessories"),
    ("costume", "Fashion & Accessories"),
    ("jewelry", "Fashion & Accessories"),
    ("accessories", "Fashion & Accessories"),
    # Home & Garden
    ("furniture", "Home & Garden"),
    ("kitchen_appliance", "Home & Garden"),
    ("garden_tools", "Home & Garden"),
    ("decor", "Home & Garden"),
    # Books & Media
    ("book", "Books & Media"),
    ("magazine", "Books & Media"),
    ("movie", "Books & Media"),
    ("game", "Books & Media"),
    # Toys & Games
    ("board_game", "Toys & Games"),
    ("video_game", "Toys & Games"),
    ("toy", "Toys & Games"),
    ("puzzle", "Toys & Games"),
    # Automotive
    ("car", "Automotive"),
    ("bike", "Automotive"),
    ("scooter", "Automotive"),
    ("accessories", "Automotive"),
    # Other
    ("other", "Other"),
]

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

CATEGORY_GROUPS = {
    "Photography & Videography": [
        "camera",
        "gimbal",
        "lighting",
        "video_acc",
        "microphone",
        "studio_equip",
    ],
    "Sports & Fitness": [
        "bicycle",
        "safety_gear",
        "cricket",
        "football",
        "basketball",
        "tennis",
        "gym_equip",
    ],
    "Outdoor & Camping": [
        "tent",
        "sleeping_bag",
        "camp_furniture",
        "hiking_gear",
        "camp_stove",
        "cooler",
        "bag",
    ],
    "Audio & Entertainment": [
        "speaker",
        "dj_equip",
        "musical_inst",
        "karaoke",
        "party_lights",
        "projector",
    ],
    "Electronics & Gadgets": ["drone", "power_bank", "laptop"],
    "Event & Party": ["party_furniture", "decorations", "grill", "stage"],
    "Tools & Equipment": [
        "power_tool",
        "hand_tool",
        "garden_tool",
        "ladder",
        "paint_sprayer",
    ],
}
