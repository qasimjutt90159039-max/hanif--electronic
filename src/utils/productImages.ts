import { Product } from '../types';

/**
 * Returns a robust, guaranteed image URL for any product.
 * Prioritizes custom SVGs in public/images/products/${slug}.svg
 */
export function getProductImageUrl(product?: Partial<Product> | null): string {
  if (!product) {
    return '/images/products/test.svg';
  }

  // 1. If slug is available and local image exists
  if (product.slug) {
    return `/images/products/${product.slug}.svg`;
  }

  // 2. If thumbnail is non-unsplash local URL
  if (product.thumbnail && !product.thumbnail.includes('unsplash.com')) {
    return product.thumbnail;
  }

  // 3. If image array has valid entry
  if (product.images && product.images[0] && !product.images[0].includes('unsplash.com')) {
    return product.images[0];
  }

  return '/images/products/test.svg';
}

export function handleProductImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, product?: Partial<Product> | null) {
  const target = e.target as HTMLImageElement;
  if (product?.slug) {
    const localSvg = `/images/products/${product.slug}.svg`;
    if (!target.src.includes(localSvg)) {
      target.src = localSvg;
      return;
    }
  }
}
