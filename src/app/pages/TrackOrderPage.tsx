import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { OrderTrackingTimeline } from '../components/order/OrderTrackingTimeline';
import { Button } from '../components/common/Button';

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orders = useSelector((s: RootState) => s.catalog.orders);
  const [orderId, setOrderId] = useState(searchParams.get('order') ?? '');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<(typeof orders)[0] | null | undefined>(undefined);

  useEffect(() => {
    const q = searchParams.get('order');
    if (q) setOrderId(q);
  }, [searchParams]);

  const track = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === orderId.trim().toLowerCase() &&
        o.customerEmail.toLowerCase() === email.trim().toLowerCase(),
    );
    setResult(found ?? null);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-12">
      <div className="container mx-auto max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center" style={{ fontFamily: 'var(--font-display)' }}>Track Order</h1>
        <form onSubmit={track} className="bg-white rounded-2xl p-6 border space-y-3">
          <input className="w-full border rounded-xl px-3 py-2" placeholder="Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} required />
          <input type="email" className="w-full border rounded-xl px-3 py-2" placeholder="Email used at checkout" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" className="w-full">Track</Button>
        </form>

        {result && (
          <div className="mt-6 bg-white rounded-2xl p-6 border">
            <p className="font-mono font-bold text-lg">{result.id}</p>
            <p className="text-sm text-gray-600 mb-4">{result.customerName}</p>
            <OrderTrackingTimeline order={result} />
          </div>
        )}

        {result === null && (
          <p className="text-center text-gray-500 mt-4 text-sm">No order found. Check order ID and email.</p>
        )}
      </div>
    </div>
  );
};

