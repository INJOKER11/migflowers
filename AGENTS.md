# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # http://localhost:3000
npm run build      # full prerender — the real check that a change works
npm run typecheck  # tsc --noEmit
```

`npm run build` is the closest thing to a test suite here: most routes are
static or SSG, so a build exercises them. `/product/[slug]` and `/shop` are
dynamic (`ƒ` in the build output) — they need `NEXT_PUBLIC_API_URL` (see `.env`)
pointing at a reachable backend to render at all, in build or in dev. Run build
before calling a change done.

**There are no tests and no test runner.** Don't claim a change is verified by
tests; verify with `typecheck` + `build`, and by looking at the page in `dev`.

**There is no linter.** ESLint was never configured here, and `next lint` was
removed in Next 16 — the dead `lint` script has been deleted from
`package.json`. Nothing catches unused imports or unreachable code, so don't
assume it. Wiring up ESLint flat config is an open task.

## What this is

A storefront for an Odesa florist: Next.js 16 App Router (Turbopack, on by
default — see the version-16 note below), React 19, TypeScript strict.
**No Next.js API routes, no auth in this app** — but there is a real backend:
a separate REST API (Laravel-style JSON, paginated `data`/`meta` envelopes),
reached through `lib/api.ts` and pointed at by `NEXT_PUBLIC_API_URL` in `.env`
(`http://localhost:8080` locally — that service needs to be running alongside
`npm run dev`, and reachable at build time for the SSG routes below). Products,
categories, reviews and blog posts come from it; FAQ, legal documents and the
rest of the home-page copy are still typed constants in `lib/` (see Data and
content below). `lib/catalog.ts`'s old `CATALOG` array and its lookups
(`getProduct`, `relatedTo`, `byOccasion`, `quickBuy`) are commented-out dead
code from before the migration to the API — don't revive them, use `lib/api.ts`.

Checkout submits real orders (`createOrder` in `lib/api.ts`, `POST /api/orders`).
The contact, corporate, newsletter and login forms are still local-only: they
flip a `useState` and render a confirmation, posting nowhere. Don't add a fetch
layer or server actions to "finish" those unless asked.

**Retired routes are disabled in place, not deleted.** `/cart`, `/account`,
`/login`, `/subscription` and `/gift-cards` still have their `page.tsx`, but
each calls `notFound()` from `next/navigation` as the first line of the
component and has no `metadata` export (so the tab title falls back to the
root layout's instead of a stale one). The JSX below the `notFound()` call is
unreachable but left in place — it's the fastest way to bring a route back.
Every live `Link`/`href`/`router.push` to those five paths has been removed
or repointed elsewhere in the app; if you re-enable one, grep for its path
and restore the links too. Follow the same pattern for the next page that
gets retired.

Copy is Ukrainian and Russian, never English — see **Locales and SEO** below
for which strings are actually translated today and which are still Ukrainian
in both. `README.md` documents five deliberate copy fixes against the original
prototype — read that table before "correcting" any Ukrainian that looks wrong.

## Locales and SEO

The site serves two locales on two sets of URLs: Ukrainian on the bare paths it
has always had (`/shop`), Russian under a prefix (`/ru/shop`). There is no
client-side toggle — a toggle that does not change the URL leaves Google one
version to index instead of two.

Three files carry it:

- **`proxy.ts`** (Next 16's rename of `middleware.ts`) maps bare paths onto the
  `[lang]` segment: `/shop` is *rewritten* to `/uk/shop` with the URL
  unchanged, `/ru/...` passes through, and `/uk/...` is *redirected* back to
  the bare form. That last rule is what stops `/shop` and `/uk/shop` from both
  rendering.
- **`lib/i18n.ts`** owns `LOCALES`, `SITE_URL` (the **www** host — the apex and
  http both 308 there, so any other origin makes every canonical point at a
  redirect), and `RU_INDEXABLE`.
- **`lib/dictionaries.ts`** holds both languages. Each side is written for how
  its own audience searches, not translated phrase-for-phrase.

**`RU_INDEXABLE` is currently `false`,** and it is the switch that matters. The
chrome, the language switcher and every title/description/h1 are translated;
everything else — the rest of the UI strings, and all product, category and
blog content from the API — is still Ukrainian on Russian pages. Until that is
fixed, indexing `/ru` would hand Google two near-identical pages per route, so
the flag puts `noindex` on Russian pages, keeps them out of `app/sitemap.ts`,
and suppresses the hreflang pair. Flip it to `true` in one place once the copy
and the API's localized fields exist.

The API is the blocker: `ApiProduct`/`ApiCategory`/`ApiPost` carry a single
`name`/`description`/`content` with no `*_uk`/`*_ru` variants, so catalogue
content cannot be localized from this repo at all.

Routing rules that follow from all this:

- **Every `href` is written bare** (`/shop`, `/product/x`). `components/ui/Link`
  adds the locale prefix by reading the URL, so import `Link` from
  `@/components/ui/Link`, **not** from `next/link`. For `router.push`, use
  `useLocalePath()` from `@/lib/use-locale`. The one deliberate exception is
  `LanguageSwitcher`, which builds a full path itself and so uses `next/link`.
- **Metadata goes through `lib/seo.ts`.** `metadataFor(params, path, key)` for a
  static page, `pageMetadata({...})` when the title is built from data. Never
  hand-roll `alternates.canonical` in a page — and never put one on the layout,
  because metadata merges downward and every page would inherit it.
- **Structured data** lives in `lib/schema.ts` and renders through
  `components/seo/JsonLd`. `Florist` sits in the layout (site-wide), `Product`
  on the product page, and `BreadcrumbList` comes free from `<Breadcrumb>`
  whenever you pass it `locale`.
- **`app/robots.ts` and `app/sitemap.ts` stay at the app root**, outside
  `[lang]` — they are served from the domain root. The sitemap deliberately
  omits the five retired routes plus `/checkout`, `/checkout/confirmed` and
  `/wishlist`; if you add a public page, add it to `STATIC_PATHS`.

## Styling

This is the part that most needs explaining, because it is not a normal Next
setup: **all styling is global CSS classes.** No CSS Modules, no Tailwind, no
CSS-in-JS. A component gets `className="chip"` as a plain string, and that class
is defined in a globally-loaded stylesheet.

`app/globals.css` is imported once (in `app/layout.tsx`) and contains **no rules
of its own** — only an ordered `@import` list of `app/styles/*.css`. Next inlines
those into a single sheet, so splitting costs nothing at runtime.

Two rules that will silently break things if ignored:

- **Import order is the cascade.** `app/styles/responsive.css` must stay last —
  its touch-target block overrides earlier rules at equal specificity with no
  `!important` to save it.
- **`app/styles/tokens.css` is the only file with raw values.** Colours, the
  tonal ramps, spacing, radii and shadows live there as custom properties;
  everything downstream references them. Retune the design there, never by
  hardcoding a hex or px in a component sheet.

The established convention for a screen: **repeated visuals get a class in
`app/styles/`; one-off geometry stays inline** as a `style` prop. Both patterns
are everywhere and both are correct — don't "clean up" inline styles into
classes wholesale, and don't invent a new class for something used once.

### Buttons

`components/ui/Button.tsx` owns the `.btn` family. Pass `href` and it renders a
`next/link` anchor; omit it and you get a `<button>` — the prop types follow, so
link props on a button are a compile error. Props: `variant`
(`primary`/`secondary`/`ghost`), `block`, `icon`, `cta`.

`.icon-btn`, `.cart-btn`, `.wish-btn`, `.thumb-btn`, `.tab-btn`, `.social-btn`,
`.icon-plain` are **not** `.btn` variants. They have independent geometry, are
still applied as raw class strings, and must not be combined with `.btn`. All of
them are collected in `app/styles/buttons.css`.

## Cart and hydration

`lib/cart-context.tsx` is the only stateful system. `<CartProvider>` wraps the
whole app in `app/layout.tsx`; reach it with `useCart()`.

State is two `Record`s — quantities and wishlist flags, both keyed by product id
and persisted to `localStorage`. Everything else (`lines`, `count`, `subtotal`,
`deliveryFee`, `discount`, `total`, `savedProducts`, `orderSummary`) is derived.

**The `ready` flag is a hydration guard, not a loading spinner.** `localStorage`
can't be read during SSR, so the first client render must match the server's
empty cart; `ready` flips to `true` in an effect after the store is read. Any
component that renders cart or wishlist contents must hold them back until
`ready`, or the page flashes an empty state after hydration. This is easy to
forget when adding a new cart-reading component.

The drawer is a three-step machine: `basket → checkout → done`. `add()` always
opens the drawer and forces `basket`. `/checkout` shares the same context but
routes to `/checkout/confirmed` rather than reaching `done`.

## Server vs client components

Pages live under `app/[lang]/` and are server components — they own
`generateMetadata`, `generateStaticParams`, and pull data straight from `lib/`.
Each one gets `params: Promise<{ lang: string }>`; turn it into a `Locale` with
`localeOf(params)` from `@/lib/seo` rather than reading the string directly.
The root layout is `app/[lang]/layout.tsx` — it owns `<html lang>`. Interactivity lives in `components/`, marked `'use client'`.

Much of `components/ui/` is deliberately server-side (`Plate`, `Section`,
`icons`) so server pages can use it without opening a client boundary. Don't add
`'use client'` to a `components/ui/` file that doesn't need hooks.

`Link` is the exception, and it pulls two others with it: it must read the URL
to know which locale to prefix, so it is a client component, and `Button` (when
given an `href`) and `Breadcrumb` open a client boundary through it. That is the
price of locale-aware links; `next/link` was already a client component, so the
extra cost is small.

Shop filters live in `searchParams`, read via `useSearchParams` — which forces
the consumer into a `<Suspense>` boundary. `app/shop/page.tsx` shows the shape.

## Data and content

- `lib/api.ts` is the API client — `getProducts`/`getProduct`/
  `getRelatedProducts`, `getCategories`/`getCategory`, `getReviews`/
  `getAllReviews`, `getBlogPosts`/`getBlogPost`, `createOrder`. It maps the
  API's snake_case/numeric-id shapes (`ApiProduct`, `ApiCategory`, …) onto the
  `types/index.ts` domain types. Add new endpoints here, not as inline `fetch`
  calls in a page.
- `lib/constants.ts` holds every figure used on more than one screen
  (free-delivery threshold, delivery fee, promo discount and code, cut-off,
  variant multipliers, page size). Import from there; don't inline the number.
- `lib/catalog.ts` is what's left after the catalogue moved to the API: sort
  options, the variant-price and product-description helpers, the static
  filter vocabularies, and the price-range bounds. Its commented-out `CATALOG`
  array is dead — don't revive it.
- `types/index.ts`'s `Occasion`, `FlowerType`, `FlowerColor` and `ProductTag`
  are leftover string-literal unions from that same pre-API catalogue —
  `Product` no longer carries occasion/type/color/tag fields, so nothing
  currently types against them. `VariantSize` is still live (the size chips on
  the product page).
- `lib/format.ts` has `uah()` for currency and Ukrainian plural helpers
  (`arrangementCount`, `savedCount`). Ukrainian pluralisation is not a simple
  `n === 1` check — use these rather than interpolating a count inline.

## Images

Every content photograph goes through `<Plate>` (`components/ui/Plate.tsx`),
which wraps `next/image` with the sepia mat, the aspect ratio and the optional
hover zoom. **There are no bare `<img>` tags** — keep it that way.

(The chrome logo in `Header`/`Footer` is the exception — it's `public/logo.png`
through a plain `next/image`, not a content photograph. The same file is copied
to `app/icon.png` and `app/apple-icon.png`, where Next's metadata file convention
turns it into the favicon — so don't also add an `icons` field to `metadata`.)

Decorative photography is **local**: the Unsplash originals were downloaded once
at 2000px into `public/photos/`, and `photo(key)` in `lib/images.ts` just builds
`/photos/<key>.jpg`. It takes no width — `next/image` resizes per use, so pass
`sizes` at the call site. It's still placeholder for the client's own
photography; when the real shots arrive, only the files in `public/photos/`
change. A product's main `image_url`, by contrast, comes straight from the API
(`lib/api.ts`) and stays remote — that's what the `api.migflowers.com/storage/**`
`remotePatterns` entry in `next.config.ts` is for. `photo()` covers only the
decorative stuff — the gallery, team photos, and the three extra angle shots
`productShots()` bolts onto every product.

`next.config.ts` also sets `images.dangerouslyAllowLocalIP: true`. That's not
vestigial — Next.js 16 blocks image optimization from local/private IPs by
default, and the backend genuinely is on `localhost:8080` in dev. Don't remove
it while that's true.

Icons come from `lucide-react` but are re-exported through
`components/ui/icons.tsx` — import from there, not from `lucide-react`
directly. That file also exports the three stroke weights (`STROKE`,
`STROKE_HEAVY`, `STROKE_LIGHT`) the design uses; pass one rather than a literal.

## Conventions

- Path alias `@/*` maps to the repo root, so `@/lib/...`, `@/components/...`,
  `@/types`. `components/` is intentionally **outside** `app/` — `app/` is the
  routing tree, plus the three things that must sit at the domain root:
  `robots.ts`, `sitemap.ts` and the icons.
- Comments in this codebase explain *why* a non-obvious choice was made (the
  `min(100%, …)` in `.grid-auto`, the ring-not-gap trick on the occasion cells,
  the free delivery on an empty cart). Match that bar: skip comments that
  restate the code, write them when the reason isn't visible.
- `.Codex/` and `AGENTS.md` are gitignored in this repo, so this file is local
  and untracked — don't assume a teammate has it.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
