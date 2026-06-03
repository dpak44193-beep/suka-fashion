import type {
  Banner,
  CatalogProduct,
  CategoryNode,
  Coupon,
  Customer,
  Order,
  Review,
  StoreSettings,
} from '../types/catalog';
import { mockProducts } from './mockData';

function toCatalogProduct(p: (typeof mockProducts)[0], status: 'active' | 'draft' = 'active'): CatalogProduct {
  const variants = p.sizes.flatMap((size) =>
    p.colors.map((color) => ({
      size,
      color,
      stock: Math.max(1, Math.floor(p.stock / (p.sizes.length * p.colors.length))),
      price: p.price,
    })),
  );
  return {
    id: p.id,
    name: p.name,
    sku: `SKU-${p.id.padStart(4, '0')}`,
    description: p.description,
    category: p.category,
    price: p.price,
    mrp: p.mrp,
    costPrice: Math.round(p.price * 0.55),
    image: p.image,
    images: p.images,
    rating: p.rating,
    reviews: p.reviews,
    sizes: p.sizes,
    colors: p.colors,
    stock: p.stock,
    variants,
    tags: [p.category.toLowerCase(), 'suka'],
    seoTitle: `${p.name} | Suka Fashions`,
    seoDescription: p.description.slice(0, 120),
    status,
    featured: p.featured,
    new: p.new,
    brand: 'Suka',
  };
}

export const seedProducts: CatalogProduct[] = mockProducts.map((p) => toCatalogProduct(p, 'active'));

export const seedCategories: CategoryNode[] = [
  { id: 'kurtas', name: 'Kurtas', parentId: null, order: 0, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400' },
  { id: 'sarees', name: 'Sarees', parentId: null, order: 1, image: 'https://images.unsplash.com/photo-1610019258409-7842e05a1d88?w=400' },
  { id: 'western', name: 'Western', parentId: null, order: 2, image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400' },
  { id: 'accessories', name: 'Accessories', parentId: null, order: 3, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400' },
  { id: 'kurta-sets', name: 'Kurta Sets', parentId: 'kurtas', order: 0 },
  { id: 'silk-sarees', name: 'Silk Sarees', parentId: 'sarees', order: 0 },
];

export const seedOrders: Order[] = [
  {
    id: 'ORD-1234',
    customerId: 'c1',
    customerName: 'Priya Sharma',
    customerEmail: 'priya@example.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: { line: '12 MG Road', city: 'Bangalore', pin: '560001' },
    items: [{ productId: '1', name: 'Elegant Pistachio Kurta Set', qty: 1, price: 2499, size: 'M', color: 'Pistachio Green' }],
    subtotal: 2499,
    total: 2499,
    status: 'Processing',
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    trackingStage: 'order_confirmed',
    invoiceReleased: true,
    createdAt: '2026-05-28T10:00:00Z',
  },
  {
    id: 'ORD-1235',
    customerId: 'c2',
    customerName: 'Ananya Reddy',
    customerEmail: 'ananya@example.com',
    customerPhone: '+91 91234 56789',
    shippingAddress: { line: '45 Jubilee Hills', city: 'Hyderabad', pin: '500033' },
    items: [{ productId: '2', name: 'Silk Saree with Gold Border', qty: 1, price: 5999 }],
    subtotal: 5999,
    total: 5999,
    status: 'Shipped',
    paymentMethod: 'Card',
    paymentStatus: 'paid',
    trackingStage: 'out_for_delivery',
    invoiceReleased: true,
    estimatedDelivery: '2026-06-02T18:00:00Z',
    createdAt: '2026-05-27T14:30:00Z',
    trackingNumber: 'SF123456789IN',
    courier: 'Delhivery',
  },
  {
    id: 'ORD-1236',
    customerId: 'c3',
    customerName: 'Meera Patel',
    customerEmail: 'meera@example.com',
    customerPhone: '+91 99887 76655',
    shippingAddress: { line: '8 Law Garden', city: 'Ahmedabad', pin: '380006' },
    items: [{ productId: '4', name: 'Handcrafted Jhumka Earrings', qty: 2, price: 899 }],
    subtotal: 1798,
    total: 1798,
    status: 'Delivered',
    paymentMethod: 'COD',
    paymentStatus: 'pending',
    trackingStage: 'delivered',
    invoiceReleased: true,
    createdAt: '2026-05-20T09:15:00Z',
    trackingNumber: 'SF987654321IN',
    courier: 'BlueDart',
  },
];

export const seedCustomers: Customer[] = [
  { id: 'c1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43210', totalOrders: 5, joinDate: '2025-11-01', blocked: false },
  { id: 'c2', name: 'Ananya Reddy', email: 'ananya@example.com', phone: '+91 91234 56789', totalOrders: 3, joinDate: '2026-01-15', blocked: false },
  { id: 'c3', name: 'Meera Patel', email: 'meera@example.com', phone: '+91 99887 76655', totalOrders: 8, joinDate: '2025-08-20', blocked: false },
];

export const seedCoupons: Coupon[] = [
  { id: 'cp1', code: 'SUKA10', type: 'percent', value: 10, minOrder: 999, usageLimit: 100, used: 42, expiresAt: '2026-12-31', active: true },
  { id: 'cp2', code: 'FREESHIP', type: 'shipping', value: 0, minOrder: 1499, usageLimit: 500, used: 120, expiresAt: '2026-12-31', active: true },
];

export const seedReviews: Review[] = [
  { id: 'r1', productId: '1', productName: 'Elegant Pistachio Kurta Set', customerName: 'Priya S.', rating: 5, text: 'Beautiful fabric and fit!', approved: true, flagged: false, createdAt: '2026-05-01' },
  { id: 'r2', productId: '2', productName: 'Silk Saree with Gold Border', customerName: 'Ananya R.', rating: 4, text: 'Lovely saree, delivery was quick.', approved: true, flagged: false, createdAt: '2026-05-10' },
];

export const seedBanners: Banner[] = [
  { id: 'b1', title: 'Spring Collection 2026', subtitle: 'Shop handpicked styles', link: '/shop', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200', order: 0, active: true },
  { id: 'b2', title: 'New Arrivals', subtitle: 'Fresh kurtas & sarees', link: '/shop?filter=new', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200', order: 1, active: true },
];

export const defaultStoreSettings: StoreSettings = {
  storeName: 'Suka Fashions',
  logo: '',
  contactEmail: 'hello@sukafashions.com',
  contactPhone: '+91 98765 43210',
  socialInstagram: '@sukafashions',
  socialFacebook: 'SukaFashions',
  standardShipping: 99,
  expressShipping: 199,
  freeShippingMin: 999,
  gstRate: 12,
  returnPolicy: 'Easy 7-day returns on unused items with tags intact.',
  razorpayKey: 'rzp_live_****',
  stripeKey: 'sk_live_****',
};

