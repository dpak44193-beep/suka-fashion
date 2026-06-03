import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download } from 'lucide-react';
import { RootState } from '../../store/store';
import { updateCustomer } from '../../store/slices/catalogSlice';
import type { Customer } from '../../types/catalog';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Button } from '../../components/common/Button';
import { toast } from 'sonner';

export const AdminCustomersPage: React.FC = () => {
  const dispatch = useDispatch();
  const customers = useSelector((s: RootState) => s.catalog.customers);
  const orders = useSelector((s: RootState) => s.catalog.orders);
  const [detail, setDetail] = useState<Customer | null>(null);

  const exportCsv = () => {
    const rows = customers.map((c) => `${c.name},${c.email},${c.phone},${c.totalOrders},${c.joinDate}`).join('\n');
    const blob = new Blob([`name,email,phone,orders,joinDate\n${rows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    toast.success('Exported');
  };

  const customerOrders = detail ? orders.filter((o) => o.customerEmail === detail.email) : [];

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Customer Management"
        action={<Button size="sm" variant="outline" onClick={exportCsv}><Download className="w-4 h-4" /> Export CSV</Button>}
      />

      <div className="bg-white rounded-2xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--background)]">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Orders</th>
              <th className="text-left p-4">Joined</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-4">{c.name} {c.blocked && <span className="text-red-600 text-xs">(blocked)</span>}</td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.phone}</td>
                <td className="p-4">{c.totalOrders}</td>
                <td className="p-4">{c.joinDate}</td>
                <td className="p-4"><Button size="sm" variant="outline" onClick={() => setDetail(c)}>Details</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-bold text-lg">{detail.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{detail.email} · {detail.phone}</p>
            <h4 className="font-semibold text-sm mb-2">Order history</h4>
            <ul className="text-sm mb-4 max-h-40 overflow-y-auto">
              {customerOrders.length ? customerOrders.map((o) => <li key={o.id}>{o.id} — ₹{o.total} ({o.status})</li>) : <li>No orders</li>}
            </ul>
            <Button
              variant="outline"
              onClick={() => {
                dispatch(updateCustomer({ ...detail, blocked: !detail.blocked }));
                setDetail({ ...detail, blocked: !detail.blocked });
                toast.success(detail.blocked ? 'Unblocked' : 'Blocked');
              }}
            >
              {detail.blocked ? 'Unblock' : 'Block'} account
            </Button>
            <Button variant="outline" className="ml-2" onClick={() => setDetail(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

