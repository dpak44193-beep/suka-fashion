/** Owner admin account (demo — replace with server-side auth in production). */
export const ADMIN_OWNER = {
  id: 'admin-owner',
  name: 'Store Owner',
  email: 'dpak44193@gmail.com',
  password: 'deebaksurithika@12',
  role: 'admin' as const,
  avatar: 'https://i.pravatar.cc/150?img=12',
};

/** Demo customer account for storefront testing. */
export const DEMO_CUSTOMER = {
  id: 'demo-customer',
  name: 'Suka Demo User',
  email: 'sukadevelopers@gmail.com',
  password: 'deebaksurithika@12',
  role: 'customer' as const,
  avatar: 'https://i.pravatar.cc/150?img=5',
};

export const AUTH_STORAGE_KEY = 'suka_auth_session';

