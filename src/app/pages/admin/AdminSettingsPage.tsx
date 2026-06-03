import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateSettings } from '../../store/slices/catalogSlice';
import { getRoleLabel } from '../../lib/auth';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Button } from '../../components/common/Button';
import { toast } from 'sonner';

export const AdminSettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);
  const settings = useSelector((s: RootState) => s.catalog.settings);
  const [form, setForm] = useState(settings);

  const save = () => {
    dispatch(updateSettings(form));
    toast.success('Settings saved');
  };

  return (
    <div className="admin-page max-w-3xl mx-auto">
      <AdminPageHeader title="Settings" subtitle="Store, shipping, tax, payments, policies" />

      <div className="bg-[var(--background)] rounded-2xl p-4 mb-6 border">
        <p className="text-sm text-gray-500">Logged in as</p>
        <p className="font-semibold">{user?.name} · {user?.email}</p>
        <span className="inline-block mt-1 text-xs px-2 py-1 rounded bg-[var(--primary)]">{user?.role ? getRoleLabel(user.role) : ''}</span>
      </div>

      <section className="bg-white border rounded-2xl p-6 mb-6 space-y-3">
        <h3 className="font-bold">Store info</h3>
        <input className="w-full border rounded-xl px-3 py-2" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} placeholder="Store name" />
        <input className="w-full border rounded-xl px-3 py-2" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="Contact email" />
        <input className="w-full border rounded-xl px-3 py-2" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} placeholder="Phone" />
        <input className="w-full border rounded-xl px-3 py-2" value={form.socialInstagram} onChange={(e) => setForm({ ...form, socialInstagram: e.target.value })} placeholder="Instagram" />
        <input className="w-full border rounded-xl px-3 py-2" value={form.socialFacebook} onChange={(e) => setForm({ ...form, socialFacebook: e.target.value })} placeholder="Facebook" />
      </section>

      <section className="bg-white border rounded-2xl p-6 mb-6 space-y-3">
        <h3 className="font-bold">Shipping & tax</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input type="number" className="border rounded-xl px-3 py-2" value={form.standardShipping} onChange={(e) => setForm({ ...form, standardShipping: Number(e.target.value) })} placeholder="Standard ₹" />
          <input type="number" className="border rounded-xl px-3 py-2" value={form.expressShipping} onChange={(e) => setForm({ ...form, expressShipping: Number(e.target.value) })} placeholder="Express ₹" />
          <input type="number" className="border rounded-xl px-3 py-2" value={form.freeShippingMin} onChange={(e) => setForm({ ...form, freeShippingMin: Number(e.target.value) })} placeholder="Free shipping min" />
          <input type="number" className="border rounded-xl px-3 py-2" value={form.gstRate} onChange={(e) => setForm({ ...form, gstRate: Number(e.target.value) })} placeholder="GST %" />
        </div>
      </section>

      <section className="bg-white border rounded-2xl p-6 mb-6 space-y-3">
        <h3 className="font-bold">Payment keys (masked)</h3>
        <input className="w-full border rounded-xl px-3 py-2 font-mono text-sm" value={form.razorpayKey} onChange={(e) => setForm({ ...form, razorpayKey: e.target.value })} />
        <input className="w-full border rounded-xl px-3 py-2 font-mono text-sm" value={form.stripeKey} onChange={(e) => setForm({ ...form, stripeKey: e.target.value })} />
      </section>

      <section className="bg-white border rounded-2xl p-6 mb-6">
        <h3 className="font-bold mb-2">Return & refund policy</h3>
        <textarea className="w-full border rounded-xl px-3 py-2" rows={5} value={form.returnPolicy} onChange={(e) => setForm({ ...form, returnPolicy: e.target.value })} />
      </section>

      <Button onClick={save}>Save settings</Button>
    </div>
  );
};

