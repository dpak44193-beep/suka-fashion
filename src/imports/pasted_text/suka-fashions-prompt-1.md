# 🌿 Suka Fashions — Full-Stack React E-Commerce Prompt

---

## 🎯 PROJECT OVERVIEW

Build a **production-ready, full-stack React e-commerce web application** named **"Suka Fashions"** — a women's fashion brand. The app has **two user roles**: `Admin (Owner)` and `Customer`. The theme is a **light, elegant, futuristic** design using **Pistachio Green (`#B5D5C5`) + Dim White (`#F5F5F0`)** as the brand palette. Architecture must be **secure, scalable, and modular**.

---

## 🎨 BRAND & DESIGN SYSTEM

### Colors (CSS Variables)
```css
--primary: #B5D5C5;          /* Pistachio Green */
--primary-dark: #8BB9A4;     /* Deep Pistachio */
--primary-light: #D6EBE0;    /* Soft Mint */
--bg: #F5F5F0;               /* Dim White */
--bg-card: #FAFAF7;          /* Card White */
--text-primary: #1A1A1A;     /* Near Black */
--text-secondary: #5A5A5A;   /* Muted Gray */
--accent: #C9A96E;           /* Warm Gold */
--danger: #E57373;           /* Soft Red */
--border: #E0E0D8;           /* Subtle Border */
--shadow: rgba(181,213,197,0.25); /* Green-tinted shadow */
```

### Typography
- **Display / Headings**: `Playfair Display` (Google Fonts) — elegant, feminine
- **Body / UI**: `DM Sans` (Google Fonts) — clean, modern
- **Accent / Price tags**: `Cormorant Garamond` — luxury feel

### Design Language
- Light theme, lots of white space, soft pistachio accents
- Rounded cards (`border-radius: 16px`), gentle shadows
- Micro-animations on hover (scale, shadow lift)
- Futuristic elements: glassmorphism cards, subtle gradient backgrounds
- Mobile-first responsive layout (320px → 1440px)
- No dark backgrounds on main pages (use pistachio for CTAs only)

---

## 🏗️ TECH STACK

### Frontend
```
React 18 (Vite)
React Router DOM v6         → client-side routing + protected routes
Redux Toolkit + RTK Query   → global state + API calls
React Hook Form + Zod       → form handling + validation
Framer Motion               → page transitions, animations
Tailwind CSS (or CSS Modules) → utility-first styling
React Hot Toast             → notifications
Lucide React                → icon library
```

### Backend (Node.js — specify separately or mock with JSON Server)
```
Node.js + Express.js
JWT (Access + Refresh tokens)
bcryptjs                    → password hashing
Prisma ORM + MySQL          → database
Multer + Cloudinary         → image uploads
express-validator           → input sanitization
Helmet + CORS + Rate Limiter → security middleware
```

### Security
```
JWT stored in httpOnly cookies (NOT localStorage)
Refresh token rotation
Role-based route guards (RBAC)
Input sanitization on all forms
HTTPS-only in production
CSP headers via Helmet
Rate limiting on auth endpoints
```

---

## 👤 USER ROLES & AUTH FLOW

### Role 1: Customer
- Register / Login / Forgot Password (OTP via email)
- Google OAuth (optional future scope)
- JWT stored in httpOnly cookie
- Can only access customer routes

### Role 2: Admin (Owner)
- Admin login (separate `/admin/login` page — not public-facing)
- Full dashboard access
- Cannot register via public form — seeded or created via CLI
- Protected behind role check middleware

### Auth Pages
```
/login                → Customer login
/register             → Customer registration
/forgot-password      → Email OTP reset
/admin/login          → Admin-only login (hidden from nav)
```

---

## 📱 CUSTOMER-FACING PAGES & FEATURES

### 🏠 Home Page (`/`)
- Hero banner with animated headline + CTA ("Shop the Collection")
- Marquee ticker: "Free shipping above ₹999 · New Arrivals Weekly · 100% Authentic"
- Featured Categories grid (Kurtas, Sarees, Western, Accessories)
- New Arrivals horizontal scroll section
- "Why Suka?" trust badges (Easy Returns, Secure Payment, Handpicked Styles)
- Trending Products section (most purchased)
- Testimonials / Reviews carousel
- Newsletter subscription bar

### 🛍️ Shop / Product Listing (`/shop`)
- Filter sidebar: Category, Price Range (slider), Size, Color, Rating, Brand
- Sort: Price Low→High, Newest, Best Rated, Most Popular
- Grid / List view toggle
- Infinite scroll or pagination
- "Quick View" modal on product card hover
- Wishlist heart toggle on each card
- Product cards: image, name, price (MRP + offer %), rating stars, "Add to Cart" button

### 🔍 Search (`/search?q=`)
- Real-time search suggestions dropdown (debounced, 300ms)
- Category-filtered results
- "Did you mean?" suggestions
- Empty state with recommendations

### 👗 Product Detail Page (`/product/:id`)
- Image gallery with zoom on hover + thumbnail strip
- Size selector with size guide modal
- Color / variant picker
- Quantity selector
- "Add to Cart" + "Buy Now" buttons
- Stock indicator ("Only 3 left!")
- Product description tabs: Details | Size Guide | Reviews | Shipping
- Rating & review section with star breakdown chart
- "Write a Review" form (authenticated customers only)
- Related Products carousel
- Recently Viewed section

### 🛒 Cart (`/cart`)
- Item list with quantity +/- controls
- Remove item with undo toast
- Apply coupon code field
- Price breakdown: Subtotal, Discount, Delivery, Total
- "Save for Later" (moves to wishlist)
- Persistent cart (localStorage + DB sync on login)
- Empty cart state with CTA

### ❤️ Wishlist (`/wishlist`)
- Grid of saved products
- Move to Cart button
- Remove from wishlist
- Share wishlist link (futuristic feature)

### 💳 Checkout (`/checkout`)
- Multi-step stepper: Address → Payment → Review → Confirmation
- Saved addresses (add/edit/delete)
- Delivery slot selection (Standard / Express / Same Day)
- Payment options: UPI, Card, Net Banking, COD, Wallet
- Razorpay / Stripe integration stub
- Order summary sidebar
- Promo code validation

### 📦 Orders (`/orders`)
- Order history list with status chips (Processing / Shipped / Delivered / Cancelled)
- Order detail view with tracking timeline
- Cancel order (if not shipped)
- Return / Exchange request form
- Download invoice PDF button

### 👤 My Account (`/account`)
- Profile info edit (name, phone, profile photo)
- Address book management
- Change password
- Notification preferences
- Loyalty points / reward coins display (futuristic)
- Referral code & earn credits section
- Delete account option

### 🔔 Notifications (`/notifications`)
- Order status updates
- Price drop alerts on wishlisted items
- Flash sale announcements
- Read / Unread toggle

### 📍 Track Order (`/track/:orderId`) — public page
- Enter Order ID + email to track without login
- Step-by-step courier timeline

---

## 🔧 ADMIN DASHBOARD PAGES & FEATURES

### Admin Layout
- Collapsible sidebar navigation
- Top bar: search, notifications bell, admin profile
- Breadcrumb navigation
- Dark pistachio sidebar, white content area

### 📊 Dashboard Overview (`/admin`)
- KPI Cards: Total Revenue, Orders Today, New Customers, Pending Shipments
- Revenue chart (Line — daily/weekly/monthly toggle)
- Top Selling Products bar chart
- Recent Orders table (last 10)
- Low Stock Alerts widget
- Customer acquisition source pie chart

### 📦 Product Management (`/admin/products`)
- Product list table with search, filter, sort
- Add Product form:
  - Name, SKU, description (rich text editor)
  - Category / subcategory
  - Multiple images upload (drag & drop, reorder)
  - Variants: Size × Color matrix with individual stock & price
  - MRP, Selling Price, Cost Price
  - Tags, SEO meta title & description
- Edit / Delete / Duplicate product
- Bulk actions: activate, deactivate, delete
- CSV import / export

### 🗂️ Category Management (`/admin/categories`)
- Tree-view category hierarchy
- Add / Edit / Delete category
- Upload category banner image
- Set display order (drag & drop)

### 🧾 Order Management (`/admin/orders`)
- Orders table with advanced filters (date range, status, payment method)
- Order detail view: customer info, items, payment, shipping
- Update order status (Processing → Shipped → Delivered)
- Add tracking number + courier name
- Print invoice / packing slip
- Initiate refund

### 👥 Customer Management (`/admin/customers`)
- Customer list: name, email, phone, total orders, join date
- Customer detail: order history, wishlist, address book, reviews
- Block / unblock customer account
- Export customer data (CSV)

### 🏷️ Coupon & Offer Management (`/admin/offers`)
- Create coupons: % off, flat off, free shipping, BOGO
- Set min order value, usage limit, expiry date
- Flash sale scheduler (start time, end time, discount %)
- Category-level discounts

### ⭐ Review Management (`/admin/reviews`)
- List all reviews with approval toggle (hide/show)
- Reply to customer review
- Flag / delete abusive reviews

### 📣 Marketing & Banners (`/admin/marketing`)
- Upload / manage home page hero banners (title, subtitle, link, image)
- Set banner display order & schedule
- Manage email newsletter (compose & send via integrated SMTP)

### 📈 Analytics (`/admin/analytics`)
- Revenue by category
- Customer retention (repeat vs new)
- Abandoned cart rate
- Top search keywords
- Conversion funnel visualization

### ⚙️ Settings (`/admin/settings`)
- Store info (name, logo, contact, social links)
- Shipping zones & delivery charges
- Tax configuration (GST slabs)
- Payment gateway keys (masked)
- Email notification templates
- Return & refund policy text editor

---

## 🚀 FUTURISTIC CUSTOMER FEATURES

| Feature | Description |
|---|---|
| 🤖 **AI Style Assistant** | Chat widget: "Find me a kurta under ₹800 in green" → filtered results |
| 🪞 **Virtual Try-On** | Upload selfie → overlay outfit via AR/3D model (WebAR stub) |
| 📏 **Smart Size Predictor** | Enter height, weight, bust/waist → get recommended size |
| 💡 **Outfit Builder** | Mix & match tops + bottoms + accessories on a mannequin canvas |
| 📊 **Price Drop Tracker** | "Notify me when this drops to ₹X" — user sets target price |
| 🎁 **Gift Finder Quiz** | 5-question quiz → curated gift suggestions for friend/mom/etc. |
| 🔄 **Subscription Box** | Monthly curated fashion box — choose style preferences |
| 💰 **Loyalty Coins (Suka Points)** | Earn on every purchase, redeem on next order |
| 👯 **Referral Program** | Share code → friend gets ₹100 off, you earn ₹150 |
| 🌍 **Sustainable Filter** | Filter by "Eco-Friendly" / "Handloom" / "Organic Cotton" |
| 📱 **PWA Support** | Installable as mobile app (offline browsing, push notifications) |
| 🗣️ **Regional Language Toggle** | UI in English / Tamil / Hindi |
| 📸 **Visual Search** | Upload photo → find similar products in catalog |
| 🔔 **Back-in-Stock Alerts** | Notify when sold-out size/color returns |
| 📅 **Pre-Order** | Reserve upcoming collection items before launch |

---

## 🔐 SECURITY ARCHITECTURE

```
AUTH LAYER
├── JWT Access Token (15 min) — httpOnly cookie
├── Refresh Token (7 days) — httpOnly cookie, rotated on use
├── CSRF token on state-changing requests
└── Rate limiting: 5 login attempts / 15 min per IP

API LAYER
├── Helmet.js — security headers (XSS, clickjacking, CSP)
├── CORS — whitelist frontend domain only
├── express-rate-limit — 100 req/min per IP
├── express-validator — sanitize all inputs
└── SQL injection prevention via Prisma parameterized queries

FRONTEND LAYER
├── Protected Routes — role-checked React Router guards
├── No sensitive data in localStorage
├── Lazy loading — code split by route
└── Environment variables via .env (never committed)

DATA LAYER
├── Passwords: bcrypt (rounds: 12)
├── Payment data: never stored — Razorpay/Stripe handles PCI
├── Soft delete on all records (no hard deletes)
└── Audit log: who changed what, when
```

---

## 🗂️ FOLDER STRUCTURE

```
suka-fashions/
├── client/                          # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/                  # Images, fonts, icons
│   │   ├── components/
│   │   │   ├── common/              # Button, Input, Modal, Badge, Spinner
│   │   │   ├── layout/              # Navbar, Footer, Sidebar, AdminLayout
│   │   │   ├── product/             # ProductCard, QuickView, Gallery
│   │   │   ├── cart/                # CartItem, CartSummary
│   │   │   └── admin/               # Charts, DataTable, StatCard
│   │   ├── pages/
│   │   │   ├── customer/            # Home, Shop, Product, Cart, etc.
│   │   │   └── admin/               # Dashboard, Products, Orders, etc.
│   │   ├── features/                # Redux slices
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── products/
│   │   │   └── orders/
│   │   ├── hooks/                   # useAuth, useCart, useDebounce
│   │   ├── routes/
│   │   │   ├── CustomerRoutes.jsx   # Protected customer routes
│   │   │   ├── AdminRoutes.jsx      # Protected admin routes
│   │   │   └── PublicRoutes.jsx     # Redirect if already logged in
│   │   ├── services/                # RTK Query API slices
│   │   ├── utils/                   # formatPrice, validators, constants
│   │   ├── styles/                  # global.css, variables.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/              # auth, role, rateLimiter, errorHandler
│   │   ├── models/                  # Prisma schema
│   │   ├── services/               # email, cloudinary, payment
│   │   ├── utils/
│   │   └── app.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── .env
│
└── README.md
```

---

## 📋 COMPONENT BUILD ORDER (Recommended)

```
Phase 1 — Foundation
  1. Design system setup (CSS variables, fonts, global styles)
  2. Reusable components: Button, Input, Badge, Spinner, Modal
  3. Navbar + Footer + Layout shell
  4. Auth pages: Login, Register, Forgot Password
  5. Protected route guards (CustomerRoute, AdminRoute)

Phase 2 — Customer Core
  6. Home page (hero, categories, featured products)
  7. Shop page (product grid + filters + sort)
  8. Product Detail page
  9. Cart (with Redux state)
  10. Checkout multi-step form

Phase 3 — Customer Account
  11. My Orders + Order Detail
  12. Wishlist
  13. My Account / Profile
  14. Notifications

Phase 4 — Admin Core
  15. Admin Dashboard (KPIs + charts)
  16. Product Management (CRUD + image upload)
  17. Order Management (status updates)
  18. Customer Management

Phase 5 — Futuristic Features
  19. AI Style Assistant chat widget
  20. Smart Size Predictor
  21. Price Drop Tracker
  22. Loyalty Points system
  23. PWA manifest + service worker
```

---

## 📌 ADDITIONAL INSTRUCTIONS FOR AI CODE GENERATION

When generating code from this prompt:

1. **Use Pistachio Green (`#B5D5C5`) and Dim White (`#F5F5F0`)** throughout — never purple, never dark backgrounds on customer pages.
2. **Import Google Fonts** via `@import` in CSS: `Playfair Display`, `DM Sans`, `Cormorant Garamond`.
3. **All API calls via RTK Query** — no direct `fetch` or `axios` in components.
4. **Forms must use React Hook Form + Zod** for validation — no manual `useState` form handling.
5. **JWT stored ONLY in httpOnly cookies** — never `localStorage.setItem('token', ...)`.
6. **Admin routes must check `role === 'admin'`** server-side on every protected endpoint.
7. **Image upload via Multer + Cloudinary** — never store images as base64 in DB.
8. **All currency in INR (₹)** — format as `₹1,299`.
9. **Mobile-first** — design for 375px, scale up.
10. **Lazy-load all route components** using `React.lazy` + `Suspense`.
11. Use **Framer Motion** for page transitions (`AnimatePresence`) and card hover effects.
12. Every page must have an **SEO-friendly `<title>` and meta description** via React Helmet.
13. Show **skeleton loaders** during data fetch — no blank screens.
14. All **error states and empty states** must be handled with branded illustrations or messages.
15. **Accessibility**: all interactive elements must have `aria-label`, keyboard navigable.
```