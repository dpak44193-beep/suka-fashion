import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { breadcrumbLabels } from '../../config/adminNav';

export const AdminBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length <= 1) {
    return (
      <nav className="flex items-center gap-1 text-sm text-gray-500" aria-label="Breadcrumb">
        <span className="text-gray-900 font-medium">Dashboard</span>
      </nav>
    );
  }

  const crumbs = segments.map((seg, i) => {
    const path = `/${segments.slice(0, i + 1).join('/')}`;
    const label = breadcrumbLabels[seg] ?? seg;
    const isLast = i === segments.length - 1;
    return { path, label, isLast };
  });

  return (
    <nav className="flex items-center gap-1 text-sm flex-wrap" aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-body)' }}>
      <Link to="/admin" className="text-gray-500 hover:text-[var(--primary-dark)] flex items-center gap-1">
        <Home className="w-4 h-4" />
      </Link>
      {crumbs.slice(1).map((c) => (
        <React.Fragment key={c.path}>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
          {c.isLast ? (
            <span className="text-gray-900 font-medium">{c.label}</span>
          ) : (
            <Link to={c.path} className="text-gray-500 hover:text-[var(--primary-dark)]">
              {c.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

