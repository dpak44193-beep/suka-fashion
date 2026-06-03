import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-500 mt-1 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
          {subtitle}
        </p>
      )}
    </div>
    {action}
  </div>
);

