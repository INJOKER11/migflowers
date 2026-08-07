# MIG Flowers

Storefront for MIG Flowers, a family florist. Next.js 15
(App Router) + TypeScript + React 19.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
```

## Layout

```
app/
  layout.tsx              shell: PromoBar, Header, main, Footer, CartDrawer, CartProvider
  globals.css             the stylesheet — imports styles/ in cascade order, no rules of its own
  styles/
    tokens.css            the Classical design system, ported from the handoff
    base.css              reset, page ground, element defaults, keyframes
    layout.css            section, the one grid, prose, the photo plate
    buttons.css           .btn plus the one-off icon buttons
    forms.css             fields, inputs, radios, segmented control, chips
    chrome.css            promo bar, header, nav, footer
    commerce.css          product card, occasions, cart drawer, product detail
    ui.css                rules, cards, tags, tables, dialogs, FAQ, checkout rail
    responsive.css        every breakpoint — must stay the last import
  page.tsx                home
  shop/                   catalogue; filters live in searchParams
  category/[slug]/        category landing (wedding-flowers)
  product/[id]/           product detail
  cart/  checkout/  checkout/confirmed/  wishlist/
  about/ delivery/ blog/ blog/[slug]/ account/ login/
  subscription/ corporate/ gift-cards/ faq/ reviews/ contact/
  legal/[doc]/            privacy | terms
  not-found.tsx
components/
  chrome/    PromoBar Header MobileNav Footer nav
  cart/      CartDrawer CartLine CartView OrderSummary CheckoutForm Confirmation QuantityStepper
  product/   ProductCard ProductGrid ProductDetail WishlistView
  shop/      ShopBrowser FilterRail
  home/      Hero QuickBuy OccasionGrid WhyUs TestimonialCarousel InstaGrid Newsletter
  ui/        Section Plate Button Chip SectionHeading Breadcrumb Accordion icons
  account/ corporate/ gift/ contact/ reviews/ subscription/
lib/
  catalog posts faqs reviews legal content images format constants
  cart-context.tsx
types/index.ts
```

## Design system

`app/globals.css` is imported once, in `app/layout.tsx`, and holds nothing but
the `@import` list for `app/styles/`. Next inlines those into a single sheet, so
the split costs nothing at runtime — but **order is the cascade**, and
`responsive.css` must stay last.

`app/styles/tokens.css` is the handoff's `styles.css` tokens ported verbatim.
The Google Fonts `@import` is dropped (`next/font/google` loads Cormorant
Garamond and Lora with the Cyrillic subset and supplies `--font-heading` /
`--font-body`). **Retune colour, type, spacing and elevation there, not in a
component sheet.**

Everything else in `app/styles/` is the site layer: named classes for the
chrome, the chip, the product card, the drawer and the rest, plus the three
breakpoints (1000px, 760px, coarse pointer). Screens keep one-off geometry
inline; anything that repeats has a class.

`components/ui/Button.tsx` owns the `.btn` family — pass `href` and it renders a
`next/link` anchor, leave it off and it renders a `<button>`, typed either way.
The one-off affordances (`.icon-btn`, `.cart-btn`, `.wish-btn`, `.thumb-btn`,
`.tab-btn`, `.social-btn`) have their own geometry and are **not** `.btn`
variants; don't combine them with it.

## Cart

`lib/cart-context.tsx` holds `Record<string, number>` for the cart and
`Record<string, boolean>` for the wishlist, both persisted to `localStorage`.
Derived: `count`, `subtotal`, `deliveryFee` (free at or above 2 500 ₴, and on an
empty cart), `discount` (10% with `BLOOM10`), `total`.

The drawer is a three-step machine — `basket → checkout → done`. Adding any
product opens it and forces `basket`. `/checkout` shares the same state and
redirects to `/checkout/confirmed` instead of landing on `done`.

Anything that reads the cart holds its output back until `ready` is true, so a
filled cart never flashes an empty state after hydration.

## Content

All copy is Ukrainian and carried from the prototype. Data lives in `lib/`:
twelve products, four posts, eight FAQs, seven reviews, three testimonials, four
occasions, three team members, three plans, two legal documents.

Figures used in more than one place are in `lib/constants.ts` — free-delivery
threshold, delivery fee, promo discount, cut-off, freshness guarantee, variant
multipliers, page size.

## Assets

Photography is Unsplash, wired through `next/image` with a remote pattern for
`images.unsplash.com`. All of it is placeholder for the client's own work —
`lib/images.ts` is the only file that changes when the real photographs arrive.
Every content photograph goes through `<Plate>`; there are no bare `<img>` tags.

The logo is `public/logo.png`, the client's own raster mark. **Ask the client for
a vector original.**

Icons are `lucide-react`.

## Notes for the client

Five copy fixes were made against the prototype; the original is on the left.

| Prototype | Rendered | Where |
|---|---|---|
| `У дотроянді` | `У дорозі` | account tracking card, status tag, progress rail |
| `на потроянді` | `на порозі` | Delivery, cash-on-delivery |
| `код BLOOM10 уже в дотроянді` | `…уже в дорозі` | newsletter confirmation |
| `З кем ми ділимося` | `З ким ми ділимося` | Privacy, section 3 |
| English paragraph | Ukrainian | Terms, «Гарантія свіжості» |

The first three are damage from a find-and-replace in the prototype
(`розі` → `троянді`); the handoff README confirms `У дорозі` and `в дорозі`.
Revert any of them in `lib/content.ts` or `lib/legal.ts` if the client prefers
the original.

Two more points, unchanged pending a decision:

- **Category cards.** The handoff README lists a `translateY(-6px)` hover on
  "category cards"; the prototype has no such hover. The occasion cells sit in a
  `gap: 1px` hairline grid where lifting one would break the rule, so the
  prototype's background change is what ships.
- **`/checkout` with an empty cart.** The confirm button is disabled rather than
  placing an empty order — the drawer already guards its equivalent step.
