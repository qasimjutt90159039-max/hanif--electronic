import { PRODUCTS_PART_1 } from './products_part1';
import { PRODUCTS_PART_2 } from './products_part2';
import { PRODUCTS_PART_3 } from './products_part3';
import { SEED_CATEGORIES, SEED_BRANDS, SeedProduct } from './data';

export const ALL_SEED_PRODUCTS: SeedProduct[] = [
  ...PRODUCTS_PART_1,
  ...PRODUCTS_PART_2,
  ...PRODUCTS_PART_3
];

export const SEED_COUPONS = [
  {
    code: "WELCOME5",
    discountType: "percentage",
    amount: 5,
    minOrder: 25000,
    maxDiscount: 5000,
    expiryDate: new Date("2028-12-31"),
    usageLimit: 500,
    usedCount: 14,
    isActive: true
  },
  {
    code: "HANIF1000",
    discountType: "fixed",
    amount: 1000,
    minOrder: 40000,
    maxDiscount: 1000,
    expiryDate: new Date("2028-12-31"),
    usageLimit: 300,
    usedCount: 8,
    isActive: true
  },
  {
    code: "SUMMERDEAL",
    discountType: "percentage",
    amount: 7,
    minOrder: 80000,
    maxDiscount: 10000,
    expiryDate: new Date("2028-12-31"),
    usageLimit: 200,
    usedCount: 22,
    isActive: true
  }
];

export const DEFAULT_SITE_SETTINGS = {
  businessName: "Hanif Centre Electronics Online Store",
  logo: "/logo.png",
  phone1: "0305-7245533",
  phone2: "0300-9409477",
  phone3: "0326-7245533",
  email: "haneefcentre@gmail.com",
  address: "Yasin Mansion, Patiala Ground, 2 Link McLeod Road, near Hall Road, Lahore 54000, Pakistan",
  branch2: "Near Sui Gas Interchange/Ring Road near Phase 4 DHA Lahore",
  whatsapp: "923057245533",
  openingHours: "Mon–Sat: 11:00 AM – 8:30 PM | Sunday: Closed",
  deliveryPolicy: "Delivery options available according to product weight and location across Lahore (same-day/next-day) and nationwide via safe logistics.",
  returnPolicy: "7-day replacement warranty for manufacturing defects with original unboxing packaging and invoice.",
  warrantyPolicy: "100% Genuine products backed by official brand warranty claimable at authorized customer centers nationwide.",
  facebookUrl: "",
  announcementBar: "🔥 Summer Inverter AC & Deep Refrigerator Offers | Call 0305-7245533 for Price Confirmation & Fast Delivery",
  heroTitle: "Smart Electronics. Better Living.",
  heroSubtitle: "Discover quality electronics and home appliances from trusted brands at Hanif Centre — Lahore's verified electronics landmark."
};
