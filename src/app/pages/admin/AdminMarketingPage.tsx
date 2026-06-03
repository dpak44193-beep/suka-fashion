import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { RootState } from '../../store/store';
import { upsertBanner } from '../../store/slices/catalogSlice';
import type { Banner } from '../../types/catalog';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Button } from '../../components/common/Button';
import { toast } from 'sonner';

export const AdminMarketingPage: React.FC = () => {
  const dispatch = useDispatch();
  const banners = useSelector((s: RootState) => s.catalog.banners);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [newsletter, setNewsletter] = useState('');

  const save = () => {
    if (!editing) return;
    dispatch(upsertBanner(editing));
    toast.success('Banner saved');
    setEditing(null);
  };

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Marketing & Banners"
        action={<Button size="sm" onClick={() => setEditing({ id: `b-${Date.now()}`, title: '', subtitle: '', link: '/shop', image: '', order: banners.length, active: true })}><Plus className="w-4 h-4" /> Add banner</Button>}
      />

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {banners.sort((a, b) => a.order - b.order).map((b) => (
          <div key={b.id} className="bg-white border rounded-2xl overflow-hidden">
            <img src={b.image} alt="" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-bold">{b.title}</h3>
              <p className="text-sm text-gray-600">{b.subtitle}</p>
              <p className="text-xs text-gray-400 mt-1">Order {b.order} · {b.active ? 'Active' : 'Inactive'}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => setEditing(b)}>Edit</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-2xl p-6">
        <h3 className="font-bold mb-2">Newsletter (SMTP stub)</h3>
        <textarea className="w-full border rounded-xl px-3 py-2 mb-2" rows={4} value={newsletter} onChange={(e) => setNewsletter(e.target.value)} placeholder="Compose email to subscribers..." />
        <Button size="sm" onClick={() => toast.success('Newsletter queued (connect SMTP in production)')}>Send newsletter</Button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-3">
            <input className="w-full border rounded-xl px-3 py-2" placeholder="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            <input className="w-full border rounded-xl px-3 py-2" placeholder="Subtitle" value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
            <input className="w-full border rounded-xl px-3 py-2" placeholder="Link" value={editing.link} onChange={(e) => setEditing({ ...editing, link: e.target.value })} />
            <input className="w-full border rounded-xl px-3 py-2" placeholder="Image URL" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
            <div className="flex gap-2">
              <Button onClick={save}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

