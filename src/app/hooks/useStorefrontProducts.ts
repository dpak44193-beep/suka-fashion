import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setProducts, applyFilters } from '../store/slices/productsSlice';
import { catalogToStorefrontProduct, launchedProducts } from '../lib/catalogHelpers';

/** Sync only launched (active) products to customer-facing Redux catalog. */
export function useStorefrontProducts() {
  const dispatch = useDispatch();
  const catalogProducts = useSelector((s: RootState) => s.catalog.products);

  useEffect(() => {
    const active = launchedProducts(catalogProducts).map(catalogToStorefrontProduct);
    dispatch(setProducts(active));
    dispatch(applyFilters());
  }, [catalogProducts, dispatch]);

  return launchedProducts(catalogProducts);
}

export function useCatalogProduct(id: string | undefined) {
  const catalogProducts = useSelector((s: RootState) => s.catalog.products);
  return catalogProducts.find((p) => p.id === id && p.status === 'active');
}

