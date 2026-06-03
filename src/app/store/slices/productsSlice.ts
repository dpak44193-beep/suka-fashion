import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  images: string[];
  video?: string;
  rating: number;
  reviews: number;
  description: string;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  featured?: boolean;
  new?: boolean;
}

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  filters: {
    category: string[];
    priceRange: [number, number];
    sizes: string[];
    colors: string[];
    rating: number;
  };
  sortBy: string;
}

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  loading: false,
  filters: {
    category: [],
    priceRange: [0, 10000],
    sizes: [],
    colors: [],
    rating: 0,
  },
  sortBy: 'newest',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ProductsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    applyFilters: (state) => {
      let filtered = [...state.products];

      // Apply category filter
      if (state.filters.category.length > 0) {
        filtered = filtered.filter(p => state.filters.category.includes(p.category));
      }

      // Apply price range filter
      filtered = filtered.filter(
        p => p.price >= state.filters.priceRange[0] && p.price <= state.filters.priceRange[1]
      );

      // Apply rating filter
      if (state.filters.rating > 0) {
        filtered = filtered.filter(p => p.rating >= state.filters.rating);
      }

      state.filteredProducts = filtered;
    },
  },
});

export const { setProducts, setFilters, setSortBy, applyFilters } = productsSlice.actions;
export default productsSlice.reducer;

