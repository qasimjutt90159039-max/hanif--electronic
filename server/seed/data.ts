export interface SeedProduct {
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  oldPrice: number;
  discountPercentage: number;
  stock: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  images: string[];
  thumbnail: string;
  specifications: Record<string, string>;
  features: string[];
  warranty: string;
  tags: string[];
  isFeatured: boolean;
  isDeal: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  weight: string;
  dimensions: string;
  color: string;
  capacity: string;
  model: string;
  installationAvailable: boolean;
  deliveryAvailable: boolean;
}

export const SEED_CATEGORIES = [
  {
    name: "DC Inverter AC",
    slug: "dc-inverter-ac",
    description: "Energy-saving T3 DC Inverter Air Conditioners for extreme Pakistani summers.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    icon: "Wind",
    sortOrder: 1,
    status: "active"
  },
  {
    name: "LED & QLED TVs",
    slug: "led-qled-tvs",
    description: "Ultra HD 4K, Smart Google TVs and vibrant QLED displays.",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
    icon: "Tv",
    sortOrder: 2,
    status: "active"
  },
  {
    name: "Refrigerators",
    slug: "refrigerators",
    description: "Direct cool and No-Frost Inverter refrigerators with long-lasting freshness.",
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80",
    icon: "Refrigerator",
    sortOrder: 3,
    status: "active"
  },
  {
    name: "Washing Machines",
    slug: "washing-machines",
    description: "Top load, front load, and twin tub energy-efficient washing machines.",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80",
    icon: "WashingMachine",
    sortOrder: 4,
    status: "active"
  },
  {
    name: "Geysers",
    slug: "geysers",
    description: "Gas, electric, and instant geysers for uninterrupted hot water in winter.",
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80",
    icon: "Flame",
    sortOrder: 5,
    status: "active"
  },
  {
    name: "Kitchen Appliances",
    slug: "kitchen-appliances",
    description: "Cooking ranges, kitchen hoods, glass hobs, air fryers and microwaves.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    icon: "Utensils",
    sortOrder: 6,
    status: "active"
  },
  {
    name: "Water Dispensers",
    slug: "water-dispensers",
    description: "Hot, cold, and room temperature 3-tap water dispensers with mini fridge cabinets.",
    image: "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80",
    icon: "Droplets",
    sortOrder: 7,
    status: "active"
  },
  {
    name: "Air Coolers",
    slug: "air-coolers",
    description: "Heavy-duty desert coolers with pure honeycomb pads for dry heat.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    icon: "Fan",
    sortOrder: 8,
    status: "active"
  },
  {
    name: "Air Purifiers",
    slug: "air-purifiers",
    description: "HEPA filter air purifiers designed to combat Lahore smog and fine dust.",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
    icon: "ShieldAlert",
    sortOrder: 9,
    status: "active"
  },
  {
    name: "Microwaves",
    slug: "microwaves",
    description: "Solo, grill, and convection microwave ovens for quick baking and heating.",
    image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80",
    icon: "Microwave",
    sortOrder: 10,
    status: "active"
  },
  {
    name: "Mobiles",
    slug: "mobiles",
    description: "PTA-approved official smartphones from top brands with brand warranty.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    icon: "Smartphone",
    sortOrder: 11,
    status: "active"
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "Business, student and gaming laptops from Dell, HP and Lenovo.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    icon: "Laptop",
    sortOrder: 12,
    status: "active"
  },
  {
    name: "Smart Watches",
    slug: "smart-watches",
    description: "Fitness trackers, AMOLED displays, and calling smartwatches.",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
    icon: "Watch",
    sortOrder: 13,
    status: "active"
  },
  {
    name: "Fitness Machines",
    slug: "fitness-machines",
    description: "Commercial and home gym motorized treadmills, bikes and ellipticals.",
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80",
    icon: "Activity",
    sortOrder: 14,
    status: "active"
  },
  {
    name: "Bikes",
    slug: "bikes",
    description: "Electric bikes, scooters and commuter cycles.",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
    icon: "Bike",
    sortOrder: 15,
    status: "active"
  },
  {
    name: "UPS & Batteries",
    slug: "ups-batteries",
    description: "Solar inverters, tubular batteries, and pure sine wave UPS systems.",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    icon: "BatteryCharging",
    sortOrder: 16,
    status: "active"
  },
  {
    name: "Vacuum Cleaners",
    slug: "vacuum-cleaners",
    description: "Heavy-duty drum and compact cyclone vacuum cleaners.",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80",
    icon: "Sparkles",
    sortOrder: 17,
    status: "active"
  },
  {
    name: "Gaming Consoles",
    slug: "gaming-consoles",
    description: "Next-gen consoles, wireless controllers and gaming accessories.",
    image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=800&q=80",
    icon: "Gamepad2",
    sortOrder: 18,
    status: "active"
  }
];

export const SEED_BRANDS = [
  { name: "Haier", slug: "haier", logo: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=200&q=80", description: "Global leader in smart home appliances." },
  { name: "TCL", slug: "tcl", logo: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=200&q=80", description: "World class QLED Displays and T3 Inverter ACs." },
  { name: "Midea", slug: "midea", logo: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=80", description: "Smart climate and domestic cooling solutions." },
  { name: "Hyundai", slug: "hyundai", logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80", description: "South Korean engineering excellence in home electronics." },
  { name: "PEL", slug: "pel", logo: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=200&q=80", description: "Pak Elektron Limited - Pakistan's most trusted appliances." },
  { name: "Dawlance", slug: "dawlance", logo: "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=200&q=80", description: "Reliable appliances built for Pakistani households." },
  { name: "Kenwood", slug: "kenwood", logo: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=200&q=80", description: "Premium British-designed electronics & refrigerators." },
  { name: "Nasgas", slug: "nasgas", logo: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=200&q=80", description: "Pioneers in high-end geysers, hoods, and cooking ranges." },
  { name: "Xiaomi", slug: "xiaomi", logo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=200&q=80", description: "Innovative Smart TVs, Mobiles and Air Purifiers." },
  { name: "Samsung", slug: "samsung", logo: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=200&q=80", description: "Global pioneer in mobile tech and Crystal UHD TVs." },
  { name: "Gree", slug: "gree", logo: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=80", description: "The world's specialized air conditioning manufacturer." },
  { name: "Orient", slug: "orient", logo: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=200&q=80", description: "Innovative smart IoT enabled inverter appliances." },
  { name: "Hisense", slug: "hisense", logo: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=200&q=80", description: "Leading consumer electronics and Laser TV innovation." },
  { name: "American General", slug: "american-general", logo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80", description: "Heavy-duty commercial and residential air conditioners." },
  { name: "Canon", slug: "canon", logo: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=200&q=80", description: "Durable home appliances and gas geysers." },
  { name: "Super Asia", slug: "super-asia", logo: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=200&q=80", description: "Symbol of quality in washing machines and coolers." },
  { name: "Fischer", slug: "fischer", logo: "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=200&q=80", description: "Heavy duty stainless steel water coolers and geysers." },
  { name: "Philips", slug: "philips", logo: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=200&q=80", description: "Health and lifestyle consumer electronics." },
  { name: "Panasonic", slug: "panasonic", logo: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=200&q=80", description: "Japanese durability in home vacuum systems." },
  { name: "WestPoint", slug: "westpoint", logo: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=200&q=80", description: "French quality small domestic appliances." },
  { name: "Hitachi", slug: "hitachi", logo: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=200&q=80", description: "Industrial grade vacuum cleaners and home machinery." },
  { name: "Infinix", slug: "infinix", logo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=200&q=80", description: "Trendy smartphones and smart TVs for youth." },
  { name: "Oppo", slug: "oppo", logo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=200&q=80", description: "Camera phone innovation and SuperVOOC fast charging." },
  { name: "Vivo", slug: "vivo", logo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=200&q=80", description: "Stunning designs and mobile portrait photography." },
  { name: "Realme", slug: "realme", logo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=200&q=80", description: "Performance leapfrog mobiles and IoT gadgets." },
  { name: "Tecno", slug: "tecno", logo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=200&q=80", description: "Cutting-edge mobile tech at accessible prices." },
  { name: "Dell", slug: "dell", logo: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=200&q=80", description: "Enterprise grade laptops and workstations." },
  { name: "HP", slug: "hp", logo: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=200&q=80", description: "Sleek business laptops and performance computing." },
  { name: "Lenovo", slug: "lenovo", logo: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=200&q=80", description: "ThinkPad durability and IdeaPad smart productivity." }
];
