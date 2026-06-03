import { ADMIN_OWNER, DEMO_CUSTOMER } from '../config/auth';

export type UserRole = 'customer' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

/** Normalize email (trim, lowercase, fix `@gmail` without `.com`). */
export function normalizeEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  if (/^[^\s@]+@gmail$/i.test(trimmed)) {
    return `${trimmed}.com`;
  }
  return trimmed;
}

export function isAdminEmail(email: string): boolean {
  return normalizeEmail(email) === normalizeEmail(ADMIN_OWNER.email);
}

export function isDemoCustomerEmail(email: string): boolean {
  return normalizeEmail(email) === normalizeEmail(DEMO_CUSTOMER.email);
}

export function verifyDemoCustomerCredentials(email: string, password: string): boolean {
  return isDemoCustomerEmail(email) && password === DEMO_CUSTOMER.password;
}

export function createDemoCustomerUser(): AuthUser {
  return {
    id: DEMO_CUSTOMER.id,
    name: DEMO_CUSTOMER.name,
    email: normalizeEmail(DEMO_CUSTOMER.email),
    role: 'customer',
    avatar: DEMO_CUSTOMER.avatar,
  };
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  return (
    isAdminEmail(email) &&
    password === ADMIN_OWNER.password
  );
}

export function createAdminUser(email: string): AuthUser {
  return {
    id: ADMIN_OWNER.id,
    name: ADMIN_OWNER.name,
    email: normalizeEmail(email),
    role: 'admin',
    avatar: ADMIN_OWNER.avatar,
  };
}

export function createCustomerUser(email: string): AuthUser {
  const normalized = normalizeEmail(email);
  const localPart = normalized.split('@')[0] ?? 'customer';
  const displayName = localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return {
    id: `customer-${normalized}`,
    name: displayName || 'Customer',
    email: normalized,
    role: 'customer',
    avatar: 'https://i.pravatar.cc/150?img=1',
  };
}

export function getRoleLabel(role: UserRole): string {
  return role === 'admin' ? 'Store Owner (Admin)' : 'Customer';
}

