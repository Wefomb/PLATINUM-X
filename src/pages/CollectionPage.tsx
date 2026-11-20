import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../../shared/types.ts';
import { fetchProducts } from '../services/api.ts';
import { SafeImage } from '../components/common/SafeImage.tsx';
import { EditorialReveal } from '../animations/EditorialReveal.tsx';

const FILTER_TABS = [
  { key: 'all', label: 'All pieces' },
  { key: 'essentials', label: 'Essentials' },
  { key: 'graphic-edition', label: 'Graphic edition' },
] as const;

export function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [category, setCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<string>('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchProducts({ category, sort: sort === 'featured' ? undefined : sort })
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch((err: any) => {
        if (active) setError(err?.message || 'Unable to load collection.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category, sort]);

  const handleCategoryChange = (next: string) => {
    setCategory(next);
    if (next === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', next);
    }
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className="w-full">
      {/* Collection Header + Grid */}
      <section className="bg-[#F5F3EE] text-[#101010] px-6 sm:px-10 lg:px-12 pt-14 pb-20 lg:pb-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3">
            THE COLLECTION / 001
          </p>
          <EditorialReveal
            as="h1"
            immediate
            lines={['A wardrobe.', 'A point of view.']}
            className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-light leading-[1.04] text-[#101010] mb-4"
          />
          <p className="text-xs sm:text-sm text-[#6A6967] max-w-md leading-relaxed mb-10">
            Essential silhouettes and expressive graphics. Always in black and white.
          </p>

          {/* Filter Tabs + Sort Control */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCDAD5] pb-4 mb-10">
            <div className="flex items-center gap-6" role="tablist" aria-label="Filter collection">
              {FILTER_TABS.map((tab) => {
                const active = category === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleCategoryChange(tab.key)}
                    className={`text-xs transition-colors cursor-pointer pb-1 border-b ${
                      active
                        ? 'text-[#101010] border-[#101010] font-medium'
                        : 'text-[#6A6967] border-transparent hover:text-[#101010]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="px-collection-sort" className="text-[10px] uppercase tracking-[0.16em] text-[#6A6967]">
                Sort
              </label>
              <select
                id="px-collection-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-xs text-[#101010] border border-[#DCDAD5] px-2.5 py-1.5 focus:outline-none focus:border-[#101010]"
              >
                <option value="featured">Featured order</option>
                <option value="name-asc">Name: A — Z</option>
                <option value="name-desc">Name: Z — A</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-4 border border-[#101010]/20 bg-[#E7E4DB] text-xs text-[#101010] mb-8">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse">
                  <div className="aspect-[1/1.05] bg-[#E5E3DC]" />
                  <div className="h-4 w-32 bg-[#DCDAD5] mt-4" />
                  <div className="h-3 w-44 bg-[#E7E4DB] mt-2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-sm text-[#6A6967] py-12">
              No pieces found in this filter.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => {
                const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
                const isDarkCard = product.slug === 'brand-bible-tee';
                return (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    data-cursor-label="VIEW PIECE"
                    className="group block"
                  >
                    <div
                      className={`aspect-[1/1.05] overflow-hidden ${
                        isDarkCard ? 'bg-[#101010]' : 'bg-[#E5E3DC]'
                      }`}
                    >
                      <SafeImage
                        src={product.images[0]}
                        alt={product.name}
                        darkSurface={isDarkCard}
                        className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="font-sans text-sm text-[#101010]">
                          {product.name.replace(' / Onyx', '').replace(' / Chalk', '')}
                        </h2>
                        <ArrowRight className="w-4 h-4 text-[#101010] shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-[#6A6967]">
                          {product.editionLabel}
                        </p>
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#6A6967]">
                          {totalStock > 0 ? 'Available' : 'Sold out'}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Dark Story Band */}
      <section className="bg-[#101010] text-[#F5F3EE] px-6 sm:px-10 lg:px-12 py-20 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B9994] mb-3">
            THE SAME PALETTE. A DIFFERENT ENERGY.
          </p>
          <EditorialReveal
            as="h2"
            lines={['Find your expression.']}
            className="font-serif text-4xl sm:text-5xl font-light text-[#F5F3EE] mb-4"
          />
          <p className="text-xs sm:text-sm text-[#A3A19C] max-w-sm leading-relaxed mb-8">
            A quiet foundation or a considered statement. The choice is yours.
          </p>
          <Link
            to="/story"
            className="inline-flex items-center justify-between gap-8 bg-[#F5F3EE] text-[#101010] px-6 py-3.5 text-xs tracking-[0.04em] hover:bg-[#E7E4DB] transition-colors"
          >
            <span>Read our story</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
