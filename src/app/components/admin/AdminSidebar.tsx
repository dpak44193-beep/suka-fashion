import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { getRoleLabel } from '../../lib/auth';
import { adminNavItems } from '../../config/adminNav';
import { BrandLogo } from '../common/BrandLogo';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/admin/login';
  };

  const sidebarContent = (
  <>
      <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} border-b border-white/10`}>
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <BrandLogo size="sm" alt="Suka" className="brightness-0 invert" />
          </Link>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/10"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {user && !collapsed && (
        <div className="mx-3 mt-4 p-3 rounded-xl bg-white/10 border border-white/10">
          <p className="font-semibold text-sm truncate">{user.name}</p>
          <p className="text-xs text-white/60 truncate mt-0.5">{user.email}</p>
          <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded bg-[var(--primary)] text-[var(--primary-foreground)]">
            {getRoleLabel(user.role)}
          </span>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? location.pathname === item.href
            : location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                active ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'hover:bg-white/10 text-white/90'
              }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          to="/"
          onClick={onMobileClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-sm ${collapsed ? 'justify-center' : ''}`}
        >
          {!collapsed && '← Storefront'}
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-sm text-left ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onMobileClose}
          aria-label="Close menu"
        />
      )}
      <aside
        className={`
          fixed lg:sticky top-0 z-50 h-screen flex flex-col
          bg-[#5a8f7a] text-white transition-all duration-300
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

