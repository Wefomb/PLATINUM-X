import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext.tsx';
import { MainLayout } from './components/layout/MainLayout.tsx';
import { IntroOverlay } from './animations/IntroOverlay.tsx';
import { CursorLabel } from './animations/CursorLabel.tsx';
import { useLenisScroll } from './animations/useLenisScroll.ts';

const HomePage = lazy(() => import('./pages/HomePage.tsx').then((m) => ({ default: m.HomePage })));
const CollectionPage = lazy(() =>
  import('./pages/CollectionPage.tsx').then((m) => ({ default: m.CollectionPage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage.tsx').then((m) => ({ default: m.ProductDetailPage }))
);
const StoryPage = lazy(() => import('./pages/StoryPage.tsx').then((m) => ({ default: m.StoryPage })));
const JournalPage = lazy(() => import('./pages/JournalPage.tsx').then((m) => ({ default: m.JournalPage })));
const JournalArticlePage = lazy(() =>
  import('./pages/JournalArticlePage.tsx').then((m) => ({ default: m.JournalArticlePage }))
);
const CartPage = lazy(() => import('./pages/CartPage.tsx').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage.tsx').then((m) => ({ default: m.CheckoutPage }))
);
const OrderConfirmationPage = lazy(() =>
  import('./pages/OrderConfirmationPage.tsx').then((m) => ({ default: m.OrderConfirmationPage }))
);
const ContactPage = lazy(() => import('./pages/ContactPage.tsx').then((m) => ({ default: m.ContactPage })));
const PoliciesPage = lazy(() =>
  import('./pages/PoliciesPage.tsx').then((m) => ({ default: m.PoliciesPage }))
);

function RouteFallback() {
  return (
    <div className="min-h-[60vh] bg-[#F5F3EE] px-6 sm:px-10 lg:px-12 py-16">
      <div className="max-w-6xl mx-auto animate-pulse space-y-6">
        <div className="h-3 w-28 bg-[#DCDAD5]" />
        <div className="h-10 w-64 bg-[#DCDAD5]" />
      </div>
    </div>
  );
}

function AppShell() {
  useLenisScroll();

  return (
    <>
      <IntroOverlay />
      <CursorLabel />
      <MainLayout>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/story" element={<StoryPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/journal/:slug" element={<JournalArticlePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/:reference" element={<OrderConfirmationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppShell />
      </StoreProvider>
    </BrowserRouter>
  );
}
