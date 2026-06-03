import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { RootState } from '../store/store';
import { Button } from '../components/common/Button';
import { toast } from 'sonner';

export const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success('Removed from cart');
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const deliveryCharge = total > 999 ? 0 : 99;
  const discount = total > 2000 ? total * 0.1 : 0;
  const finalTotal = total + deliveryCharge - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-[var(--primary-light)] rounded-full flex items-center justify-center mb-6"
        >
          <ShoppingBag className="w-12 h-12 text-[var(--primary)]" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8" style={{ fontFamily: 'var(--font-body)' }}>
          Start adding some beautiful items to your cart!
        </p>
        <Link to="/shop">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-6 sm:py-8">
      <div className="container mx-auto">
        <h1 className="text-page-title font-bold mb-6 sm:mb-8">
          Shopping Cart ({items.length} items)
        </h1>

        <div className="split-layout-cart">
          {/* Cart Items */}
          <div className="space-y-4 min-w-0">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-xl shrink-0"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                    {item.name}
                  </h3>
                  {item.size && (
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                  )}
                  {item.color && (
                    <p className="text-sm text-gray-600">Color: {item.color}</p>
                  )}

                  <div className="flex items-center gap-4 mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 border border-[var(--border)] rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 rounded-l-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 rounded-r-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-accent)' }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">₹{item.price} each</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="min-w-0">
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span style={{ fontFamily: 'var(--font-body)' }}>Subtotal</span>
                  <span className="font-semibold">₹{total.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span style={{ fontFamily: 'var(--font-body)' }}>Discount (10%)</span>
                    <span className="font-semibold">-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span style={{ fontFamily: 'var(--font-body)' }}>Delivery</span>
                  <span className={`font-semibold ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>

                {total < 999 && deliveryCharge > 0 && (
                  <p className="text-xs text-gray-600 bg-[var(--primary-light)] p-2 rounded">
                    Add ₹{(999 - total).toLocaleString()} more for free delivery!
                  </p>
                )}

                <div className="border-t border-[var(--border)] pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span style={{ fontFamily: 'var(--font-display)' }}>Total</span>
                    <span style={{ fontFamily: 'var(--font-accent)' }}>
                      ₹{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Link to="/checkout">
                <Button size="lg" className="w-full mb-3">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link to="/shop">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>

              {/* Coupon */}
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                  Have a coupon code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--primary)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                  <Button variant="outline">Apply</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

