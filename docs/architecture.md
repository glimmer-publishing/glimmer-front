# Storefront architecture

> **Status: in migration.** The layered structure below is real for the
> catalog (`/catalog/[category]`, including `all` and `promo`), `/author`,
> `/series`, `/favorites`, `/about`, `/checkout` and `/confirmation`. Every other page still lives in
> `src/components/` and is moved over when it is next worked on. New code for
> the migrated pages goes into the layers; code for the other pages follows
> the existing structure until that page migrates.

Rewritten 2026-11-24. It replaces the 2026-11-15 proposal (`server/`,
`models/`, `elements/`, `components/`), which was never applied.

---

## Layers

```
src/
  app/        routes and route handlers: adapters only
  views/      one slice per page: the page component and its loader
  widgets/    composed blocks reused across pages (product grid, Instagram)
  features/   things a user does: toggle a favorite, add to cart
  entities/   domain objects: their types, reads, client stores and plain UI
  shared/     no domain: Sanity client, UI kit, URL helpers
```

A **slice** is one folder in a layer (`entities/product`, `views/category`).
Inside a slice, code is split by segment: `ui/`, `api/` (data access),
`model/` (types, stores, params, `constants.ts`), `lib/` (pure logic).

A slice that reads Sanity keeps its GROQ in `api/queries.ts`, next to the
reads that use it. Fragments every product query shares (`genresProjection`,
the discount window) live in `shared/api/sanity/fragments.ts`. Queries that
only legacy pages use stay in `src/lib/queries.ts` until those pages
migrate.

### Import rules

1. A slice imports only from **layers below** its own, never from another
   slice of the same layer.
2. Import **straight from the file** that defines the name
   (`@/entities/product/ui/ProductCard`). There are no `index.ts` barrels and
   nothing is re-exported: a barrel imported by a client component is bundled
   whole, so it drags in code the page never uses.
3. Inside a slice, imports are **relative**.
4. Every file that only makes sense on the server (the Sanity client, entity
   reads, view loaders) starts with `import "server-only"`, so the build
   fails if a client component reaches it.

`npm run lint` enforces 1 and 3 with `no-restricted-imports` (see
`eslint.config.mjs`); `server-only` enforces 4 at build time.

### Transitional rules

- The legacy root modules `@/lib`, `@/utils`, `@/types`, `@/constants` and
  `@/store` count as shared-level: the layers may import them, and they never
  import the layers. They move into `shared/` or an entity as their last
  legacy user migrates.
- The layers never import `@/components`. When a migrated page needs a legacy
  component, it is **duplicated** into `shared/ui` or the owning slice, and
  the duplicate is removed when the last legacy user migrates.
- Legacy code may import the layers.
- There is one Sanity client and one cache tag, in `shared/api/sanity`;
  legacy code imports them from there too.

Current duplicates, to remove as pages migrate:

| Layered copy | Legacy original |
| --- | --- |
| `shared/ui/*` (container, loader, dropdown, titles, section, section-description, main-button, icons, breadcrumbs, marquee-line, telegram-button) | `components/shared/*` |
| `entities/product/ui/ProductCard` | `components/shared/productCard/ProductCard` |
| `features/toggle-favorite` | `components/shared/productCard/FavoriteButton`, `components/productPage/productInfo/FavoriteButton` |
| `features/add-to-cart` (with `AddToCartAnimation`) | `components/shared/productCard/CartButton`, `components/shared/addToCartAnimation` |
| `widgets/telegram-cta`, `widgets/instagram` | `components/shared/telegramCTA`, `components/shared/instagram` |

## Data

| Layer | Holds |
| --- | --- |
| `shared/api` | raw clients (`sanityFetch`, `fetchSanityDataServer`) |
| `entities` | reads (`getCategory`, `getProductSelection`, `getProductsBySlugs`), client stores (favorites), client queries over our own routes (`useListingBySlugs`) |
| `features` | user actions and writes |
| `views` | the page loader only (`loadCategoryView`), composing entity reads |
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

**Slots over imports.** An entity's UI leaves slots and a higher layer fills
them, so entities never import features:

```tsx
// widgets/product-grid/ui/ProductList.tsx
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

**Shared types across entities.** Entities cannot import each other. A type
two entities both return (the catalog banner) lives in a shared-level module
(`@/types/promoBanner`), and both import it from there.

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
2. **Remaining pages** (home, product, contacts, checkout UI, delivery,
   legal) move into `views/` as they are worked on. Each move deletes the
   duplicates it frees.
3. **Stores:** `store/reviewedProductsStore.ts` → `entities/product` or its
   own entity (the cart is already `entities/cart`).
4. **Before auth:** Sanity TypeGen, and the legacy root modules folded into
   `shared/` and entities.

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
