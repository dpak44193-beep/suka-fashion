import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { clearCart } from '../store/slices/cartSlice';
import { placeOrder } from '../store/slices/catalogSlice';
import { normalizeOrder } from '../lib/orderHelpers';
import { Button } from '../components/common/Button';
import { toast } from 'sonner';

const steps = ['Address', 'Payment', 'Review', 'Confirmation'] as const;

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((s: RootState) => s.cart);
  const settings = useSelector((s: RootState) => s.catalog.settings);
  const coupons = useSelector((s: RootState) => s.catalog.coupons);
  const { user } = useSelector((s: RootState) => s.auth);
  const [step, setStep] = useState(0);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState('UPI');
  const [delivery, setDelivery] = useState('Standard');
  const [address, setAddress] = useState({ line: '', city: '', pin: '', phone: '' });
  const [placedOrderId, setPlacedOrderId] = useState('');

  const deliveryFee = total >= settings.freeShippingMin ? 0 : delivery === 'Express' ? settings.expressShipping : settings.standardShipping;
  const grandTotal = Math.max(0, total - discount + deliveryFee);
  const isCod = payment === 'COD';

  const applyCoupon = () => {
    const c = coupons.find((x) => x.code === coupon.toUpperCase() && x.active);
    if (!c) { toast.error('Invalid coupon'); return; }
    if (total < c.minOrder) { toast.error(`Min order ₹${c.minOrder}`); return; }
    const off = c.type === 'percent' ? Math.round(total * (c.value / 100)) : c.type === 'flat' ? c.value : c.type === 'shipping' ? deliveryFee : 0;
    setDiscount(off);
    toast.success('Coupon applied');
  };

  const submitOrder = () => {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const order = normalizeOrder({
      id: orderId,
      customerId: user?.id ?? `guest-${Date.now()}`,
      customerName: user?.name ?? 'Guest',
      customerEmail: user?.email ?? '',
      customerPhone: address.phone,
      shippingAddress: { line: address.line, city: address.city, pin: address.pin },
      items: items.map((i) => ({
        productId: i.id,
        name: i.name,
        qty: i.quantity,
        price: i.price,
        size: i.size,
        color: i.color,
      })),
      subtotal: total,
      discount,
      deliveryFee,
      total: grandTotal,
      paymentMethod: payment,
      paymentStatus: isCod ? 'pending' : 'paid',
      trackingStage: 'order_confirmed',
      invoiceReleased: !isCod,
      createdAt: new Date().toISOString(),
    });
    dispatch(placeOrder(order));
    dispatch(clearCart());
    setPlacedOrderId(orderId);
    setStep(3);
    toast.success('Order placed! Track it under My Orders.');
  };

  if (!items.length && step < 3) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Button onClick={() => navigate('/shop')}>Cart is empty — shop now</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-6 sm:py-8">
      <div className="container mx-auto split-layout">
        <div className="min-w-0">
          <h1 className="text-page-title font-bold mb-4 sm:mb-6">Checkout</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 sm:mb-8">
            {steps.map((s, i) => (
              <div key={s} className={`text-center py-2 px-1 rounded-lg text-xs sm:text-sm ${i <= step ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-white border'}`}>{s}</div>
            ))}
          </div>

          {step === 0 && (
            <div className="bg-white rounded-2xl p-6 space-y-3 border">
              <input className="w-full border rounded-xl px-3 py-2" placeholder="Full name" value={user?.name ?? ''} disabled />
              <input className="w-full border rounded-xl px-3 py-2" placeholder="Phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required />
              <input className="w-full border rounded-xl px-3 py-2" placeholder="Address line" value={address.line} onChange={(e) => setAddress({ ...address, line: e.target.value })} required />
              <input className="w-full border rounded-xl px-3 py-2" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
              <input className="w-full border rounded-xl px-3 py-2" placeholder="PIN" value={address.pin} onChange={(e) => setAddress({ ...address, pin: e.target.value })} required />
              <label className="block text-sm font-medium mt-2">Delivery</label>
              {['Standard', 'Express', 'Same Day'].map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="delivery" checked={delivery === d} onChange={() => setDelivery(d)} /> {d}
                </label>
              ))}
              <Button onClick={() => { if (!address.line || !address.phone) { toast.error('Fill address and phone'); return; } setStep(1); }}>Continue to payment</Button>
            </div>
          )}

          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 border space-y-2">
              {['UPI', 'Card', 'Net Banking', 'COD', 'Wallet'].map((p) => (
                <label key={p} className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer">
                  <input type="radio" name="pay" checked={payment === p} onChange={() => setPayment(p)} /> {p}
                  {p === 'COD' && <span className="text-xs text-gray-500 ml-auto">Invoice after delivery</span>}
                </label>
              ))}
              <Button onClick={() => setStep(2)}>Review order</Button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl p-6 border">
              <p className="text-sm mb-2"><strong>Deliver to:</strong> {address.line}, {address.city} {address.pin}</p>
              <p className="text-sm mb-2"><strong>Phone:</strong> {address.phone}</p>
              <p className="text-sm mb-4"><strong>Payment:</strong> {payment}{!isCod && ' (invoice after payment)'}</p>
              <Button onClick={submitOrder}>Place order · ₹{grandTotal}</Button>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-2xl p-8 border text-center">
              <h2 className="text-2xl font-bold text-green-700 mb-2">Order confirmed!</h2>
              <p className="text-gray-600 mb-1">Order ID: <strong>{placedOrderId}</strong></p>
              <p className="text-sm text-gray-500 mb-4">
                {isCod
                  ? 'COD order — track shipment updates in My Orders. Invoice after delivery.'
                  : 'Payment received — you can download your invoice now.'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button onClick={() => navigate('/orders')}>View orders & tracking</Button>
                <Button variant="outline" onClick={() => navigate(`/track-order?order=${placedOrderId}`)}>Track order</Button>
              </div>
            </div>
          )}
        </div>

        <aside className="bg-white rounded-2xl p-4 sm:p-6 border h-fit lg:sticky lg:top-24 w-full min-w-0">
          <h3 className="font-bold mb-4">Order summary</h3>
          {items.map((i) => (
            <div key={`${i.id}-${i.size}`} className="flex justify-between text-sm py-1">
              <span>{i.name} × {i.quantity}</span>
              <span>₹{i.price * i.quantity}</span>
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <input className="flex-1 border rounded-lg px-2 py-1 text-sm" placeholder="Coupon" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
            <Button size="sm" variant="outline" onClick={applyCoupon}>Apply</Button>
          </div>
          <div className="border-t mt-4 pt-4 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{total}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{discount}</span></div>}
            <div className="flex justify-between"><span>Delivery</span><span>₹{deliveryFee}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{grandTotal}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
};

