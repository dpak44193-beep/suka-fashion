import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Shield, RefreshCw, Sparkles, Star, TrendingUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import { categories, testimonials } from '../data/mockData';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/common/Button';
import { RootState } from '../store/store';
import { useStorefrontProducts } from '../hooks/useStorefrontProducts';

export const HomePage: React.FC = () => {
  useStorefrontProducts();
  const products = useSelector((state: RootState) => state.products.products);
  const banners = useSelector((state: RootState) => state.catalog.banners);
  const activeBanners = React.useMemo(() => banners.filter((b) => b.active), [banners]);
  const hero = activeBanners[0];

  const featuredProducts = React.useMemo(() => products.filter((p) => p.featured).slice(0, 4), [products]);
  const newArrivals = React.useMemo(() => products.filter((p) => p.new).slice(0, 4), [products]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary-light)] to-white page-section">
        <div className="container mx-auto">
          <div className="split-layout-wide items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full text-sm font-semibold mb-6"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                ✨ {hero?.title ?? 'New Spring Collection 2026'}
              </motion.span>

              <h1 className="text-hero font-bold mb-4 sm:mb-6 text-gray-900">
                Elegance
                <br />
                <span className="text-[var(--primary-dark)]">Redefined</span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-lg">
                Discover handpicked styles that blend tradition with contemporary fashion. Curated exclusively for the modern woman.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/shop">
                  <Button size="lg">
                    Shop the Collection
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/shop?filter=new">
                  <Button variant="outline" size="lg">
                    New Arrivals
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
                  alt="Suka Fashions Hero"
                  className="w-full h-48 sm:h-72 md:h-96 lg:h-[28rem] object-cover"
                />
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="hidden sm:block absolute top-6 left-2 lg:top-10 lg:-left-6 bg-white rounded-2xl p-3 sm:p-4 shadow-xl max-w-[200px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-accent)' }}>10K+</p>
                    <p className="text-sm text-gray-600">Happy Customers</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg" style={{ fontFamily: 'var(--font-body)' }}>
              Explore our curated collections
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/shop?category=${category.id}`}>
                  <div className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <h3 className="text-white text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[var(--background)]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Featured Collection
            </h2>
            <p className="text-gray-600 text-lg" style={{ fontFamily: 'var(--font-body)' }}>
              Handpicked styles just for you
            </p>
          </motion.div>

          <div className="product-grid mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/shop">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-[var(--primary-light)] to-white"
            >
              <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Secure Payments
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                100% secure transactions with encrypted checkout
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-[var(--primary-light)] to-white"
            >
              <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Easy Returns
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                7-day return policy for hassle-free exchanges
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-[var(--primary-light)] to-white"
            >
              <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Handpicked Styles
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                Curated collection of authentic fashion pieces
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[var(--background)]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Join Our Fashion Community
          </h2>
          <p className="text-white/90 mb-8 text-lg" style={{ fontFamily: 'var(--font-body)' }}>
            Subscribe for exclusive offers and style updates
          </p>
          <form className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full outline-none"
              style={{ fontFamily: 'var(--font-body)' }}
            />
            <Button type="submit" variant="secondary" size="lg">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

