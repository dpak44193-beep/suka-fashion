import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Copy, Download, Upload } from 'lucide-react';
import { RootState } from '../../store/store';
import { bulkProductStatus, deleteProduct, upsertProduct } from '../../store/slices/catalogSlice';
import type { CatalogProduct, ProductStatus } from '../../types/catalog';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { ProductMediaUpload } from '../../components/admin/ProductMediaUpload';
import { Button } from '../../components/common/Button';
import { MAX_PRODUCT_PHOTOS } from '../../lib/fileUpload';
import { toast } from 'sonner';

const emptyProduct = (): CatalogProduct => ({
  id: `p-${Date.now()}`,
  name: '',
  sku: '',
  description: '',
  category: 'Kurtas',
  price: 0,
  mrp: 0,
  costPrice: 0,
  image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  images: [],
  rating: 4.5,
  reviews: 0,
  sizes: ['S', 'M', 'L'],
  colors: ['Default'],
  stock: 0,
  variants: [],
  tags: [],
  seoTitle: '',
  seoDescription: '',
  status: 'draft',
});

export const AdminProductsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const products = useSelector((s: RootState) => s.catalog.products);
  const [search, setSearch] = useState(params.get('q') ?? '');
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<CatalogProduct | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') list = list.filter((p) => p.status === statusFilter);
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [products, search, statusFilter]);

  const saveProduct = () => {
    if (!editing?.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    const images = (editing.images.length ? editing.images : editing.image ? [editing.image] : []).slice(0, MAX_PRODUCT_PHOTOS);
    if (!images.length) {
      toast.error(`Add at least 1 photo (max ${MAX_PRODUCT_PHOTOS})`);
      return;
    }
    dispatch(upsertProduct({
      ...editing,
      seoTitle: editing.seoTitle || `${editing.name} | Suka Fashions`,
      images,
      image: images[0],
      video: editing.video,
      stock: editing.variants.reduce((s, v) => s + v.stock, 0) || editing.stock,
    }));
    toast.success('Product saved');
    setShowForm(false);
    setEditing(null);
  };

  const launchSelected = () => {
    dispatch(bulkProductStatus({ ids: selected, status: 'active' }));
    toast.success('Products launched to storefront');
    setSelected([]);
  };

  const exportCsv = () => {
    const header = 'id,name,sku,price,status,category,stock\n';
    const rows = products.map((p) => `${p.id},${p.name},${p.sku},${p.price},${p.status},${p.category},${p.stock}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suka-products.csv';
    a.click();
    toast.success('CSV exported');
  };

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Product Management"
        subtitle="Launch products to the storefront (active status). Drafts are owner-only."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4" /> Export</Button>
            <Button variant="outline" size="sm" onClick={() => toast.info('Import CSV — map columns in production API')}><Upload className="w-4 h-4" /> Import</Button>
            <Button size="sm" onClick={() => { setEditing(emptyProduct()); setShowForm(true); }}><Plus className="w-4 h-4" /> Add Product</Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or SKU..."
          className="border border-[var(--border)] rounded-xl px-4 py-2 text-sm flex-1 min-w-[200px]"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="border rounded-xl px-3 py-2 text-sm">
          <option value="all">All status</option>
          <option value="active">Launched (active)</option>
          <option value="draft">Draft</option>
        </select>
        {selected.length > 0 && (
          <>
            <Button size="sm" onClick={launchSelected}>Launch selected ({selected.length})</Button>
            <Button size="sm" variant="outline" onClick={() => { dispatch(bulkProductStatus({ ids: selected, status: 'draft' })); setSelected([]); }}>Unlaunch</Button>
            <Button size="sm" variant="outline" onClick={() => { selected.forEach((id) => dispatch(deleteProduct(id))); setSelected([]); toast.success('Deleted'); }}>Delete</Button>
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border)] table-scroll">
        <table className="w-full text-sm">
          <thead className="bg-[var(--background)]">
            <tr>
              <th className="p-3"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={(e) => setSelected(e.target.checked ? filtered.map((p) => p.id) : [])} /></th>
              <th className="text-left p-3">Product</th>
              <th className="text-left p-3">SKU</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3"><input type="checkbox" checked={selected.includes(p.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, p.id] : selected.filter((x) => x !== p.id))} /></td>
                <td className="p-3 flex items-center gap-2">
                  <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  {p.name}
                </td>
                <td className="p-3">{p.sku}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    {p.status === 'active' ? 'Launched' : 'Draft'}
                  </span>
                </td>
                <td className="p-3 flex gap-1">
                  <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={() => { setEditing({ ...p }); setShowForm(true); }}><Pencil className="w-4 h-4" /></button>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={() => dispatch(upsertProduct({ ...p, id: `p-${Date.now()}`, name: `${p.name} (Copy)`, sku: `${p.sku}-COPY`, status: 'draft' }))}><Copy className="w-4 h-4" /></button>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded text-red-600" onClick={() => dispatch(deleteProduct(p.id))}><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/50 overflow-y-auto safe-bottom">
          <div className="modal-panel bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4">{editing.id.startsWith('p-') && !products.find((x) => x.id === editing.id) ? 'Add Product' : 'Edit Product'}</h2>
            <div className="grid gap-3">
              <input className="border rounded-xl px-3 py-2" placeholder="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <input className="border rounded-xl px-3 py-2" placeholder="SKU" value={editing.sku} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} />
              <textarea className="border rounded-xl px-3 py-2" rows={3} placeholder="Description" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" className="border rounded-xl px-3 py-2" placeholder="MRP" value={editing.mrp || ''} onChange={(e) => setEditing({ ...editing, mrp: Number(e.target.value) })} />
                <input type="number" className="border rounded-xl px-3 py-2" placeholder="Selling price" value={editing.price || ''} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
                <input type="number" className="border rounded-xl px-3 py-2" placeholder="Cost price" value={editing.costPrice || ''} onChange={(e) => setEditing({ ...editing, costPrice: Number(e.target.value) })} />
                <input type="number" className="border rounded-xl px-3 py-2" placeholder="Stock" value={editing.stock || ''} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} />
              </div>
              <select className="border rounded-xl px-3 py-2" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {['Kurtas', 'Sarees', 'Western', 'Accessories'].map((c) => <option key={c}>{c}</option>)}
              </select>

              <ProductMediaUpload
                images={editing.images.length ? editing.images : editing.image ? [editing.image] : []}
                video={editing.video}
                onImagesChange={(images, primaryImage) =>
                  setEditing({ ...editing, images, image: primaryImage || images[0] || editing.image })
                }
                onVideoChange={(video) => setEditing({ ...editing, video })}
              />

              <input className="border rounded-xl px-3 py-2" placeholder="SEO title" value={editing.seoTitle} onChange={(e) => setEditing({ ...editing, seoTitle: e.target.value })} />
              <textarea className="border rounded-xl px-3 py-2" rows={2} placeholder="SEO description" value={editing.seoDescription} onChange={(e) => setEditing({ ...editing, seoDescription: e.target.value })} />
              <select className="border rounded-xl px-3 py-2" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as ProductStatus })}>
                <option value="draft">Draft (not on store)</option>
                <option value="active">Launched (visible on store)</option>
              </select>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={saveProduct}>Save</Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

