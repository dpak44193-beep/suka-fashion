import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { RootState } from '../../store/store';
import { upsertCoupon } from '../../store/slices/catalogSlice';
import type { Coupon } from '../../types/catalog';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Button } from '../../components/common/Button';
import { toast } from 'sonner';

export const AdminOffersPage: React.FC = () => {
  const dispatch = useDispatch();
  const coupons = useSelector((s: RootState) => s.catalog.coupons);
  const [form, setForm] = useState<Partial<Coupon> | null>(null);

  const save = () => {
    if (!form?.code) return;
    dispatch(upsertCoupon({
      id: form.id ?? `cp-${Date.now()}`,
      code: form.code.toUpperCase(),
      type: form.type ?? 'percent',
      value: form.value ?? 10,
      minOrder: form.minOrder ?? 0,
      usageLimit: form.usageLimit ?? 100,
      used: form.used ?? 0,
      expiresAt: form.expiresAt ?? '2026-12-31',
      active: form.active ?? true,
    }));
    toast.success('Coupon saved');
    setForm(null);
  };

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Coupons & Offers"
        subtitle="Percent off, flat off, free shipping, flash sales"
        action={<Button size="sm" onClick={() => setForm({ type: 'percent', value: 10, active: true })}><Plus className="w-4 h-4" /> Create coupon</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white border rounded-2xl p-5">
            <div className="flex justify-between">
              <span className="font-mono font-bold text-lg">{c.code}</span>
              <span className={`text-xs px-2 py-1 rounded ${c.active ? 'bg-green-100' : 'bg-gray-100'}`}>{c.active ? 'Active' : 'Off'}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2 capitalize">{c.type} · {c.type === 'percent' ? `${c.value}%` : `₹${c.value}`} · Min ₹{c.minOrder}</p>
            <p className="text-xs text-gray-500 mt-1">Used {c.used}/{c.usageLimit} · Expires {c.expiresAt}</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => setForm(c)}>Edit</Button>
          </div>
        ))}
      </div>

      <div className="bg-[var(--background)] rounded-2xl p-6 border">
        <h3 className="font-bold mb-2">Flash sale scheduler</h3>
        <p className="text-sm text-gray-600 mb-3">Schedule category-wide discounts (demo stub).</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <input type="datetime-local" className="border rounded-xl px-3 py-2 text-sm" />
          <input type="datetime-local" className="border rounded-xl px-3 py-2 text-sm" />
          <input type="number" placeholder="Discount %" className="border rounded-xl px-3 py-2 text-sm" />
        </div>
        <Button className="mt-3" size="sm" onClick={() => toast.success('Flash sale scheduled')}>Schedule</Button>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-3">
            <input className="w-full border rounded-xl px-3 py-2" placeholder="Code" value={form.code ?? ''} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            <select className="w-full border rounded-xl px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Coupon['type'] })}>
              <option value="percent">Percent off</option>
              <option value="flat">Flat off</option>
              <option value="shipping">Free shipping</option>
              <option value="bogo">BOGO</option>
            </select>
            <input type="number" className="w-full border rounded-xl px-3 py-2" placeholder="Value" value={form.value ?? ''} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
            <input type="number" className="w-full border rounded-xl px-3 py-2" placeholder="Min order" value={form.minOrder ?? ''} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} />
            <input type="date" className="w-full border rounded-xl px-3 py-2" value={form.expiresAt?.slice(0, 10)} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
            <div className="flex gap-2">
              <Button onClick={save}>Save</Button>
              <Button variant="outline" onClick={() => setForm(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

