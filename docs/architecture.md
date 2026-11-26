# Storefront architecture

> **Status: migrated (2026-11-26).** Every page is a thin route over a
> `views/` slice. Nothing of the old structure is left: `src/` holds only
> `app/` and the five layers.

Rewritten 2026-11-24. It replaces the 2026-11-15 proposal (`server/`,
`models/`, `elements/`, `components/`), which was never applied.

---

## Layers

```
src/
  app/        routes and route handlers: adapters only
  views/      one slice per page: the page component and its loader
  widgets/    composed blocks reused across pages (products, cart, header)
  features/   things a user does: toggle a favorite, add to cart, edit cart
  entities/   domain objects: types, reads, client stores, pure logic; no UI
  shared/     no domain: Sanity client, UI kit, URL helpers, config
```

A **slice** is one folder in a layer (`entities/product`, `views/category`).
Inside a slice, code is split by segment: `ui/`, `api/` (data access),
`model/` (types, stores, params, `constants.ts`), `lib/` (pure logic).
Entities have no `ui/` segment: lint rejects JSX there. How an entity looks
is a widget or view; what a user does with it is a feature.

A slice that reads Sanity keeps its GROQ in `api/queries.ts`, next to the
reads that use it. Fragments every product query shares (`genresProjection`,
the discount window) live in `shared/api/sanity/fragments.ts`. The feed
query is `entities/product`'s; the search query is
`features/search-products`'.

### Import rules

1. A slice imports only from **layers below** its own, never from another
   slice of the same layer.
2. Import **straight from the file** that defines the name
   (`@/widgets/products/ui/ProductCard`). There are no `index.ts` barrels and
   nothing is re-exported: a barrel imported by a client component is bundled
   whole, so it drags in code the page never uses.
3. Inside a slice, imports are **relative**.
4. Every file that only makes sense on the server (the Sanity client, entity
   reads, view loaders) starts with `import "server-only"`, so the build
   fails if a client component reaches it.

`npm run lint` enforces 1 and 3 with `no-restricted-imports` (see
`eslint.config.mjs`); `server-only` enforces 4 at build time.

### Where former root modules went

- Helpers and regexes: `shared/lib`. Constants, enums and the environment
  gate (`isProduction`, `shared/config/env.ts`): `shared/config`.
- Domain types live in their entity: `Product` in `entities/product`,
  `Review` in `entities/review`, banners in `entities/banner`, Instagram
  posts in `entities/instagram-post`. Entities may import each other's
  types with `import type`, never values (see below).
- Domain helpers (series, average rating, the product-to-analytics mapping)
  live in `entities/product/lib`; `shared/lib/ecommerceTracking` only knows
  a generic `TrackedItem`.
- The UTM store: `entities/utm`.
- There is one Sanity client and one cache tag, in `shared/api/sanity`.

The root layout composes `widgets/header` (which composes
`features/search-products` and the cart entity's button and modal),
`widgets/footer`, `features/track-utm`, and the analytics tags in
`shared/ui/analytics`, which it renders only when `isProduction`.

## Data

| Layer | Holds |
| --- | --- |
| `shared/api` | raw clients (`sanityFetch`, `fetchSanityDataServer`) |
| `entities` | reads (`getCategory`, `getProductSelection`, `getProductsBySlugs`), client stores (favorites), client queries over our own routes (`useListingBySlugs`) |
| `features` | user actions and writes |
| `views` | the page loader only (`loadCategoryView`), composing entity reads; home is the exception, one combined query of its own in `views/home/api` |
| `widgets` | usually no data access: data comes in as props |
| `app` | adapters: route files and route handlers call one loader or read |

**Fetching:**

- The default is a Server Component reading `searchParams`, with `Suspense`
  for slow sections.
- No Server Actions for reads.
- Data that exists only in the browser (favorites are slugs in
  `localStorage`) goes through TanStack Query, calling a narrow route of our
  own (`GET /api/products?slug=…`). `QueryProvider` sits in the root layout.

### URL params: parse once at the edge

- `app/**/page.tsx` is the only place raw `searchParams` exist, and it parses
  them right away.
- Whoever owns a param defines its parser:
  - `filter`, `sort` and `page` belong to the listing:
    `entities/product/model/listingParams.ts` (`parseListingParams`,
    `listingHref`).
  - `subcategory` (the genre tab) only means something on a category page:
    `views/category/model/categoryParams.ts` (`parseCategoryParams`,
    `categoryHref`).
- Everything below `app/` takes typed params. Links are built from typed
  values: the page's own params make a `baseHref` (`categoryHref`), and
  `listingHref` puts the listing's params on top.
- `listProducts` returns the resolved choices as `listing.params`, with
  defaults left out, so a value the listing rejected never travels into a
  link.
- Exception: `/favorites` is a static page, so its client component is the
  edge and parses `useSearchParams()` itself.

## Composition

**Slots over imports.** A block leaves slots and a higher layer fills them,
so it never imports the features it shows:

```tsx
// widgets/products/ui/ProductList.tsx
<ProductCard
  product={product}
  topAction={<ToggleFavorite slug={product.slug} />}
  action={<AddToCart product={product} />}
/>
```

**Route files stay thin:** read params, call the view's loader, render the
view, or `notFound()`.

```tsx
const [{ category }, query] = await Promise.all([params, searchParams]);
const view = await loadCategoryView(
  category,
  parseListingParams(query),
  parseCategoryParams(query)
);
if (!view) notFound();
return <CategoryView {...view} />;
```

The same rule joins slices of one layer that may not import each other:
the root layout passes `widgets/cart`'s `HeaderCart` into `widgets/header`
as its `cart` slot, and the checkout view passes the cart widget's list and
totals into `features/checkout`'s form (`cartList`, `renderTotal`).

**Types across entities.** An entity owns its types, and another entity
may `import type` them (a category's `Product[]`). Lint allows only
type-only imports between entities (`allowTypeImports` on the TypeScript
`no-restricted-imports`): types are erased at build time, so no runtime
coupling appears.

## Conventions

- Components get a `/** */` doc; props get one-line `/* */` docs.
- A comment longer than one line is always a `/** */` block, one ` * ` per
  line, never `/* */` over several lines or a run of `//` lines.
- No JSX in variables: extract a small component instead.
- Conditionals are `cond && <X />`, with numbers coerced by `!!`.
- No classes.

## Migration order

No big-bang restructure.

1. **Checkout and open routes: done (2026-11-25).** The order is placed by
   one server action, `features/checkout/api/createOrder.ts`. It validates
   the form with the schema the browser also uses, re-prices the cart from
   Sanity past the API CDN (`entities/cart/api/quoteCart.ts`, pure rules in
   `entities/cart/lib/pricing.ts`, integer kopecks), checks the promo code
   and payment rules, then creates the KeyCRM order, notifies Telegram,
   emails the customer and creates the MonoPay invoice for the amount it
   computed. If the total differs from the one the customer saw, nothing is
   created. The cart in localStorage is `{ id, quantity }` plus a promo code;
   everything it shows comes from `GET /api/cart`. `/api/keycrm`,
   `/api/send-email`, `/api/monopay/invoice` and `/api/sanity` are gone;
   `/api/telegram` takes typed form fields only. Integrations live in
   `shared/api/{keycrm,monopay,telegram,email,nova-poshta}`.
2. **Remaining pages: done (2026-11-26).** Home, product, contacts,
   delivery, the legal pages and not-found are `views/` slices; the header
   and footer are widgets; `src/components/` is deleted with every
   duplicate it held. Slices it added:
   - views: `home`, `product`, `contacts`, `delivery`, `privacy-policy`,
     `public-contract`, `return-policy`, `not-found`
   - widgets: `header`, `footer`, `products` (card, grid, slider and the
     slider section, formerly `product-grid`), `cart` (list, line, totals,
     modal, header cart)
   - features: `callback`, `write-review`, `search-products`, `track-utm`,
     `edit-cart` (quantity, remove, clear), `begin-checkout`;
     `add-to-cart` gained the product-page button (every buy button shares
     `useAddToCartFlight`), `toggle-favorite` a `size` prop
   - entities: `review`, `banner`, `reviewed-product`, `utm`; `category`
     gained the menu read and `categoryHref`, which every category link now
     uses
   - shared: `ui/swiper`, `ui/image-viewer`, `ui/rating-field`,
     `ui/analytics`, `lib/useScreenWidth`, `lib/useImageTap`
3. **Stores: done (2026-11-26).** The viewed-books history is
   `entities/reviewed-product`, slugs only, with cards fetched through
   `GET /api/products` like favorites. The UTM store is `entities/utm`,
   read by both `features/track-utm` and `features/checkout`.
4. **Before auth:** Sanity TypeGen, then the generated types replace the
   hand-written entity types. The legacy root modules are all folded in (2026-11-26).

Unit tests on pricing are the highest-value tests to add: pure logic, where
the money is.

## Known issues found during the review

Recorded 2026-11-15. Fixed 2026-11-25 by the checkout migration: the
client-set invoice amount, the open KeyCRM, email and Telegram routes, the
unchecked webhook amount (now compared with the KeyCRM order total), the
winter-time bug, the raw payment-method strings and the webhook's Telegram
URL. Still open:

- The Sanity dataset is public, so promo codes are readable through Sanity's
  public API. The storefront no longer trusts anything the browser says
  about them, but they cannot be kept secret.
- Order submission has no rate limiting.
- `shared/api/nova-poshta/client.ts` falls back to
  `NEXT_PUBLIC_NOVA_POSHTA_API_KEY` (read on the server only). Remove the
  fallback once `NOVA_POSHTA_API_KEY` is set in Vercel for both scopes.
- Payment and delivery enums (`shared/config/enums.ts`) double as the label the
  customer sees and the value KeyCRM stores, so changing the wording changes
  CRM data. Split them into stable keys with label and KeyCRM maps.
- Two MonoPay callbacks for one order racing on different server instances
  can still both record the payment; on one instance they are serialized.
