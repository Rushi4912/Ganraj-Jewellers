import { Product, UserReview } from '../types/product';

type Nullable<T> = T | null | undefined;

const ALLOWED_CATEGORIES = new Set<Product['category']>([
  'rings',
  'necklaces',
  'earrings',
  'bracelets',
]);

const toNumber = (value: Nullable<string | number>, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toOptionalNumber = (value: Nullable<string | number>): number | undefined => {
  if (value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalizeImages = (images: Nullable<string[]>, fallbackImage?: string): string[] => {
  if (Array.isArray(images) && images.length > 0) {
    return images.filter(Boolean);
  }
  return fallbackImage ? [fallbackImage] : [];
};

const normalizeReviews = (reviews: Nullable<UserReview[]>): UserReview[] => {
  if (Array.isArray(reviews)) {
    return reviews as UserReview[];
  }
  return [];
};

export type SupabaseProductRecord = {
  id?: number | string;
  name?: string;
  category?: string | null;
  slug?: string | null;
  price?: string | number | null;
  discount_price?: string | number | null;
  rating?: number | string | null;
  reviews?: number | string | null;
  reviews_count?: number | string | null;
  image?: string | null;
  images?: string[] | null;
  badge?: string | null;
  is_featured?: boolean | null;
  description?: string | null;
  stock?: number | null;
  user_reviews?: UserReview[] | null;
  variants?: Product['variants'];
};

export const transformSupabaseProduct = (
  item: SupabaseProductRecord,
  fallbackIndex = 0
): Product => {
  const hasDiscount = item.discount_price != null;
  const price = hasDiscount
    ? toNumber(item.discount_price, toNumber(item.price, 0))
    : toNumber(item.price, 0);
  const originalPriceValue = hasDiscount ? toOptionalNumber(item.price) : undefined;

  const categoryCandidate = (item.category ?? '').toLowerCase() as Product['category'];
  const category = ALLOWED_CATEGORIES.has(categoryCandidate) ? categoryCandidate : 'rings';

  const images = normalizeImages(item.images, item.image ?? undefined);
  const primaryImage = images[0] ?? item.image ?? '';

  const computedReviews =
    Number(item.reviews) ||
    Number(item.reviews_count) ||
    Math.floor(Math.random() * 90) + 10;

  const computedRating = Number(item.rating) || 4.6;

  return {
    id: toNumber(item.id, fallbackIndex + 1),
    remoteId: item.id != null ? String(item.id) : undefined,
    slug: item.slug ?? undefined,
    name: item.name ?? 'Untitled masterpiece',
    category,
    price,
    originalPrice: originalPriceValue,
    rating: computedRating,
    reviews: computedReviews,
    image: primaryImage,
    images,
    badge: item.discount_price != null ? 'SALE' : item.is_featured ? 'NEW' : null,
    description: item.description ?? 'Beautiful handcrafted jewelry piece.',
    inStock: item.stock == null ? true : item.stock > 0,
    userReviews: normalizeReviews(item.user_reviews),
    variants: item.variants ?? undefined,
  };
};

export const transformSupabaseProductList = (
  records: SupabaseProductRecord[] | null | undefined
): Product[] => {
  if (!records) return [];
  return records.map((record, index) => transformSupabaseProduct(record, index));
};
