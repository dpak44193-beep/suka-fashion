export type ProductStatus = 'draft' | 'active';

export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
  price: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  mrp: number;
  costPrice: number;
  image: string;
  images: string[];
  /** Optional product video (data URL or remote URL). */
  video?: string;
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
  stock: number;
  variants: ProductVariant[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  status: ProductStatus;
  featured?: boolean;
  new?: boolean;
  brand?: string;
}

export interface CategoryNode {
  id: string;
  name: string;
  parentId: string | null;
  image?: string;
  banner?: string;
  order: number;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';

/** Manual tracking stages updated by admin. */
export type TrackingStage = 'order_confirmed' | 'shipment' | 'out_for_delivery' | 'delivered';

export type PaymentStatus = 'paid' | 'pending';

export interface ShippingAddress {
  line: string;
  city: string;
  pin: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: ShippingAddress;
  items: OrderItem[];
  subtotal?: number;
  discount?: number;
  deliveryFee?: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  trackingStage: TrackingStage;
  estimatedDelivery?: string;
  invoiceReleased: boolean;
  createdAt: string;
  trackingNumber?: string;
  courier?: string;
}

/** @deprecated Use Order — kept for migration */
export type CustomerOrder = Order;

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  joinDate: string;
  blocked: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'flat' | 'shipping' | 'bogo';
  value: number;
  minOrder: number;
  usageLimit: number;
  used: number;
  expiresAt: string;
  active: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  text: string;
  approved: boolean;
  flagged: boolean;
  reply?: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  image: string;
  order: number;
  active: boolean;
  scheduleStart?: string;
  scheduleEnd?: string;
}

export interface StoreSettings {
  storeName: string;
  logo: string;
  contactEmail: string;
  contactPhone: string;
  socialInstagram: string;
  socialFacebook: string;
  standardShipping: number;
  expressShipping: number;
  freeShippingMin: number;
  gstRate: number;
  returnPolicy: string;
  razorpayKey: string;
  stripeKey: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type: 'order' | 'sale' | 'price_drop';
}

