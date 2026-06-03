import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { RootState } from '../../store/store';
import { Product } from '../../store/slices/productsSlice';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        size: product.sizes[0],
        color: product.colors[0],
      }),
    );
    toast.success('Added to cart!');
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        size: product.sizes[0],
        color: product.colors[0],
      }),
    );
    navigate('/checkout');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      toggleWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        rating: product.rating,
      }),
    );
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-[3/4]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.new && (
              <span className="bg-[var(--accent)] text-white px-3 py-1 rounded-full text-xs font-semibold">New</span>
            )}
            {discount > 0 && (
              <span className="bg-[var(--destructive)] text-white px-3 py-1 rounded-full text-xs font-semibold">
                {discount}% OFF
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-[var(--primary-dark)]" style={{ fontFamily: 'var(--font-body)' }}>
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.reviews})</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-accent)' }}>
            ₹{product.price.toLocaleString()}
          </span>
          {product.mrp > product.price && (
            <span className="text-sm text-gray-500 line-through">₹{product.mrp.toLocaleString()}</span>
          )}
        </div>

        <div className="mt-auto flex gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-2.5 font-semibold text-[#1A1A1A] text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            style={{
              background: 'linear-gradient(145deg, #c4e0d2, #a6c8b6)',
              borderRadius: '10px',
              boxShadow: 'inset 1.5px 1.5px 4px rgba(255,255,255,0.5), inset -1.5px -1.5px 4px rgba(0,0,0,0.07), 0 3px 10px rgba(181,213,197,0.35)',
              border: '1px solid rgba(255,255,255,0.3)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 py-2.5 font-semibold text-[#1A1A1A] text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            style={{
              background: 'linear-gradient(145deg, #d4b87e, #be9a5e)',
              borderRadius: '10px',
              boxShadow: 'inset 1.5px 1.5px 4px rgba(255,255,255,0.45), inset -1.5px -1.5px 4px rgba(0,0,0,0.08), 0 3px 10px rgba(201,169,110,0.35)',
              border: '1px solid rgba(255,255,255,0.3)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

