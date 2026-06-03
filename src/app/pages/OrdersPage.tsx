import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { OrderTrackingTimeline } from '../components/order/OrderTrackingTimeline';
import { Button } from '../components/common/Button';
import { canDownloadInvoice, invoiceUnavailableMessage } from '../lib/orderTracking';
import { downloadInvoice } from '../lib/invoice';
import { TRACKING_STAGES } from '../lib/orderTracking';

export const OrdersPage: React.FC = () => {
  const { user } = useSelector((s: RootState) => s.auth);
  const allOrders = useSelector((s: RootState) => s.catalog.orders);
  const settings = useSelector((s: RootState) => s.catalog.settings);
  const [selected, setSelected] = useState<string | null>(null);

  const orders = useMemo(() => {
    if (!user?.email) return [];
    const email = user.email.toLowerCase();
    return allOrders.filter((o) => o.customerEmail.toLowerCase() === email);
  }, [allOrders, user?.email]);

  const order = orders.find((o) => o.id === selected);
  const stageLabel = (id: string) => TRACKING_STAGES.find((t) => t.id === id)?.label ?? id;

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-[var(--background)] py-16 text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>My Orders</h1>
        <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet.</p>
        <Link to="/shop"><Button>Shop now</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>My Orders</h1>
        <div className="space-y-4">
          {orders.map((o) => {
            const canInvoice = canDownloadInvoice(o);
            return (
              <div key={o.id} className="bg-white rounded-2xl p-5 border">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-mono font-bold">{o.id}</p>
                    <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-[var(--primary-light)] shrink-0">
                    {stageLabel(o.trackingStage)}
                  </span>
                </div>
                <p className="mt-2 font-semibold">₹{o.total.toLocaleString('en-IN')} · {o.paymentMethod}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => setSelected(o.id)}>Track order</Button>
                  {canInvoice ? (
                    <Button size="sm" variant="outline" onClick={() => downloadInvoice(o, settings)}>Download invoice</Button>
                  ) : (
                    <span className="text-xs text-gray-500 self-center">{invoiceUnavailableMessage(o)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {order && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-lg mb-1">Order {order.id}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {order.shippingAddress
                  ? `${order.shippingAddress.line}, ${order.shippingAddress.city}`
                  : ''}
              </p>
              <OrderTrackingTimeline order={order} />
              {canDownloadInvoice(order) ? (
                <Button className="w-full mt-4" onClick={() => downloadInvoice(order, settings)}>Download invoice</Button>
              ) : (
                <p className="text-sm text-center text-gray-500 mt-4">{invoiceUnavailableMessage(order)}</p>
              )}
              <Button variant="outline" className="w-full mt-2" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

