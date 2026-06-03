import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { RootState } from '../../store/store';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';

export const AdminAnalyticsPage: React.FC = () => {
  const { products } = useSelector((s: RootState) => s.catalog);

  const byCategory = ['Kurtas', 'Sarees', 'Western', 'Accessories'].map((name) => ({
    name,
    revenue: products.filter((p) => p.category === name && p.status === 'active').reduce((s, p) => s + p.price, 0),
  }));

  const funnel = [
    { stage: 'Visits', count: 12000 },
    { stage: 'Product views', count: 4800 },
    { stage: 'Add to cart', count: 920 },
    { stage: 'Checkout', count: 410 },
    { stage: 'Purchase', count: 286 },
  ];

  return (
    <div className="admin-page">
      <AdminPageHeader title="Analytics" subtitle="Revenue, retention, search, and conversion" />

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border rounded-2xl p-6">
          <h3 className="font-bold mb-4">Revenue by category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#5a8f7a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border rounded-2xl p-6">
          <h3 className="font-bold mb-4">Customer retention</h3>
          <div className="flex gap-8 justify-center py-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--primary-dark)]">62%</p>
              <p className="text-sm text-gray-500">Repeat customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">38%</p>
              <p className="text-sm text-gray-500">New customers</p>
            </div>
          </div>
          <p className="text-sm text-center text-gray-600">Abandoned cart rate: <strong>24%</strong></p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-2xl p-6">
          <h3 className="font-bold mb-3">Top search keywords</h3>
          <ul className="text-sm space-y-2">
            {['kurta', 'saree silk', 'palazzo', 'jhumka', 'anarkali'].map((k, i) => (
              <li key={k} className="flex justify-between"><span>{k}</span><span className="text-gray-500">{120 - i * 18} searches</span></li>
            ))}
          </ul>
        </div>
        <div className="bg-white border rounded-2xl p-6">
          <h3 className="font-bold mb-4">Conversion funnel</h3>
          <div className="space-y-2">
            {funnel.map((f) => (
              <div key={f.stage}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{f.stage}</span>
                  <span>{f.count.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--primary)]" style={{ width: `${(f.count / funnel[0].count) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

