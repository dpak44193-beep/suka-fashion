import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateOrder } from '../../store/slices/catalogSlice';
import type { Order, TrackingStage } from '../../types/catalog';
import { TRACKING_STAGES } from '../../lib/orderTracking';
import { downloadInvoice } from '../../lib/invoice';
import { statusFromTrackingStage, normalizeOrder } from '../../lib/orderHelpers';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { OrderTrackingTimeline } from '../../components/order/OrderTrackingTimeline';
import { Button } from '../../components/common/Button';
import { toast } from 'sonner';

export const AdminOrdersPage: React.FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((s: RootState) => s.catalog.orders);
  const settings = useSelector((s: RootState) => s.catalog.settings);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [detail, setDetail] = useState<Order | null>(null);

  const sorted = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders],
  );

  const filtered = sorted.filter((o) => statusFilter === 'all' || o.trackingStage === statusFilter);

  const saveDetail = () => {
    if (!detail) return;
    const updated = normalizeOrder({
      ...detail,
      status: statusFromTrackingStage(detail.trackingStage),
      invoiceReleased:
        detail.invoiceReleased ||
        (detail.paymentMethod !== 'COD' && detail.paymentStatus === 'paid') ||
        (detail.paymentMethod === 'COD' && detail.trackingStage === 'delivered'),
    });
    dispatch(updateOrder(updated));
    toast.success('Order & tracking updated');
    setDetail(null);
  };

  const printBill = (order: Order) => {
    downloadInvoice(order, settings);
  };

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Order Management"
        subtitle="New customer orders appear here. Update tracking manually; generate bill / invoice."
      />

      <select
        className="border rounded-xl px-3 py-2 text-sm mb-4"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All tracking stages</option>
        {TRACKING_STAGES.map((s) => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>

      <div className="bg-white rounded-2xl border table-scroll">
        <table className="w-full text-sm">
          <thead className="bg-[var(--background)]">
            <tr>
              <th className="text-left p-4">Order ID</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Address</th>
              <th className="text-left p-4">Payment</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Tracking</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t hover:bg-[var(--background)]/50">
                <td className="p-4 font-mono font-medium">{o.id}</td>
                <td className="p-4">
                  <p className="font-medium">{o.customerName}</p>
                  <p className="text-xs text-gray-500">{o.customerEmail}</p>
                </td>
                <td className="p-4 text-xs max-w-[140px]">
                  {o.shippingAddress
                    ? `${o.shippingAddress.line}, ${o.shippingAddress.city} ${o.shippingAddress.pin}`
                    : '—'}
                </td>
                <td className="p-4">
                  {o.paymentMethod}
                  <span className={`block text-xs ${o.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                    {o.paymentStatus}
                  </span>
                </td>
                <td className="p-4">₹{o.total.toLocaleString('en-IN')}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-[var(--primary-light)]">
                    {TRACKING_STAGES.find((t) => t.id === o.trackingStage)?.label ?? o.trackingStage}
                  </span>
                </td>
                <td className="p-4 flex flex-wrap gap-1">
                  <Button size="sm" variant="outline" onClick={() => setDetail(o)}>Manage</Button>
                  <Button size="sm" variant="outline" onClick={() => printBill(o)}>Bill</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-gray-500">No orders yet. Customer checkouts will list here.</p>
        )}
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b pb-4 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Order</p>
              <h3 className="font-bold text-xl font-mono">{detail.id}</h3>
              <p className="font-semibold mt-2">{detail.customerName}</p>
              <p className="text-sm text-gray-600">{detail.customerEmail} · {detail.customerPhone ?? '—'}</p>
              <p className="text-sm mt-1">
                <strong>Address:</strong>{' '}
                {detail.shippingAddress
                  ? `${detail.shippingAddress.line}, ${detail.shippingAddress.city} - ${detail.shippingAddress.pin}`
                  : '—'}
              </p>
            </div>

            <ul className="text-sm mb-4 border rounded-xl p-3 space-y-1">
              {detail.items.map((it, i) => (
                <li key={i} className="flex justify-between">
                  <span>{it.name} × {it.qty}</span>
                  <span>₹{it.price * it.qty}</span>
                </li>
              ))}
              <li className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span>₹{detail.total.toLocaleString('en-IN')}</span>
              </li>
            </ul>

            <label className="block text-sm font-semibold mb-2">Tracking stage (manual)</label>
            <select
              className="w-full border rounded-xl px-3 py-2 mb-3"
              value={detail.trackingStage}
              onChange={(e) => {
                const trackingStage = e.target.value as TrackingStage;
                setDetail({
                  ...detail,
                  trackingStage,
                  status: statusFromTrackingStage(trackingStage),
                  invoiceReleased:
                    detail.invoiceReleased ||
                    (detail.paymentMethod === 'COD' && trackingStage === 'delivered'),
                });
              }}
            >
              {TRACKING_STAGES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>

            <input
              type="datetime-local"
              className="w-full border rounded-xl px-3 py-2 mb-3"
              value={detail.estimatedDelivery?.slice(0, 16) ?? ''}
              onChange={(e) => setDetail({ ...detail, estimatedDelivery: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
            />
            <input className="w-full border rounded-xl px-3 py-2 mb-2" placeholder="Tracking number" value={detail.trackingNumber ?? ''} onChange={(e) => setDetail({ ...detail, trackingNumber: e.target.value })} />
            <input className="w-full border rounded-xl px-3 py-2 mb-3" placeholder="Courier" value={detail.courier ?? ''} onChange={(e) => setDetail({ ...detail, courier: e.target.value })} />

            {detail.paymentMethod === 'COD' && (
              <label className="flex items-center gap-2 text-sm mb-4 p-3 bg-[var(--background)] rounded-xl">
                <input
                  type="checkbox"
                  checked={detail.invoiceReleased}
                  onChange={(e) => setDetail({ ...detail, invoiceReleased: e.target.checked })}
                />
                Release invoice for customer (after COD delivery)
              </label>
            )}

            <OrderTrackingTimeline order={detail} compact />

            <div className="flex flex-wrap gap-2 mt-6">
              <Button onClick={saveDetail}>Save updates</Button>
              <Button variant="outline" onClick={() => printBill(detail)}>Print / download bill</Button>
              <Button variant="outline" onClick={() => setDetail(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

