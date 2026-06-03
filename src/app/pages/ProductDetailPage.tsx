import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Star, ShoppingCart, Truck, RefreshCw, Shield, Minus, Plus, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { Button } from '../components/common/Button';
import { ProductCard } from '../components/product/ProductCard';
import { RootState } from '../store/store';
import { toast } from 'sonner';
import { useStorefrontProducts } from '../hooks/useStorefrontProducts';
import { catalogToStorefrontProduct } from '../lib/catalogHelpers';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  useStorefrontProducts();
  const catalogProducts = useSelector((s: RootState) => s.catalog.products);
  const products = useSelector((s: RootState) => s.products.products);
  const catalogProduct = React.useMemo(
    () => catalogProducts.find((p) => p.id === id && p.status === 'active'),
    [catalogProducts, id]
  );
  const product = React.useMemo(
    () => (catalogProduct ? catalogToStorefrontProduct(catalogProduct) : products.find((p) => p.id === id)),
    [catalogProduct, products, id]
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const productVideo = catalogProduct?.video ?? product?.video;
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlistItems.some(item => item.id === product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      size: selectedSize,
      color: selectedColor,
    }));
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      size: selectedSize,
      color: selectedColor,
    }));
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      rating: product.rating,
    }));
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-6 sm:py-8">
      <div className="container mx-auto">
        <nav className="mb-4 sm:mb-8 text-xs sm:text-sm flex flex-wrap gap-x-1 gap-y-1">
          <Link to="/" className="text-gray-600 hover:text-[var(--primary)]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/shop" className="text-gray-600 hover:text-[var(--primary)]">Shop</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to={`/shop?category=${product.category.toLowerCase()}`} className="text-gray-600 hover:text-[var(--primary)]">
            {product.category}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="split-layout-wide mb-10 sm:mb-16">
          {/* Images */}
          <div>
            <motion.div
              key={showVideo ? 'video' : selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-3xl overflow-hidden mb-4 bg-white"
            >
              {showVideo && productVideo ? (
                <video src={productVideo} controls className="w-full h-full object-contain bg-black" />
              ) : (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-4 max-w-full">
              {product.images.slice(0, 4).map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => { setShowVideo(false); setSelectedImage(index); }}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    !showVideo && selectedImage === index ? 'border-[var(--primary)]' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {productVideo && (
                <button
                  type="button"
                  onClick={() => setShowVideo(true)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center bg-gray-900 text-white text-xs font-semibold ${
                    showVideo ? 'border-[var(--primary)]' : 'border-transparent'
                  }`}
                >
                  Video
                </button>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            {product.new && (
              <span className="inline-block px-3 py-1 bg-[var(--accent)] text-white rounded-full text-sm font-semibold mb-3">
                New Arrival
              </span>
            )}

            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-accent)' }}>
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-2xl text-gray-500 line-through">
                ₹{product.mrp.toLocaleString()}
              </span>
              <span className="px-3 py-1 bg-[var(--destructive)] text-white rounded-full font-semibold">
                {discount}% OFF
              </span>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block font-semibold mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                Color: <span className="text-[var(--primary)]">{selectedColor}</span>
              </label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 rounded-lg transition-all ${
                      selectedColor === color ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--border)]'
                    }`}
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold" style={{ fontFamily: 'var(--font-body)' }}>
                  Size: <span className="text-[var(--primary)]">{selectedSize}</span>
                </label>
                <button className="text-sm text-[var(--primary)] hover:underline">Size Guide</button>
              </div>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 border-2 rounded-lg font-semibold transition-all ${
                      selectedSize === size ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--border)]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block font-semibold mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-[var(--border)] rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 hover:bg-gray-100 transition-colors rounded-l-xl"
                  >
                    <Minus className="w-5 h-5 mx-auto" />
                  </button>
                  <span className="w-16 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 hover:bg-gray-100 transition-colors rounded-r-xl"
                  >
                    <Plus className="w-5 h-5 mx-auto" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Only {product.stock} left in stock!
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 font-semibold text-[#1A1A1A] text-base tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  background: 'linear-gradient(145deg, #c4e0d2, #a6c8b6)',
                  borderRadius: '14px',
                  boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.5), inset -2px -2px 5px rgba(0,0,0,0.08), 0 4px 15px rgba(181,213,197,0.4)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 font-semibold text-[#1A1A1A] text-base tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  background: 'linear-gradient(145deg, #d4b87e, #be9a5e)',
                  borderRadius: '14px',
                  boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.45), inset -2px -2px 5px rgba(0,0,0,0.1), 0 4px 15px rgba(201,169,110,0.4)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </button>
              <button
                onClick={handleToggleWishlist}
                className="flex items-center justify-center w-14 h-14 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #eeeee9)',
                  borderRadius: '14px',
                  boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.7), inset -2px -2px 5px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(224,224,216,0.6)',
                }}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-[var(--border)]">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-[var(--primary)]" />
                <p className="text-xs text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                  Free Shipping<br/>above ₹999
                </p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-[var(--primary)]" />
                <p className="text-xs text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                  7 Day<br/>Returns
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-[var(--primary)]" />
                <p className="text-xs text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                  100%<br/>Authentic
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-[var(--border)] mb-6">
            {['description', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-4 font-semibold capitalize transition-colors ${
                  activeTab === tab ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]' : 'text-gray-600'
                }`}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8">
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-700 leading-relaxed mb-6" style={{ fontFamily: 'var(--font-body)' }}>
                  {product.description}
                </p>
                <ul className="space-y-2 text-gray-700" style={{ fontFamily: 'var(--font-body)' }}>
                  <li>• Premium quality fabric</li>
                  <li>• Handcrafted with attention to detail</li>
                  <li>• Perfect for festive occasions</li>
                  <li>• Easy to maintain and long-lasting</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-gray-700">
                <p style={{ fontFamily: 'var(--font-body)' }}>No reviews yet. Be the first to review this product!</p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="text-gray-700" style={{ fontFamily: 'var(--font-body)' }}>
                <p className="mb-4">Free shipping on orders above ₹999</p>
                <p className="mb-4">Standard delivery: 3-5 business days</p>
                <p>Express delivery: 1-2 business days (additional charges apply)</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

