import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUpRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { FoxEmblem, PlatinumWordmark } from '../brand/BrandMarks.tsx';
import { Footer } from './Footer.tsx';
import { BagDrawer } from '../commerce/BagDrawer.tsx';
import { SearchModal } from '../commerce/SearchModal.tsx';
import { ScrollTrigger } from '../../animations/gsapSetup.ts';

interface MainLayoutProps {
  children: React.ReactNode;
}

const STOREFRONT_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/collection', label: 'Collection', end: false },
  { to: '/product/brand-bible-tee', label: 'Brand Bible Tee', end: true },
  { to: '/product/signature-tee-onyx', label: 'Signature / Onyx', end: true },
  { to: '/product/signature-tee-chalk', label: 'Signature / Chalk', end: true },
];

const EDITORIAL_LINKS = [
  { to: '/story', label: 'Our philosophy' },
  { to: '/journal', label: 'Journal' },
];

const STUDIO_LINKS = [
  { to: '/cart', label: 'Shopping bag' },
  { to: '/checkout', label: 'Studio order' },
  { to: '/contact', label: 'Contact studio' },
  { to: '/policies', label: 'Shipping & returns' },
];

export function MainLayout({ children }: MainLayoutProps) {
  const { cart, setIsBagOpen, setIsSearchOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const itemCount = cart?.itemCount ?? 0;

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F3EE] text-[#101010]">
      {/* Desktop Left Sidebar Navigation (shown on interior routes; homepage uses full-bleed hero transparent navbar) */}
      {!isHome && (
      <aside
        aria-label="Primary sidebar navigation"
        className={`hidden lg:flex flex-col shrink-0 sticky top-0 h-screen bg-[#F5F3EE] border-r border-[#DCDAD5] transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-30 ${
          sidebarCollapsed ? 'w-[76px]' : 'w-[248px]'
        }`}
      >
        {/* Brand Header Zone */}
        <div className="h-[78px] px-5 border-b border-[#DCDAD5] flex items-center justify-between gap-2">
          <Link
            to="/"
            className="flex items-center gap-3 text-[#101010] min-w-0"
            aria-label="PLATINUM X Home"
          >
            <FoxEmblem className="w-6 h-6 shrink-0" strokeWidth={1.6} />
            {!sidebarCollapsed && (
              <PlatinumWordmark className="text-sm tracking-[0.22em]" />
            )}
          </Link>
          <button
            type="button"
            onClick={() => setSidebarCollapsed((v) => !v)}
            aria-label={sidebarCollapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 text-[#6A6967] hover:text-[#101010] transition-colors cursor-pointer shrink-0"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Utility Actions (Search & Bag) */}
        <div className={`px-4 py-4 border-b border-[#DCDAD5] flex flex-col gap-1.5 ${sidebarCollapsed ? 'items-center' : ''}`}>
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search collection"
            className={`flex items-center gap-3 px-2.5 py-2 text-xs text-[#6A6967] hover:text-[#101010] transition-colors cursor-pointer ${
              sidebarCollapsed ? 'justify-center' : 'justify-between w-full'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span>Search</span>}
            </span>
            {!sidebarCollapsed && (
              <span className="text-[10px] tracking-[0.12em] opacity-60">⌘K</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsBagOpen(true)}
            aria-label={`Open shopping bag (${itemCount} items)`}
            className={`flex items-center gap-3 px-2.5 py-2 text-xs text-[#101010] hover:bg-[#E7E4DB] transition-colors cursor-pointer ${
              sidebarCollapsed ? 'justify-center relative' : 'justify-between w-full'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span>Bag</span>}
            </span>
            <span className="text-[11px] px-num font-medium">
              {sidebarCollapsed ? itemCount : `(${itemCount})`}
            </span>
          </button>
        </div>

        {/* Organized Navigation Groups */}
        {!sidebarCollapsed ? (
          <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-7" aria-label="Store sections">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3 px-1">
                Collection 001
              </p>
              <ul className="space-y-1">
                {STOREFRONT_LINKS.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-1 py-1.5 text-xs transition-colors whitespace-nowrap ${
                          isActive
                            ? 'text-[#101010] font-medium underline underline-offset-4'
                            : 'text-[#6A6967] hover:text-[#101010]'
                        }`
                      }
                    >
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#DCDAD5] pt-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3 px-1">
                Editorial
              </p>
              <ul className="space-y-1">
                {EDITORIAL_LINKS.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-1 py-1.5 text-xs transition-colors whitespace-nowrap ${
                          isActive
                            ? 'text-[#101010] font-medium underline underline-offset-4'
                            : 'text-[#6A6967] hover:text-[#101010]'
                        }`
                      }
                    >
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#DCDAD5] pt-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6A6967] mb-3 px-1">
                Studio &amp; Order
              </p>
              <ul className="space-y-1">
                {STUDIO_LINKS.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-1 py-1.5 text-xs transition-colors whitespace-nowrap ${
                          isActive
                            ? 'text-[#101010] font-medium underline underline-offset-4'
                            : 'text-[#6A6967] hover:text-[#101010]'
                        }`
                      }
                    >
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        ) : (
          <nav className="flex-1 py-6 flex flex-col items-center gap-4" aria-label="Collapsed navigation">
            <NavLink
              to="/"
              end
              title="Home"
              className={({ isActive }) =>
                `text-[10px] uppercase tracking-[0.14em] py-1.5 ${
                  isActive ? 'text-[#101010] font-medium underline underline-offset-4' : 'text-[#6A6967]'
                }`
              }
            >
              00
            </NavLink>
            <NavLink
              to="/collection"
              title="Collection"
              className={({ isActive }) =>
                `text-[10px] uppercase tracking-[0.14em] py-1.5 ${
                  isActive ? 'text-[#101010] font-medium underline underline-offset-4' : 'text-[#6A6967]'
                }`
              }
            >
              01
            </NavLink>
            <NavLink
              to="/story"
              title="Our philosophy"
              className={({ isActive }) =>
                `text-[10px] uppercase tracking-[0.14em] py-1.5 ${
                  isActive ? 'text-[#101010] font-medium underline underline-offset-4' : 'text-[#6A6967]'
                }`
              }
            >
              02
            </NavLink>
            <NavLink
              to="/journal"
              title="Journal"
              className={({ isActive }) =>
                `text-[10px] uppercase tracking-[0.14em] py-1.5 ${
                  isActive ? 'text-[#101010] font-medium underline underline-offset-4' : 'text-[#6A6967]'
                }`
              }
            >
              03
            </NavLink>
          </nav>
        )}

        {/* Sidebar Signature Footer */}
        {!sidebarCollapsed && (
          <div className="px-6 py-5 border-t border-[#DCDAD5]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#101010]">
              Less noise. More presence.
            </p>
            <p className="text-[10px] tracking-[0.14em] text-[#6A6967] mt-1">
              COLLECTION 001 / STUDIO
            </p>
          </div>
        )}
      </aside>
      )}

      {/* Mobile & Tablet Top Bar (< 992px) */}
      {!isHome && (
      <header className="lg:hidden sticky top-0 z-30 h-16 bg-[#F5F3EE]/95 backdrop-blur-sm border-b border-[#DCDAD5] px-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-[#101010]" aria-label="PLATINUM X Home">
          <FoxEmblem className="w-5 h-5" strokeWidth={1.6} />
          <PlatinumWordmark className="text-sm tracking-[0.22em]" />
        </Link>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className="p-1.5 text-[#101010]"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsBagOpen(true)}
            className="text-xs text-[#101010] whitespace-nowrap px-num"
          >
            Bag ({itemCount})
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="p-1.5 text-[#101010]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>
      )}

      {/* Mobile Navigation Drawer */}
      {!isHome && mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#101010] text-[#F5F3EE] flex flex-col justify-between p-6 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/15">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5"
              >
                <FoxEmblem className="w-5 h-5" />
                <PlatinumWordmark className="text-sm tracking-[0.22em]" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 text-[#F5F3EE]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="py-8 space-y-6" aria-label="Mobile sections">
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B9994]">
                  Collection 001
                </p>
                {STOREFRONT_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between font-serif text-2xl font-light text-[#F5F3EE] py-1"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                  </Link>
                ))}
              </div>

              <div className="pt-6 border-t border-white/15 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B9994]">
                  Editorial &amp; Studio
                </p>
                {[...EDITORIAL_LINKS, ...STUDIO_LINKS].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-sm text-[#D6D3CB] py-1.5"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          <div className="pt-6 border-t border-white/15 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#9B9994]">
            <span>Less noise. More presence.</span>
            <span>&copy; 2026</span>
          </div>
        </div>
      )}

      {/* Primary Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <main id="main-content" className="flex-1 min-w-0">
          {children}
        </main>
        <Footer />
      </div>

      {/* Global Commerce Overlays */}
      <BagDrawer />
      <SearchModal />
    </div>
  );
}
