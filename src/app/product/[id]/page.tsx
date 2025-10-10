// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

import { notFound } from 'next/navigation';
import { fetchProductById } from '@/lib/dummyjson';
import { normalizeProduct } from '@/lib/productAdapter';
import { formatCurrency } from '@/lib/formatting';
import ImageCarousel from '@/app/(components)/ImageCarousel';
import RatingDisplay from '@/app/(components)/RatingDisplay';

/**
 * Product detail page.
 */
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (process.env.NODE_ENV !== 'production') {
    console.log('ProductPage: server rendering for id', id);
  }

  const productId = parseInt(id, 10);
  if (!id || isNaN(productId)) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('ProductPage: invalid id', id);
    }
    notFound();
  }

  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[PERF] Starting fetch for product ${productId}`);
    }

    const data = await fetchProductById(productId);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[PERF] Fetched data for product ${productId}, starting normalization`);
    }

    const product = normalizeProduct(data);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[PERF] Normalized product ${product.title}, preparing render`);
      console.log(`[VITALS] serverDataReady product ${productId}`);
    }

    return (
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <ImageCarousel images={product.images} title={product.title} />
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            {product.discountPercentage && product.discountPercentage > 0 && (
              <div className="inline-block bg-accent text-white px-2 py-1 rounded mb-2">
                {Math.round(product.discountPercentage)}% off
              </div>
            )}
            <p className="text-2xl font-bold text-accent mb-4">{formatCurrency(product.price)}</p>
            <p className="text-text-muted mb-4">{product.description}</p>

            <div className="space-y-2 mb-6">
              {product.brand && <p><strong>Brand:</strong> {product.brand}</p>}
              {product.category && <p><strong>Category:</strong> {product.category}</p>}
              {product.stock !== null && <p><strong>Stock:</strong> {product.stock}</p>}
              {product.sku && <p><strong>SKU:</strong> {product.sku}</p>}
              {product.weight && <p><strong>Weight:</strong> {product.weight}g</p>}
              {product.dimensions && (
                <p><strong>Dimensions:</strong> {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} cm</p>
              )}
              {product.tags && product.tags.length > 0 && (
                <p><strong>Tags:</strong> {product.tags.join(', ')}</p>
              )}
              {product.warrantyInformation && <p><strong>Warranty:</strong> {product.warrantyInformation}</p>}
              {product.shippingInformation && <p><strong>Shipping:</strong> {product.shippingInformation}</p>}
              {product.availabilityStatus && <p><strong>Availability:</strong> {product.availabilityStatus}</p>}
              {product.returnPolicy && <p><strong>Return Policy:</strong> {product.returnPolicy}</p>}
            </div>

            {/* Rating */}
            <div className="mb-6">
              <RatingDisplay rating={product.rating} />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="border border-border rounded-lg p-4 bg-background">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{review.reviewerName}</span>
                    <div className="flex items-center">
                      <span>{review.rating} 💵</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-muted mb-2">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                  <p className="text-text-muted">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted">No reviews yet.</p>
          )}
        </div>
      </main>
    );
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('ProductPage: error fetching product', productId, err);
    }
    notFound();
  }
}
