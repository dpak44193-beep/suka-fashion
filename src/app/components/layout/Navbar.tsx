import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { getRoleLabel } from '../../lib/auth';
import { BrandLogo } from '../common/BrandLogo';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-[var(--card)] border-b border-[var(--border)] shadow-sm"
    >
      {/* Top Banner */}
      <div className="bg-[var(--primary)] text-[var(--primary-foreground)] py-2 marquee-wrap">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex gap-8 whitespace-nowrap text-sm font-medium"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <span>Free shipping above ₹999</span>
          <span>•</span>
          <span>New Arrivals Weekly</span>
          <span>•</span>
          <span>100% Authentic</span>
          <span>•</span>
          <span>Easy Returns</span>
          <span>•</span>
          <span>Free shipping above ₹999</span>
          <span>•</span>
          <span>New Arrivals Weekly</span>
        </motion.div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-3 py-3 min-h-[56px]">
          {/* Logo (image includes wordmark — keep compact) */}
          <Link to="/" className="flex shrink-0 items-center max-w-[100px] sm:max-w-[110px]">
            <BrandLogo size="md" />
          </Link>

          <div className="hidden lg:flex items-center gap-4 xl:gap-8 flex-1 justify-center min-w-0 flex-wrap">
            <Link to="/shop" className="hover:text-[var(--primary)] transition-colors font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              Shop
            </Link>
            <Link to="/shop?category=kurtas" className="hover:text-[var(--primary)] transition-colors font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              Kurtas
            </Link>
            <Link to="/shop?category=sarees" className="hover:text-[var(--primary)] transition-colors font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              Sarees
            </Link>
            <Link to="/shop?category=western" className="hover:text-[var(--primary)] transition-colors font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              Western
            </Link>
            <Link to="/shop?category=accessories" className="hover:text-[var(--primary)] transition-colors font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              Accessories
            </Link>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-[var(--background)] rounded-full px-3 py-2 flex-1 max-w-[12rem] lg:max-w-[16rem] xl:w-64 min-w-0 shrink">
            <Search className="w-5 h-5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent px-3 py-1 outline-none w-full"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </form>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-auto md:ml-0">
            <Link to="/wishlist" className="relative hover:text-[var(--primary)] transition-colors">
              <Heart className="w-6 h-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--accent)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative hover:text-[var(--primary)] transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--accent)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="hover:text-[var(--primary)] transition-colors">
                  <User className="w-6 h-6" />
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-2 border-b border-[var(--border)] mb-1">
                    <p className="text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    {user?.role && (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary-foreground)]">
                        {getRoleLabel(user.role)}
                      </span>
                    )}
                  </div>
                  <Link to="/account" className="block px-4 py-2 hover:bg-[var(--background)]" style={{ fontFamily: 'var(--font-body)' }}>
                    My Account
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-[var(--background)]" style={{ fontFamily: 'var(--font-body)' }}>
                    Orders
                  </Link>
                  <Link to="/notifications" className="block px-4 py-2 hover:bg-[var(--background)]" style={{ fontFamily: 'var(--font-body)' }}>
                    Notifications
                  </Link>
                  <Link to="/track-order" className="block px-4 py-2 hover:bg-[var(--background)]" style={{ fontFamily: 'var(--font-body)' }}>
                    Track order
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-[var(--background)]" style={{ fontFamily: 'var(--font-body)' }}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-[var(--background)] flex items-center gap-2" style={{ fontFamily: 'var(--font-body)' }}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hover:text-[var(--primary)] transition-colors">
                <User className="w-6 h-6" />
              </Link>
            )}

            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden touch-target p-1">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-[var(--border)] overflow-hidden safe-bottom"
          >
            <div className="container mx-auto py-4 space-y-4">
              <form onSubmit={handleSearch} className="flex items-center bg-[var(--background)] rounded-full px-4 py-2">
                <Search className="w-5 h-5 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent px-3 py-1 outline-none w-full"
                />
              </form>
              <Link to="/shop" className="block py-2 hover:text-[var(--primary)]">Shop</Link>
              <Link to="/shop?category=kurtas" className="block py-2 hover:text-[var(--primary)]">Kurtas</Link>
              <Link to="/shop?category=sarees" className="block py-2 hover:text-[var(--primary)]">Sarees</Link>
              <Link to="/shop?category=western" className="block py-2 hover:text-[var(--primary)]">Western</Link>
              <Link to="/shop?category=accessories" className="block py-2 hover:text-[var(--primary)]">Accessories</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

