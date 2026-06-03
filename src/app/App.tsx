import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { store } from './store/store';

import { CustomerLayout } from './components/layout/CustomerLayout';
import { RequireCustomer } from './components/auth/RoleGuard';
import { AdminLayout } from './components/admin/AdminLayout';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { SearchPage } from './pages/SearchPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { AccountPage } from './pages/AccountPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { TrackOrderPage } from './pages/TrackOrderPage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminMarketingPage } from './pages/admin/AdminMarketingPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
    {children}
  </motion.div>
);

const wrap = (page: React.ReactNode) => (
  <CustomerLayout>
    <PageTransition>{page}</PageTransition>
  </CustomerLayout>
);

const admin = (page: React.ReactNode) => (
  <AdminLayout>
    <PageTransition>{page}</PageTransition>
  </AdminLayout>
);

export default function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <div className="min-h-screen min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden">
            <Toaster position="top-right" />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={wrap(<HomePage />)} />
                <Route path="/shop" element={wrap(<ShopPage />)} />
                <Route path="/product/:id" element={wrap(<ProductDetailPage />)} />
                <Route path="/cart" element={wrap(<CartPage />)} />
                <Route path="/wishlist" element={wrap(<WishlistPage />)} />
                <Route path="/search" element={wrap(<SearchPage />)} />
                <Route path="/track-order" element={wrap(<TrackOrderPage />)} />
                <Route path="/track/:orderId" element={wrap(<TrackOrderPage />)} />

                <Route path="/checkout" element={
                  <CustomerLayout>
                    <RequireCustomer>
                      <PageTransition><CheckoutPage /></PageTransition>
                    </RequireCustomer>
                  </CustomerLayout>
                } />
                <Route path="/account" element={
                  <CustomerLayout>
                    <RequireCustomer>
                      <PageTransition><AccountPage /></PageTransition>
                    </RequireCustomer>
                  </CustomerLayout>
                } />
                <Route path="/orders" element={
                  <CustomerLayout>
                    <RequireCustomer>
                      <PageTransition><OrdersPage /></PageTransition>
                    </RequireCustomer>
                  </CustomerLayout>
                } />
                <Route path="/notifications" element={
                  <CustomerLayout>
                    <RequireCustomer>
                      <PageTransition><NotificationsPage /></PageTransition>
                    </RequireCustomer>
                  </CustomerLayout>
                } />

                <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
                <Route path="/admin/login" element={<PageTransition><AdminLoginPage /></PageTransition>} />

                <Route path="/admin" element={admin(<AdminDashboard />)} />
                <Route path="/admin/products" element={admin(<AdminProductsPage />)} />
                <Route path="/admin/categories" element={admin(<AdminCategoriesPage />)} />
                <Route path="/admin/orders" element={admin(<AdminOrdersPage />)} />
                <Route path="/admin/customers" element={admin(<AdminCustomersPage />)} />
                <Route path="/admin/offers" element={admin(<AdminOffersPage />)} />
                <Route path="/admin/reviews" element={admin(<AdminReviewsPage />)} />
                <Route path="/admin/marketing" element={admin(<AdminMarketingPage />)} />
                <Route path="/admin/analytics" element={admin(<AdminAnalyticsPage />)} />
                <Route path="/admin/settings" element={admin(<AdminSettingsPage />)} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
}

