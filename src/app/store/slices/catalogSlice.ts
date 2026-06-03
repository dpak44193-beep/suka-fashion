import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  Banner,
  CatalogProduct,
  CategoryNode,
  Coupon,
  Customer,
  CustomerOrder,
  NotificationItem,
  Order,
  ProductStatus,
  Review,
  StoreSettings,
} from '../../types/catalog';
import {
  defaultStoreSettings,
  seedBanners,
  seedCategories,
  seedCoupons,
  seedCustomers,
  seedOrders,
  seedProducts,
  seedReviews,
} from '../../data/seedCatalog';
import { migrateLegacyOrder } from '../../lib/orderHelpers';

const CATALOG_KEY = 'suka_catalog_v1';

export interface CatalogState {
  products: CatalogProduct[];
  categories: CategoryNode[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  reviews: Review[];
  banners: Banner[];
  settings: StoreSettings;
  customerOrders: CustomerOrder[];
  notifications: NotificationItem[];
}

const defaultState: CatalogState = {
  products: seedProducts,
  categories: seedCategories,
  orders: seedOrders,
  customers: seedCustomers,
  coupons: seedCoupons,
  reviews: seedReviews,
  banners: seedBanners,
  settings: defaultStoreSettings,
  customerOrders: [],
  notifications: [
    { id: 'n1', title: 'Order shipped', body: 'Your order ORD-1235 is on the way.', read: false, createdAt: '2026-05-28', type: 'order' },
    { id: 'n2', title: 'Flash sale', body: 'Extra 10% off kurtas — today only!', read: false, createdAt: '2026-05-30', type: 'sale' },
  ],
};

function mergeOrders(parsed: CatalogState): Order[] {
  const fromCustomer = (parsed.customerOrders ?? []).map((co) => migrateLegacyOrder(co as Order));
  const fromOrders = (parsed.orders ?? []).map((o) => migrateLegacyOrder(o));
  const byId = new Map<string, Order>();
  [...fromOrders, ...fromCustomer].forEach((o) => byId.set(o.id, o));
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function loadCatalog(): CatalogState {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CatalogState;
      if (parsed.products?.length) {
        return {
          ...defaultState,
          ...parsed,
          orders: mergeOrders(parsed),
          customerOrders: [],
          settings: { ...defaultStoreSettings, ...parsed.settings },
        };
      }
    }
  } catch {
    localStorage.removeItem(CATALOG_KEY);
  }
  return defaultState;
}

function persist(state: CatalogState) {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(state));
}

const initialState: CatalogState = loadCatalog();

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<CatalogProduct[]>) => {
      state.products = action.payload;
      persist(state);
    },
    upsertProduct: (state, action: PayloadAction<CatalogProduct>) => {
      const i = state.products.findIndex((p) => p.id === action.payload.id);
      if (i >= 0) state.products[i] = action.payload;
      else state.products.push(action.payload);
      persist(state);
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      persist(state);
    },
    bulkProductStatus: (state, action: PayloadAction<{ ids: string[]; status: ProductStatus }>) => {
      state.products = state.products.map((p) =>
        action.payload.ids.includes(p.id) ? { ...p, status: action.payload.status } : p,
      );
      persist(state);
    },
    setCategories: (state, action: PayloadAction<CategoryNode[]>) => {
      state.categories = action.payload;
      persist(state);
    },
    upsertCategory: (state, action: PayloadAction<CategoryNode>) => {
      const i = state.categories.findIndex((c) => c.id === action.payload.id);
      if (i >= 0) state.categories[i] = action.payload;
      else state.categories.push(action.payload);
      persist(state);
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload);
      persist(state);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const i = state.orders.findIndex((o) => o.id === action.payload.id);
      const order = migrateLegacyOrder(action.payload);
      if (i >= 0) state.orders[i] = order;
      else state.orders.unshift(order);
      persist(state);
    },
    placeOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(migrateLegacyOrder(action.payload));
      persist(state);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const i = state.customers.findIndex((c) => c.id === action.payload.id);
      if (i >= 0) state.customers[i] = action.payload;
      persist(state);
    },
    upsertCoupon: (state, action: PayloadAction<Coupon>) => {
      const i = state.coupons.findIndex((c) => c.id === action.payload.id);
      if (i >= 0) state.coupons[i] = action.payload;
      else state.coupons.push(action.payload);
      persist(state);
    },
    updateReview: (state, action: PayloadAction<Review>) => {
      const i = state.reviews.findIndex((r) => r.id === action.payload.id);
      if (i >= 0) state.reviews[i] = action.payload;
      persist(state);
    },
    deleteReview: (state, action: PayloadAction<string>) => {
      state.reviews = state.reviews.filter((r) => r.id !== action.payload);
      persist(state);
    },
    setBanners: (state, action: PayloadAction<Banner[]>) => {
      state.banners = action.payload;
      persist(state);
    },
    upsertBanner: (state, action: PayloadAction<Banner>) => {
      const i = state.banners.findIndex((b) => b.id === action.payload.id);
      if (i >= 0) state.banners[i] = action.payload;
      else state.banners.push(action.payload);
      persist(state);
    },
    updateSettings: (state, action: PayloadAction<Partial<StoreSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
      persist(state);
    },
    addCustomerOrder: (state, action: PayloadAction<CustomerOrder>) => {
      state.orders.unshift(migrateLegacyOrder(action.payload as Order));
      persist(state);
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find((x) => x.id === action.payload);
      if (n) n.read = true;
      persist(state);
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => { n.read = true; });
      persist(state);
    },
  },
});

export const {
  setProducts,
  upsertProduct,
  deleteProduct,
  bulkProductStatus,
  setCategories,
  upsertCategory,
  deleteCategory,
  updateOrder,
  placeOrder,
  updateCustomer,
  upsertCoupon,
  updateReview,
  deleteReview,
  setBanners,
  upsertBanner,
  updateSettings,
  addCustomerOrder,
  markNotificationRead,
  markAllNotificationsRead,
} = catalogSlice.actions;

export default catalogSlice.reducer;

