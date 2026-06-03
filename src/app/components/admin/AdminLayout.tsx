import React, { useState } from 'react';
import { RequireAdmin } from '../auth/RoleGuard';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RequireAdmin>
      <div className="min-h-screen flex">
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0 w-full lg:w-auto admin-content-column flex-min-0">
          <AdminTopBar
            onMenuClick={() => setMobileOpen(true)}
            sidebarCollapsed={collapsed}
          />
          <main className="flex-1 bg-white min-h-[calc(100vh-57px)] w-full max-w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </RequireAdmin>
  );
};

