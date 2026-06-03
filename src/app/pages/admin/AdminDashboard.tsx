import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { RootState } from '../../store/store';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';

const COLORS = ['#5a8f7a', '#C9A96E', '#8BB9A4', '#D6EBE0'];

export const AdminDashboard: React.FC = () => {
  const [revenueRange, setRevenueRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const { products, orders } = useSelector((s: RootState) => s.catalog);

  const revenueData = useMemo(() => {
    if (revenueRange === 'daily') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((name, i) => ({
        name,
        revenue: 4200 + i * 800,
      }));
    }
    if (revenueRange === 'monthly') {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((name, i) => ({
        name,
        revenue: 120000 + i * 15000,
      }));
    }
    return ['W1', 'W2', 'W3', 'W4'].map((name, i) => ({
      name,
      revenue: 28000 + i * 5000,
    }));
  }, [revenueRange]);

  const lowStock = products.filter((p) => p.stock <= 10 && p.status === 'active');
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const topProducts = [...products]
    .filter((p) => p.status === 'active')
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 4)
    .map((p) => ({ name: p.name.slice(0, 18), sales: p.reviews }));

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    products.filter((p) => p.status === 'active').forEach((p) => {
      map[p.category] = (map[p.category] ?? 0) + p.price;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [products]);

  const recentOrders = [...orders].slice(0, 10);

  const stats = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'bg-green-100 text-green-700' },
    { title: 'Orders Today', value: String(orders.filter((o) => o.status === 'Processing').length + 12), icon: ShoppingBag, color: 'bg-blue-100 text-blue-700' },
    { title: 'New Customers', value: '28', icon: Users, color: 'bg-purple-100 text-purple-700' },
    { title: 'Pending Shipments', value: String(orders.filter((o) => o.status === 'Processing').length), icon: Package, color: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <div className="admin-page">
      <AdminPageHeader title="Dashboard Overview" subtitle="Store performance at a glance" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.title} className="bg-[var(--background)] rounded-2xl p-5 border border-[var(--border)]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{s.title}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[var(--border)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Revenue</h2>
            <div className="flex gap-1 bg-[var(--background)] rounded-lg p-1">
              {(['daily', 'weekly', 'monthly'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRevenueRange(r)}
                  className={`px-3 py-1 text-xs rounded-md capitalize ${revenueRange === r ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : ''}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#5a8f7a" fill="#B5D5C5" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[var(--border)]">
          <h2 className="font-bold text-lg mb-4">Acquisition sources</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={[{ name: 'Organic', value: 40 }, { name: 'Social', value: 30 }, { name: 'Ads', value: 20 }, { name: 'Referral', value: 10 }]} dataKey="value" cx="50%" cy="50%" outerRadius={70} label>
                {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-[var(--border)]">
          <h2 className="font-bold text-lg mb-4">Top selling products</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#5a8f7a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[var(--border)]">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Low stock alerts
          </h2>
          {lowStock.length === 0 ? (
            <p className="text-gray-500 text-sm">All active products are well stocked.</p>
          ) : (
            <ul className="space-y-2">
              {lowStock.map((p) => (
                <li key={p.id} className="flex justify-between text-sm py-2 border-b border-[var(--border)] last:border-0">
                  <span>{p.name}</span>
                  <span className="text-orange-600 font-semibold">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-bold text-lg">Recent orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--background)]">
              <tr>
                <th className="text-left p-4">Order</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-[var(--border)]">
                  <td className="p-4 font-medium">{o.id}</td>
                  <td className="p-4">{o.customerName}</td>
                  <td className="p-4">₹{o.total.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-[var(--primary-light)]">{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

