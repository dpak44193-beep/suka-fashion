import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SlidersHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, applyFilters } from '../store/slices/productsSlice';
import { useStorefrontProducts } from '../hooks/useStorefrontProducts';
import { ProductCard } from '../components/product/ProductCard';
import { RootState } from '../store/store';

export const ShopPage: React.FC = () => {
  useStorefrontProducts();
  const dispatch = useDispatch();
  const { filteredProducts, filters } = useSelector((state: RootState) => state.products);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    dispatch(setFilters({ priceRange: [value[0], value[1]] }));
    dispatch(applyFilters());
  };

  const handleCategoryFilter = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter((c) => c !== category)
      : [...filters.category, category];
    dispatch(setFilters({ category: newCategories }));
    dispatch(applyFilters());
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-6 sm:py-8">
      <div className="container mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-page-title font-bold mb-2">Shop All</h1>
          <p className="text-gray-600">{filteredProducts.length} products found</p>
        </div>

        <div className="toolbar-row mb-6">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--border)] rounded-lg hover:bg-white transition-colors w-full sm:w-auto"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-gray-600 shrink-0">Sort by:</span>
            <select className="flex-1 sm:flex-none px-4 py-2.5 border border-[var(--border)] rounded-lg outline-none min-w-0">
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Best Rated</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>

        <div className="shop-layout">
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="shop-filters"
            >
              <div className="bg-white rounded-2xl p-4 sm:p-6 lg:sticky lg:top-24">
                <h3 className="font-bold text-lg mb-4">Filters</h3>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Category</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                    {['Kurtas', 'Sarees', 'Western', 'Accessories'].map((category) => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                        <input
                          type="checkbox"
                          checked={filters.category.includes(category)}
                          onChange={() => handleCategoryFilter(category)}
                          className="w-4 h-4 accent-[var(--primary)]"
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Price Range</h4>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange([0, parseInt(e.target.value, 10)])}
                    className="w-full accent-[var(--primary)]"
                  />
                  <div className="flex justify-between text-sm mt-2">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        className="px-3 py-2 text-sm border border-[var(--border)] rounded-lg hover:border-[var(--primary)]"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Rating</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer text-sm">
                        <input type="checkbox" className="w-4 h-4 accent-[var(--primary)]" />
                        <span>{rating}+ Stars</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}

          <div className="shop-products">
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 sm:py-20">
                <p className="text-xl sm:text-2xl text-gray-400 mb-4">No products found</p>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
