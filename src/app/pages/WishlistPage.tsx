import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { useStorefrontProducts } from '../hooks/useStorefrontProducts';
import { Button } from '../components/common/Button';
import { toast } from 'sonner';

export const WishlistPage: React.FC = () => {
  useStorefrontProducts();
  const dispatch = useDispatch();
  const wishlist = useSelector((s: RootState) => s.wishlist.items);
  const products = useSelector((s: RootState) => s.products.products);

  const items = wishlist
    .map((w) => products.find((p) => p.id === w.id))
    .filter(Boolean);

  if (!items.length) {
    return (
      <div className="min-h-screen bg-[var(--background)] py-16 text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>My Wishlist</h1>
        <p className="text-gray-600 mb-6">Your wishlist is empty.</p>
        <Link to="/shop"><Button>Start Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>My Wishlist</h1>
          <button type="button" className="text-sm text-[var(--primary-dark)]" onClick={() => toast.info('Share link: suka.app/wishlist/demo')}>
            Share wishlist
          </button>
        </div>
        <div className="product-grid sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => p && (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden border">
              <img src={p.image} alt={p.name} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-[var(--accent)] font-bold mt-1" style={{ fontFamily: 'var(--font-accent)' }}>₹{p.price}</p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => { dispatch(addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, quantity: 1 })); toast.success('Moved to cart'); }}>Move to cart</Button>
                  <Button size="sm" variant="outline" onClick={() => dispatch(removeFromWishlist(p.id))}>Remove</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

