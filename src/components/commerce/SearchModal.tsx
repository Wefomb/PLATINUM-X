import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { SafeImage } from '../common/SafeImage.tsx';

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, products } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();
  const filtered = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.editionLabel.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.colorName.toLowerCase().includes(q)
      )
    : products;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4" role="dialog" aria-modal="true" aria-label="Search catalog">
      <div
        className="fixed inset-0 bg-[#101010]/55"
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-2xl bg-[#F5F3EE] text-[#101010] border border-[#DCDAD5] shadow-xl">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#DCDAD5]">
          <Search className="w-4 h-4 text-[#6A6967] shrink-0" />
          <label htmlFor="px-search-input" className="sr-only">
            Search PLATINUM X pieces
          </label>
          <input
            id="px-search-input"
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pieces, editions, or colorways..."
            className="w-full bg-transparent text-sm text-[#101010] placeholder:text-[#6A6967] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
            className="p-1.5 text-[#6A6967] hover:text-[#101010] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#6A6967] mb-4">
            {q ? `Results (${filtered.length})` : 'Collection 001'}
          </p>

          {filtered.length === 0 ? (
            <p className="text-sm text-[#6A6967] py-6">
              No pieces matched &ldquo;{query}&rdquo;. Try &ldquo;Brand Bible&rdquo;, &ldquo;Onyx&rdquo;, or &ldquo;Chalk&rdquo;.
            </p>
          ) : (
            <div className="divide-y divide-[#DCDAD5]">
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-16 shrink-0 bg-[#E5E3DC] border border-[#DCDAD5] overflow-hidden">
                      <SafeImage
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#6A6967]">
                        {product.editionLabel}
                      </p>
                      <p className="font-serif text-xl text-[#101010] truncate">
                        {product.name}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#6A6967] group-hover:text-[#101010] group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
