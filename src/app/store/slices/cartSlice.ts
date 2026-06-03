import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const CART_KEY = 'suka_cart';

function loadCart(): CartState {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CartState;
      if (Array.isArray(parsed.items)) return parsed;
    }
  } catch {
    localStorage.removeItem(CART_KEY);
  }
  return { items: [], total: 0 };
}

function persistCart(state: CartState) {
  localStorage.setItem(CART_KEY, JSON.stringify(state));
}

const initialState: CartState = loadCart();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => item.id === action.payload.id &&
                item.size === action.payload.size &&
                item.color === action.payload.color
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      persistCart(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      persistCart(state);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      persistCart(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      persistCart(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

