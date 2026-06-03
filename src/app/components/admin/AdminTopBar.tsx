import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getRoleLabel } from '../../lib/auth';
import { AdminBreadcrumbs } from './AdminBreadcrumbs';

interface AdminTopBarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useSelector((s: RootState) => s.auth);
  const [search, setSearch] = useState('');
  const [showNotif, setShowNotif] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/admin/products?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[var(--border)] px-4 md:px-6 py-3">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block flex-1 min-w-0">
          <AdminBreadcrumbs />
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-[var(--background)] rounded-xl px-3 py-2 border border-[var(--border)]">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, orders..."
            className="bg-transparent outline-none w-full text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          />
        </form>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotif(!showNotif)}
              className="p-2 rounded-xl hover:bg-gray-100 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--destructive)] rounded-full" />
            </button>
            {showNotif && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-[var(--border)] py-2 z-50">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Notifications</p>
                <p className="px-4 py-3 text-sm text-gray-600">3 new orders pending shipment</p>
                <p className="px-4 py-3 text-sm text-gray-600 border-t">Low stock: Pistachio Kurta (5 left)</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pl-2 border-l border-[var(--border)]">
            <div className="w-9 h-9 rounded-full bg-[var(--primary)] flex items-center justify-center text-sm font-bold text-[var(--primary-foreground)]">
              {user?.name?.charAt(0) ?? 'A'}
            </div>
            <div className="hidden lg:block text-right">
              <p className="text-sm font-semibold leading-tight">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role ? getRoleLabel(user.role) : ''}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

