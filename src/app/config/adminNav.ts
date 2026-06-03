import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Tag,
  Star,
  Megaphone,
  BarChart3,
  Settings,
} from 'lucide-react';

export const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/offers', label: 'Coupons & Offers', icon: Tag },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/marketing', label: 'Marketing', icon: Megaphone },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export const breadcrumbLabels: Record<string, string> = {
  admin: 'Admin',
  products: 'Products',
  categories: 'Categories',
  orders: 'Orders',
  customers: 'Customers',
  offers: 'Coupons & Offers',
  reviews: 'Reviews',
  marketing: 'Marketing',
  analytics: 'Analytics',
  settings: 'Settings',
};

