import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { RootState } from '../../store/store';
import { deleteCategory, upsertCategory } from '../../store/slices/catalogSlice';
import type { CategoryNode } from '../../types/catalog';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Button } from '../../components/common/Button';
import { toast } from 'sonner';

export const AdminCategoriesPage: React.FC = () => {
  const dispatch = useDispatch();
  const categories = useSelector((s: RootState) => s.catalog.categories);
  const [editing, setEditing] = useState<CategoryNode | null>(null);

  const roots = categories.filter((c) => !c.parentId).sort((a, b) => a.order - b.order);
  const children = (parentId: string) => categories.filter((c) => c.parentId === parentId).sort((a, b) => a.order - b.order);

  const save = () => {
    if (!editing?.name.trim()) return;
    dispatch(upsertCategory(editing));
    toast.success('Category saved');
    setEditing(null);
  };

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Category Management"
        subtitle="Tree hierarchy for storefront navigation"
        action={<Button size="sm" onClick={() => setEditing({ id: `cat-${Date.now()}`, name: '', parentId: null, order: roots.length })}><Plus className="w-4 h-4" /> Add category</Button>}
      />

      <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
        {roots.map((root) => (
          <div key={root.id} className="mb-4">
            <div className="flex items-center gap-3 py-2 font-semibold">
              {root.image && <img src={root.image} alt="" className="w-10 h-10 rounded object-cover" />}
              <span>{root.name}</span>
              <button type="button" onClick={() => setEditing(root)} className="p-1 hover:bg-gray-100 rounded"><Pencil className="w-4 h-4" /></button>
              <button type="button" onClick={() => dispatch(deleteCategory(root.id))} className="p-1 text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="ml-8 border-l-2 border-[var(--primary-light)] pl-4">
              {children(root.id).map((child) => (
                <div key={child.id} className="flex items-center gap-2 py-1 text-sm text-gray-700">
                  └ {child.name}
                  <button type="button" onClick={() => setEditing(child)}><Pencil className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-3">
            <h3 className="font-bold">Edit category</h3>
            <input className="w-full border rounded-xl px-3 py-2" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Name" />
            <select className="w-full border rounded-xl px-3 py-2" value={editing.parentId ?? ''} onChange={(e) => setEditing({ ...editing, parentId: e.target.value || null })}>
              <option value="">Top level</option>
              {roots.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <input className="w-full border rounded-xl px-3 py-2" value={editing.banner ?? editing.image ?? ''} onChange={(e) => setEditing({ ...editing, banner: e.target.value })} placeholder="Banner image URL" />
            <input type="number" className="w-full border rounded-xl px-3 py-2" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
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

