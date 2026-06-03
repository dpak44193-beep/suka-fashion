import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useStorefrontProducts } from '../hooks/useStorefrontProducts';
import { ProductCard } from '../components/product/ProductCard';

export const SearchPage: React.FC = () => {
  useStorefrontProducts();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [input, setInput] = useState(q);
  const [debounced, setDebounced] = useState(q);
  const products = useSelector((s: RootState) => s.products.products);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(input), 300);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => {
    if (debounced) setParams({ q: debounced }, { replace: true });
  }, [debounced, setParams]);

  const results = useMemo(() => {
    if (!debounced.trim()) return [];
    const term = debounced.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term),
    );
  }, [products, debounced]);

  const suggestions = useMemo(() => {
    if (!input.trim()) return [];
    const term = input.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().startsWith(term)).slice(0, 5);
  }, [products, input]);

  return (
    <div className="min-h-screen bg-[var(--background)] py-6 sm:py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>Search</h1>
        <div className="relative max-w-xl mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 border rounded-2xl bg-white"
            autoFocus
          />
          {suggestions.length > 0 && input && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg z-10">
              {suggestions.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="block px-4 py-2 hover:bg-[var(--background)] text-sm">
                  {p.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {debounced && results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-2">No results for &quot;{debounced}&quot;</p>
            <p className="text-sm text-gray-500 mb-6">Did you mean: {products[0]?.category}?</p>
            <h2 className="font-bold mb-4">Recommended for you</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        ) : (
          <div className="product-grid">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

