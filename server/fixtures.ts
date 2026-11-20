import type { Product, JournalArticle } from '../shared/types.ts';

/**
 * Collection 001 studio fixture catalog aligned strictly with the Figma designs.
 * Prices default to null ("Pricing and delivery confirmed on enquiry") unless
 * CATALOG_MODE=priced is configured with live commercial pricing.
 */
export const COLLECTION_001_FIXTURES: Omit<Product, 'variants'>[] = [
  {
    id: 'prod_brand_bible',
    slug: 'brand-bible-tee',
    name: 'Brand Bible Tee',
    shortTitle: 'Brand Bible Tee.',
    subtitle: 'Less noise. More presence.',
    eyebrow: 'PLATINUM X / GRAPHIC EDITION',
    editionLabel: 'ONYX / THE GRAPHIC EDITION',
    category: 'graphic-edition',
    description:
      'A monochrome graphic on an easy black silhouette. Liquid-metal artwork, a spaced wordmark and subtle sleeve signatures bring the first expression together.',
    priceCents: null,
    currency: 'USD',
    pricingNote: 'Pricing and delivery confirmed on enquiry.',
    images: [
      '/assets/platinum/pdp-main.webp',
      '/assets/platinum/lookbook-01-poster.webp',
      '/assets/platinum/details-closeup.webp',
    ],
    bannerEyebrow: 'OFF THE HANGER',
    bannerTitle: 'Your everyday. Elevated.',
    bannerImage: '/assets/platinum/brand-bible-back.webp',
    colorName: 'Black',
    colorHex: '#101010',
    specs: [
      {
        label: 'THE DESIGN',
        value: 'Liquid-metal graphic • PLATINUM X wordmark • sleeve signatures',
      },
      {
        label: 'THE FIT',
        value: 'Relaxed silhouette. Request garment measurements for your preferred fit.',
      },
      {
        label: 'CARE',
        value: 'Please follow the garment care label. Protect printed surfaces.',
      },
    ],
    status: 'active',
    sortOrder: 1,
  },
  {
    id: 'prod_signature_onyx',
    slug: 'signature-tee-onyx',
    name: 'Signature Tee / Onyx',
    shortTitle: 'Signature Tee.',
    subtitle: '01 — Onyx / Relaxed silhouette',
    eyebrow: 'PLATINUM X / THE ESSENTIAL',
    editionLabel: 'ONYX / THE ESSENTIAL',
    category: 'essentials',
    description:
      'An everyday foundation in heavyweight combed cotton. Dropped shoulders, structured collar and a quiet chest wordmark designed to let proportion take the lead.',
    priceCents: null,
    currency: 'USD',
    pricingNote: 'Pricing and delivery confirmed on enquiry.',
    images: [
      '/assets/platinum/signature-onyx.webp',
      '/assets/platinum/hero-model.webp',
      '/assets/platinum/details-closeup.webp',
    ],
    bannerEyebrow: 'THE PERMANENT EDIT',
    bannerTitle: 'Presence. Without noise.',
    bannerImage: '/assets/platinum/lookbook-02.webp',
    colorName: 'Onyx',
    colorHex: '#101010',
    specs: [
      {
        label: 'THE DESIGN',
        value: 'Tonal chest signature • clean back • woven PLATINUM X neck label',
      },
      {
        label: 'THE FIT',
        value: 'Relaxed silhouette. Request garment measurements for your preferred fit.',
      },
      {
        label: 'CARE',
        value: 'Please follow the garment care label. Wash cold inside out.',
      },
    ],
    status: 'active',
    sortOrder: 2,
  },
  {
    id: 'prod_signature_chalk',
    slug: 'signature-tee-chalk',
    name: 'Signature Tee / Chalk',
    shortTitle: 'Signature Tee.',
    subtitle: '02 — Chalk / Relaxed silhouette',
    eyebrow: 'PLATINUM X / THE ESSENTIAL',
    editionLabel: 'CHALK / THE ESSENTIAL',
    category: 'essentials',
    description:
      'The light counterpart to the Onyx essential. Cut in an architectural boxy drape with a crisp monochrome chest mark and unbleached chalk finish.',
    priceCents: null,
    currency: 'USD',
    pricingNote: 'Pricing and delivery confirmed on enquiry.',
    images: [
      '/assets/platinum/signature-chalk.webp',
      '/assets/platinum/details-closeup.webp',
    ],
    bannerEyebrow: 'THE PERMANENT EDIT',
    bannerTitle: 'Two tones. One identity.',
    bannerImage: '/assets/platinum/journal-hero.webp',
    colorName: 'Chalk',
    colorHex: '#F3F2EE',
    specs: [
      {
        label: 'THE DESIGN',
        value: 'Minimal chest wordmark • dense ribbed collar • signature woven label',
      },
      {
        label: 'THE FIT',
        value: 'Relaxed silhouette. Request garment measurements for your preferred fit.',
      },
      {
        label: 'CARE',
        value: 'Please follow the garment care label. Wash with similar light tones.',
      },
    ],
    status: 'active',
    sortOrder: 3,
  },
];

export const INITIAL_VARIANT_STOCK: Record<string, { S: number; M: number; L: number; XL: number }> = {
  prod_brand_bible: { S: 8, M: 12, L: 10, XL: 6 },
  prod_signature_onyx: { S: 10, M: 14, L: 14, XL: 8 },
  prod_signature_chalk: { S: 10, M: 12, L: 12, XL: 8 },
};

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: 'presence-is-a-quiet-thing',
    number: '01',
    eyebrow: '01 / POINT OF VIEW',
    title: 'Presence is a quiet thing.',
    excerpt:
      'We do not believe presence comes from being louder. It comes from confidence, intention, and how you carry yourself.',
    body: [
      'We do not believe presence comes from being louder. It comes from confidence, intention, and how you carry yourself.',
      'A monochrome wardrobe is not an absence of expression. It is a choice to let proportion, texture and movement take the lead. The clothes frame the person. They never need to compete.',
      'Collection 001 establishes the visual discipline of PLATINUM X: heavy cotton bases, disciplined monochrome contrast, and marks placed only where they earn their space.',
    ],
    image: '/assets/platinum/journal-hero.webp',
    ctaLabel: 'Discover our philosophy',
    ctaTo: '/story',
  },
  {
    slug: 'a-closer-look',
    number: '02',
    eyebrow: '02 / THE FINISH',
    title: 'A closer look.',
    excerpt:
      'A label, a mark, the texture of black. The small things give a piece its character.',
    body: [
      'A label, a mark, the texture of black. The small things give a piece its character.',
      'From the woven interior neck tag bearing the PLATINUM X signature to the brushed metallic emblem and liquid-metal ink density, every element is calibrated for permanence rather than novelty.',
      'Inside the garment, construction meets restraint—ensuring the piece feels considered from the first touch.',
    ],
    image: '/assets/platinum/journal-details.webp',
    ctaLabel: 'Explore the collection',
    ctaTo: '/collection',
  },
  {
    slug: 'distinction-by-design',
    number: '03',
    eyebrow: '03 / THE ARTWORK',
    title: 'Distinction, by design.',
    excerpt:
      'A study in contrast. Liquid forms and sharp instinct, expressed through a monochrome lens.',
    body: [
      'A study in contrast. Liquid forms and sharp instinct, expressed through a monochrome lens.',
      'The artistic fox illustration embodies the dual nature of PLATINUM X: razor-sharp precision emerging out of fluid monochrome ink.',
      'Paired against our minimal geometric fox emblem, these two expressions form the complete symbolic vocabulary of the house.',
    ],
    image: '/assets/platinum/distinction-fox.webp',
    ctaLabel: 'View Brand Bible Tee',
    ctaTo: '/product/brand-bible-tee',
  },
];
