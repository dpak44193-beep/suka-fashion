import type { CatalogProduct } from '../types/catalog';
import type { Product } from '../store/slices/productsSlice';

export function catalogToStorefrontProduct(p: CatalogProduct): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    mrp: p.mrp,
    image: p.image,
    images: p.images.length ? p.images.slice(0, 4) : [p.image],
    video: p.video,
    rating: p.rating,
    reviews: p.reviews,
    description: p.description,
    category: p.category,
    sizes: p.sizes,
    colors: p.colors,
    stock: p.stock,
    featured: p.featured,
    new: p.new,
  };
}

export function launchedProducts(products: CatalogProduct[]): CatalogProduct[] {
  return products.filter((p) => p.status === 'active');
}

