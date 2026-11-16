# Storefront target architecture

> **Status: PROPOSAL — not the current structure.**
>
> This describes where `glimmer-front` should move to over time. The code does
> not follow it yet.
>
> **AI agents and pipelines: do not apply this document.** Follow the existing
> structure and conventions of the code you are touching (see the workspace
> `CLAUDE.md`). Do not move files, create the folders below, rename things to
> match this, or "align" code with it as a side effect of another task. Only act
> on it when a task explicitly says it is a migration step from this document.

Drafted 2026-11-15.

---

## Why

Today UI, data fetching, vendor calls and business rules sit together. The
clearest example is checkout: `src/utils/handleSubmitForm.ts` runs the whole
order flow in the browser — re-pricing, promo validation, building the KeyCRM
order, the Telegram message, the email and the MonoPay amount — and the API
routes forward whatever the browser sends. That is hard to change safely and is
also a security problem (see [Known issues](#known-issues-found-during-the-review)).

The goal is a structure where each kind of code has one obvious home, the
browser never decides anything that costs money, and import rules can be
enforced by lint rather than by memory.

## Folder layout

```
src/
  app/            routes: config, data loading, composition — no logic
  server/         server-only (`import "server-only"`)
    integrations/ one folder per vendor: sanity, keycrm, monopay,
                  novaPoshta, telegram, resend, (db)
    services/     business rules: catalog, pricing, checkout, auth — no React
  models/         shared app types: Product, Order, CartLine, User…
  elements/       dumb UI: Button, Modal, Input, Price, Rating
  components/     domain-aware UI: product/, review/, session/…
  features/       user actions with state/side effects:
                  cart/, favorites/, checkout/, auth/
  lib/            env, generic utilities
```

### Naming

- **Elements** — dumb UI. Know nothing about books, orders or users.
- **Components** — domain-aware UI. Know what a product or review is and how it
  looks, but do not change state or call the server.
- **Features** — things a user *does*: add to cart, favorite, check out, log in.
  Own their store, schema, server actions and the UI for that action.

"Component" here means this layer specifically, not "any React component".

## Import rules

1. Imports go **downwards only**:
   `app → features → components → elements`, and everything may use `models`
   and `lib`.
2. Every folder in `features/` and `components/` exposes an `index.ts`. Nothing
   imports past it (no `features/cart/store.ts` from outside `features/cart`).
3. Sideways imports between features are allowed through that `index.ts`, with
   no cycles.
4. A shared thing lives with **its owner** — the code that changes it. It moves
   down a layer only when it has no single owner.
5. `server/` is imported only by pages, server components, server actions and
   route handlers. Never by client components.

Enforce 1, 2 and 5 with `eslint-plugin-boundaries` or
`import/no-restricted-paths`, so `npm run lint` catches violations.

## How the UI reaches the server

```
Server component ──────────────┐
Client component → action ─────┼─→ server/services → server/integrations → vendor
External system → app/api/ ────┘
```

- **Server components** (pages, async sections) call services directly.
- **Client components** call **server actions** — `"use server"` files inside
  their feature, e.g. `features/checkout/actions.ts`. A client import of such a
  file only gets a stub; calling it is a POST to the server, which runs the real
  function. This is the only bridge from browser code to server code.
- **Route handlers** in `app/api/` are only for callers that are not our UI:
  the MonoPay webhook, the product feed.

Server action rules:

- Thin: validate input → call one service → return a plain result.
- Every action is a public endpoint. Validate input with the feature's schema,
  and check the session inside the action once auth exists.
- Arguments and return values must be serializable.
- Never return secrets or raw vendor responses.

Client state (cart, favorites, UTM) stays in zustand stores inside its feature.
It reaches the server only as action input — cart as ids and quantities, never
prices.

## Shared UI and stores

**Composition over imports.** A domain component leaves slots for actions, and
the page fills them:

```tsx
// components/product/ProductCard.tsx — renders a book, imports no feature
export function ProductCard({ product, actions }: { product: Product; actions?: ReactNode }) { … }

// in a page
<ProductCard product={p} actions={<><AddToCartButton product={p} /><FavoriteToggle id={p.id} /></>} />
```

**Stores** live with their feature: the cart store in `features/cart/`, used
elsewhere through `features/cart` exports such as `useCartCount`.

**Auth** is two things:

- "Who is the current user" — read everywhere → `components/session`
  (`useSession()`) and `server/services/auth` (`getSession()`). The `User` type
  is in `models/`.
- "Log in / log out / register" — user actions → `features/auth`.

## Types and models

| Kind | Example | Lives in | Visible to |
| --- | --- | --- | --- |
| Source | Sanity document, KeyCRM payload, DB row | `server/integrations/<vendor>/types.ts` (Sanity: generated by TypeGen) | server only |
| Model | `Product`, `Order`, `CartLine`, `User` | `models/` — types and pure helpers, no server or React imports | server and client |
| Input | `CheckoutInput = InferType<typeof checkoutSchema>` | the feature, e.g. `features/checkout/schema.ts` | form and its action |
| View | formatted price, badge text, grouped cart lines | next to the component, e.g. `components/product/productCard.view.ts` | client only |

- Source → model mapping happens **once**, in the integration
  (`toProduct`, `toKeyCrmOrder`). Only the integration knows the vendor shape.
- Model and DTO are the same type unless they genuinely differ. The API between
  server and client is the service's return type.
- A GROQ projection is already a mapper. If the query returns exactly
  `Product`'s fields, the TypeGen result *is* the model — no mapping function.

## Pages

A `page.tsx` contains:

1. **Route config** — `revalidate`, `dynamic`, `generateStaticParams`,
   `generateMetadata`. These must be literal exports in the route file.
2. **Data loading** — service calls, in parallel where possible. Wrap shared
   fetches (`getProduct`) in React `cache()` so metadata and page share one
   request.
3. **Composition** — features and components in page order. Pages own layout.
4. **Nothing else** — no hooks, no `"use client"`, no business conditions.

Rough guide: past ~80 lines, something belongs in a component.

**Who fetches:** the page fetches what it cannot exist without (the product,
the listing — needed for `notFound()` and metadata). Independent, slower
sections (recommendations, reviews) are async server components that fetch
their own data inside `<Suspense>`.

**Page-only sections** (home hero, about text, delivery conditions, legal
texts) are colocated in a private folder next to the route, not in a mirror
tree under `components/<page>Page/`:

```
app/
  page.tsx
  _sections/Hero.tsx, PromoBanner.tsx
  delivery/
    page.tsx
    _sections/DeliveryConditions.tsx
```

Promote a section to `components/` or `features/` when a second place needs it.

**Caching:** route-level `revalidate` stays in the page. Data-level cache tags
(what the Sanity webhook invalidates) are attached in
`server/integrations/sanity`, per query. Anything session-dependent stays in a
client component or a Suspense island, so catalog and product pages remain
static after auth ships.

## Current → target mapping

| Today | Target |
| --- | --- |
| `utils/handleSubmitForm.ts` | `features/checkout/actions.ts` → `server/services/checkout` |
| `utils/fetchSanityDataClient.ts`, `app/api/sanity` | removed; server components or small actions |
| `app/api/keycrm`, `telegram`, `send-email` | removed as routes; `server/integrations/*` called by services |
| `app/api/monopay/invoice` | `server/integrations/monopay`, amount computed by `services/pricing` |
| `app/api/monopay/webhook`, `app/api/feed` | stay as route handlers |
| `lib/sanityClient.ts`, `lib/queries.ts` | `server/integrations/sanity/{client,queries/*}` + TypeGen |
| `utils/sendDataToKeyCrm.ts` | `server/integrations/keycrm` |
| `utils/getNPCities.ts`, `getNpBranches.ts` | `server/integrations/novaPoshta` + actions |
| `types/*` | `models/*` |
| `components/shared/productCard/` | `components/product/` |
| `components/shared/buttons`, `modals`, `formComponents`… | `elements/` |
| `store/cartStore.ts` | `features/cart/` |
| `store/favoritesStore.ts` | `features/favorites/` |
| `store/reviewedProductsStore.ts` | `components/product/` or `features/recentlyViewed/` |
| `components/<page>Page/*` | `app/<route>/_sections/` or promoted to `components/` / `features/` |
| styled-components | Tailwind, migrated when a file is touched anyway |

## Migration order

No big-bang restructure.

1. **Checkout and open routes — urgent.** One `createOrder` server action that
   re-prices, validates, creates the KeyCRM order and MonoPay invoice with a
   server-computed amount, and sends Telegram and email internally. Close the
   open routes. Webhook compares `finalAmount` with the order total. This
   creates `server/` in the process.
2. **Before auth:** `server/integrations` layer, Sanity TypeGen, `models/`,
   lint boundaries.
3. **Gradually:** move code into `features/`, `components/`, `elements/` and
   `_sections/`, and drop styled-components, as each area is touched for other
   work.

Unit tests on `server/services/pricing` are the highest-value tests to add —
pure logic, where the money is.

## Known issues found during the review

Recorded 2026-11-15; check whether they still hold before acting.

- `app/api/monopay/invoice` takes `amount` from the request body — a client can
  pay any amount. The webhook marks the KeyCRM order `paid` without comparing
  `finalAmount` with the order total.
- `app/api/keycrm` forwards any body to KeyCRM with the production key.
- `app/api/send-email` sends any subject/HTML to any address from
  `hello@glimmer.com.ua`.
- `app/api/telegram` posts any text to the operations group.
- The webhook computes Kyiv time as `setHours(+3)` — wrong during winter time
  (UTC+2). `utils/getKyivDate.ts` already does this correctly for dates.
- Payment methods are compared as raw strings
  (`"Оплата картою онлайн Visa, Mastercard"`) alongside the `PaymentOption`
  enum.
- The webhook builds `${SITE_URL}api/telegram` (no slash) while the invoice
  route uses `${SITE_URL}/confirmation` — one of them is wrong depending on
  whether `SITE_URL` ends with `/`.
- The Sanity dataset is public, so promo codes are readable through Sanity's
  public API regardless of `/api/sanity`.
