import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ZoomIn, ZoomOut } from 'lucide-react';
import type { Product, ProductSize } from '../../shared/types.ts';
import { fetchProductBySlug } from '../services/api.ts';
import { useStore } from '../context/StoreContext.tsx';
import { SafeImage } from '../components/common/SafeImage.tsx';
import { EditorialReveal } from '../animations/EditorialReveal.tsx';

function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export function ProductDetailPage() {
  const { slug = 'brand-bible-tee' } = useParams<{ slug: string }>();
  const { addToCart, isUpdatingCart, cartError, clearCartError } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductSize>('M');
  const [quantity, setQuantity] = useState(1);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setActiveImageIdx(0);
    setZoomed(false);
    setQuantity(1);
    setActionMsg(null);
    clearCartError();

    fetchProductBySlug(slug)
      .then((res) => {
        if (!active) return;
        setProduct(res.product);
        setRelated(res.related);
        const firstAvailable = res.product.variants.find((v) => v.stockQuantity > 0);
        if (firstAvailable) {
          setSelectedSize(firstAvailable.size);
        }
      })
      .catch((err: any) => {
        if (active) setError(err?.message || 'Piece not found.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug, clearCartError]);

  const handleGalleryKeyDown = (e: React.KeyboardEvent) => {
    if (!product || product.images.length <= 1) return;
    if (e.key === 'ArrowRight') {
      setActiveImageIdx((i) => (i + 1) % product.images.length);
    } else if (e.key === 'ArrowLeft') {
      setActiveImageIdx((i) => (i - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <section className="bg-[#F5F3EE] px-6 sm:px-10 lg:px-12 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-6 aspect-square bg-[#E5E3DC]" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-4 w-40 bg-[#DCDAD5]" />
            <div className="h-12 w-64 bg-[#DCDAD5]" />
            <div className="h-24 w-full bg-[#E7E4DB]" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="bg-[#F5F3EE] px-6 sm:px-10 lg:px-12 py-24">
        <div className="max-w-xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
            COLLECTION 001
          </p>
          <h1 className="font-serif text-4xl font-light text-[#101010] mb-4">
            Piece unavailable.
          </h1>
          <p className="text-sm text-[#6A6967] mb-8">{error || 'This piece could not be found.'}</p>
          <Link
            to="/collection"
            className="inline-flex items-center gap-3 bg-[#101010] text-[#F5F3EE] px-6 py-3.5 text-xs"
          >
            <span>Return to collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    );
  }

  const activeVariant = product.variants.find((v) => v.size === selectedSize);
  const maxQty = activeVariant?.stockQuantity ?? 0;
  const isDarkHero = product.slug === 'brand-bible-tee';

  const handleAddToBag = async () => {
    if (!activeVariant || activeVariant.stockQuantity < 1) {
      setActionMsg('Selected size is currently out of stock.');
      return;
    }
    const ok = await addToCart(product.id, activeVariant.id, quantity);
    if (ok) {
      setActionMsg(`Added ${product.name} (${selectedSize}) to your bag.`);
    }
  };

  return (
    <div className="w-full bg-[#F5F3EE] text-[#101010]">
      {/* Product Detail Split */}
      <section className="px-6 sm:px-10 lg:px-12 pt-8 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-[11px] text-[#6A6967] mb-8 flex items-center gap-2">
            <Link to="/collection" className="hover:text-[#101010] transition-colors">
              Collection
            </Link>
            <span>/</span>
            <Link
              to={`/collection?category=${product.category}`}
              className="hover:text-[#101010] transition-colors"
            >
              {product.category === 'graphic-edition' ? 'Graphic edition' : 'Essentials'}
            </Link>
            <span>/</span>
            <span className="text-[#101010]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Sticky Gallery */}
            <div
              className="lg:col-span-6 lg:sticky lg:top-8 outline-none"
              tabIndex={0}
              onKeyDown={handleGalleryKeyDown}
              aria-label={`${product.name} image gallery. Use left and right arrow keys to switch views.`}
            >
              <div
                className={`relative aspect-[1/0.95] overflow-hidden border border-[#DCDAD5] ${
                  isDarkHero && activeImageIdx === 0 ? 'bg-[#101010]' : 'bg-[#E5E3DC]'
                }`}
              >
                <SafeImage
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={`${product.name} — view ${activeImageIdx + 1}`}
                  darkSurface={isDarkHero && activeImageIdx === 0}
                  className={`w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    zoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                  }`}
                  onClick={() => setZoomed((z) => !z)}
                />
                <button
                  type="button"
                  onClick={() => setZoomed((z) => !z)}
                  aria-label={zoomed ? 'Reset image zoom' : 'Zoom product image'}
                  className="absolute bottom-3 right-3 bg-[#101010]/80 text-[#F5F3EE] p-2 hover:bg-[#101010] transition-colors cursor-pointer"
                >
                  {zoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                </button>
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={img + idx}
                      type="button"
                      onClick={() => {
                        setActiveImageIdx(idx);
                        setZoomed(false);
                      }}
                      aria-label={`View image ${idx + 1} of ${product.name}`}
                      className={`aspect-square overflow-hidden border transition-colors cursor-pointer ${
                        activeImageIdx === idx
                          ? 'border-[#101010]'
                          : 'border-[#DCDAD5] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <SafeImage
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Purchase Module */}
            <div className="lg:col-span-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
                {product.eyebrow}
              </p>

              <EditorialReveal
                as="h1"
                immediate
                lines={[product.shortTitle]}
                className="font-serif text-4xl sm:text-5xl font-light leading-[1.06] text-[#101010] mb-3"
              />

              <p className="text-sm text-[#101010] mb-4">{product.subtitle}</p>
              <p className="text-xs sm:text-sm leading-relaxed text-[#6A6967] pb-6 border-b border-[#DCDAD5]">
                {product.description}
              </p>

              {/* Colorway */}
              <div className="py-5 border-b border-[#DCDAD5]">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-2">
                  COLOUR / {product.colorName.toUpperCase()}
                </p>
                <div className="inline-flex items-center gap-2 text-xs text-[#101010]">
                  <span
                    className="w-3 h-3 rounded-full border border-[#101010]/30 inline-block"
                    style={{ backgroundColor: product.colorHex }}
                    aria-hidden="true"
                  />
                  <span>{product.colorName}</span>
                </div>
              </div>

              {/* Size Selector */}
              <div className="py-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967]">
                    YOUR PREFERRED SIZE
                  </p>
                  {activeVariant && (
                    <span className="text-[11px] text-[#6A6967] px-num">
                      {activeVariant.stockQuantity > 0
                        ? `${activeVariant.stockQuantity} in studio`
                        : 'Unavailable'}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Select size">
                  {product.variants.map((variant) => {
                    const selected = variant.size === selectedSize;
                    const out = variant.stockQuantity <= 0;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={out}
                        onClick={() => {
                          setSelectedSize(variant.size);
                          setQuantity(1);
                        }}
                        className={`w-11 h-11 text-xs border transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
                          selected
                            ? 'bg-[#101010] text-[#F5F3EE] border-[#101010]'
                            : 'bg-transparent text-[#101010] border-[#DCDAD5] hover:border-[#101010]'
                        }`}
                      >
                        {variant.size}
                      </button>
                    );
                  })}
                </div>

                <p className="text-[11px] text-[#6A6967] mt-3">
                  Confirm measurements and availability with the studio.
                </p>
              </div>

              {/* Quantity & CTA */}
              <div className="pb-6 border-b border-[#DCDAD5] space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center border border-[#DCDAD5] h-11 bg-[#F5F3EE]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="px-3 h-full text-[#101010] hover:bg-[#E7E4DB] transition-colors cursor-pointer disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs px-num">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(Math.max(1, maxQty), q + 1))}
                      disabled={quantity >= maxQty}
                      aria-label="Increase quantity"
                      className="px-3 h-full text-[#101010] hover:bg-[#E7E4DB] transition-colors cursor-pointer disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToBag}
                    disabled={isUpdatingCart || maxQty < 1}
                    className="flex-1 min-w-[200px] h-11 inline-flex items-center justify-between gap-4 bg-[#101010] text-[#F5F3EE] px-6 text-xs tracking-[0.04em] hover:bg-[#171716] transition-colors cursor-pointer disabled:opacity-45"
                  >
                    <span>
                      {isUpdatingCart
                        ? 'Adding to bag...'
                        : product.priceCents !== null
                          ? `Add to bag — ${formatMoney(product.priceCents, product.currency)}`
                          : 'Enquire to order'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6A6967]">
                  <span>
                    {product.priceCents !== null
                      ? formatMoney(product.priceCents, product.currency)
                      : product.pricingNote}
                  </span>
                  <Link to="/contact" className="underline hover:text-[#101010]">
                    Request garment measurements
                  </Link>
                </div>

                {(actionMsg || cartError) && (
                  <p role="status" className="text-xs text-[#101010] pt-1">
                    {cartError || actionMsg}
                  </p>
                )}
              </div>

              {/* Specifications */}
              <div className="divide-y divide-[#DCDAD5] border-b border-[#DCDAD5]">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="py-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-1.5">
                      {spec.label}
                    </p>
                    <p className="text-xs text-[#101010] leading-relaxed">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width Editorial Banner — OFF THE HANGER */}
      {product.bannerImage && (
        <section className="px-6 sm:px-10 lg:px-12 pb-20">
          <div className="max-w-6xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-2">
              {product.bannerEyebrow || 'OFF THE HANGER'}
            </p>
            <EditorialReveal
              as="h2"
              lines={[product.bannerTitle || 'Your everyday. Elevated.']}
              className="font-serif text-4xl sm:text-[42px] font-light text-[#101010] mb-8"
            />
            <div className="aspect-[1312/820] overflow-hidden bg-[#101010]">
              <SafeImage
                src={product.bannerImage}
                alt={`${product.name} editorial look`}
                darkSurface
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Related Pieces — ALSO IN THE COLLECTION / Keep it considered. */}
      {related.length > 0 && (
        <section className="px-6 sm:px-10 lg:px-12 pb-20">
          <div className="max-w-6xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-2">
              ALSO IN THE COLLECTION
            </p>
            <EditorialReveal
              as="h2"
              lines={['Keep it considered.']}
              className="font-serif text-4xl sm:text-[42px] font-light text-[#101010] mb-10"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.slug}`}
                  data-cursor-label="VIEW PIECE"
                  className="group block"
                >
                  <div className="aspect-[64/55] bg-[#E5E3DC] overflow-hidden">
                    <SafeImage
                      src={item.images[0]}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="pt-4 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm text-[#101010]">{item.name}</h3>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#6A6967] mt-1">
                        {item.editionLabel}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#101010] transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
