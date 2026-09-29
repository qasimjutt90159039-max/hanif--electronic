# Hanif Centre Electronics Online Store

Production-ready eCommerce platform built for **Hanif Centre Electronics & Home Appliances**, Lahore, Pakistan.

---

## 1. Project Overview

Hanif Centre Electronics is a full-featured, responsive, production-ready eCommerce solution providing real-time catalog browsing, stock & price confirmation workflows, shopping cart, wishlist, product comparison, customer accounts, and an administrator management panel.

- **Primary Showroom:** Yasin Mansion, Patiala Ground, 2 Link McLeod Road, near Hall Road, Lahore 54000, Pakistan
- **Branch 2:** Near Sui Gas Interchange / Ring Road near Phase 4 DHA Lahore
- **Phone Lines:** 0305-7245533, 0300-9409477, 0326-7245533
- **Official Email:** haneefcentre@gmail.com

---

## 2. Key Features

- **95+ Seeded Realistic Products:** Air conditioners (T3 Inverters), 4K QLED & LED TVs, Inverter Refrigerators, Washing Machines, Geysers, Kitchen Hoods & Hobs, Water Dispensers, Air Coolers, Smog Purifiers, Vacuums, Mobiles, and Laptops.
- **Price & Availability Confirmation:** Dedicated UI banners and one-click WhatsApp/Call buttons with pre-composed SKU & pricing details.
- **Full Backend API:** Express REST API with MongoDB Atlas integration and auto-fallback persistent JSON storage engine for zero-configuration development.
- **Admin Dashboard:** Real-time analytics, inventory management, price/discount updates, stock alerts, order status tracker (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled), customer review moderation, coupon codes, contact messages, and installment applications.
- **Order Tracking:** Live 5-stage progress timeline via Order Number (e.g. `HC-2026-000001`) and registered phone number.
- **Product Comparison:** Compare up to 4 appliances side-by-side across dimensions, capacity, voltage, warranty, and features.
- **Discount Coupons:** Server-side coupon verification with minimum spend and percentage/fixed discounts.

---

## 3. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, React Router DOM v7
- **Backend:** Node.js, Express.js, Mongoose & MongoDB, JWT (jsonwebtoken), bcryptjs, CORS
- **State Management:** React Context API (Cart, Wishlist, Compare, Auth, Settings, Toast)

---

## 4. Environment Variables

Create `.env` based on `.env.example`:

```env
PORT=3000
VITE_API_URL="/api"
VITE_WHATSAPP_NUMBER="923057245533"
VITE_BUSINESS_PHONE="0305-7245533"

# MongoDB Atlas URI (Optional in dev; if omitted, persistent file-backed DB is used)
MONGO_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/hanif_centre?retryWrites=true&w=majority"

JWT_SECRET="hanif_centre_secure_jwt_secret_key_2026"
ADMIN_EMAIL="admin@hanifcentre.com"
ADMIN_PASSWORD="AdminPassword2026!"
CLIENT_URL="http://localhost:3000"
```

---

## 5. Development & Running

### Install Dependencies
```bash
npm install
```

### Run Database Seed
```bash
npm run seed
```

### Start Full-Stack Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Admin Credentials (Default Seed)

- **Portal URL:** `/admin/login`
- **Email:** `admin@hanifcentre.com`
- **Password:** `AdminPassword2026!`

---

## 7. Production Deployment

### Build Frontend
```bash
npm run build
```

### Start Production Server
```bash
npm start
```
The server serves compiled static files from `/dist` and all `/api/*` endpoints.

### Deploying to Cloud (Render / Railway / VPS)
1. Push codebase to Git repository.
2. In host dashboard, set Build Command: `npm install && npm run build`.
3. Set Start Command: `npm start` (or `tsx server.ts`).
4. Set Environment Variables: `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
