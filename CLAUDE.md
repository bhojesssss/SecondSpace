# SecondSpace — Thrift Marketplace

Vue 3 + Vite + Tailwind v4 SPA for buying/selling preloved fashion & sports gear.

## Tech Stack

- Vue 3 (Composition API, `<script setup>`)
- Vue Router (SPA, `createWebHistory`)
- Vite (build)
- Tailwind CSS v4 — scoped styles use `@reference "../assets/main.css"` to access utilities + `glass-panel`
- No state management library yet (refs/computed inside views)

## Design Philosophy

**Neo-brutalism with glassmorphism accents.**

- Bold black borders, hard offset shadows (2D, no blur), strong typography for brutalist feel
- Glass panels (semi-transparent white + backdrop blur) for input/card surfaces — the "glass touch"
- High-contrast CTAs: black border + brand-color fill + offset shadow that shrinks on hover (button "presses in")
- Asymmetric color blocks, geometric corners

## Color Palette

| Token           | Value     | Use                                   |
| --------------- | --------- | ------------------------------------- |
| Background      | `#FDF0D5` | Cream — page background everywhere    |
| Fashion primary | `#C1121F` | Red — fashion section accent          |
| Fashion dark    | `#780000` | Deep red — fashion gradient companion |
| Sports primary  | `#669BBC` | Blue — sports section accent          |
| Sports dark     | `#003049` | Navy — sports gradient companion      |
| Text            | `#111111` | Near-black for body                   |
| White           | `#FFFFFF` | Cards, surfaces                       |

Gradients are always `135deg`:

- Fashion: `linear-gradient(135deg, #C1121F, #780000)`
- Sports: `linear-gradient(135deg, #669BBC, #003049)`
- Dark: `linear-gradient(135deg, #111111, #333333)`

## Typography

- **CalSans** (`font-family: 'CalSans', serif`) — page titles, big headings, prices, total values
- **Helvetica** (default body via `main.css`) — everything else

Both fonts loaded via `@font-face` in `src/assets/main.css`. Use inline `style="font-family: 'CalSans', serif"` for one-offs or set in scoped CSS.

## Page Structure (every view)

- Root wrapper class `<page>-root` (e.g. `home-root`, `cart-root`) with `padding: 1rem` and `pb-8`
- Sections grouped with `class="section-gap"` (mb-6 to mb-10) and `reveal` for scroll animations
- Section heading pattern: `section-title-wrap` (flex + gap-3) containing `section-accent` (vertical w-1 colored bar) + `<h1/h3>` (CalSans)
- Do NOT add `max-w-*` constraints in views — `<main>` in `App.vue` constrains via `max-w-5xl`

## Button Shapes (strict)

**No pills.** All buttons are rounded squares.

- Big text / CTA / inputs / tabs: `rounded-xl` (12px)
- Small icon buttons (≤32px) / chips: `rounded-lg` (8px)
- Tiny text badges (count badges, tag labels): `rounded-md` (6px)
- Avatar circles, indicator dots, accent bars, decorative blobs: `rounded-full` (these are NOT buttons — keep them round)

## Component Patterns

**Brutalist CTA**: `border-2 border-black` + `box-shadow: 4px 4px 0 0 #111` + on hover `transform: translate(2px, 2px)` and shadow shrinks to `2px 2px 0 0 #111`. On `:active`, translate goes to `(4px, 4px)` and shadow collapses to `0 0 0 0 #111` ("button settles into shadow").

**Brutalist primitives (in `main.css`)** — apply directly as classes, no @apply needed:

- `brutal-cta` — primary CTA (4px offset, full press: hover 2px translate, active settles)
- `brutal-cta-sm` — compact CTA for navbar / chips (3px offset, hover 1.5px translate)
- `brutal-surface` — static card/panel (4px offset, no hover)
- `brutal-surface-sm` — compact surface (3px offset)
- `brutal-shadow-fashion` / `brutal-shadow-sports` — alt brand-colored offset shadow

When a scoped style needs custom hover/colors, replicate the pattern locally: `border: 2px solid #111; box-shadow: Npx Npx 0 0 #111;` + matching `transform/box-shadow` transition.

**Glass panel**: `class="glass-panel"` (defined in `main.css`). Pair with `border border-black/10` when extra definition is needed. For brutalist cards, layer `border: 2px solid #111` + offset shadow on top of `glass-panel` (the glass becomes the fill, the brutalist frame holds it).

**Cards**: `rounded-2xl` + `glass-panel` for product / item / notification / chat cards.

**Empty state**: Lucide-style stroke SVG inside `w-20 h-20 rounded-full` gradient circle (fashion or sports), CalSans title, subtle subtitle.

**Section color coding**:

- Fashion content → `fashion-accent` / red gradient
- Sports content → `sports-accent` / blue gradient
- Neutral pages (cart, profile, auth) → fashion accent

## Icons

- Lucide-style stroke SVGs (no fill, `stroke-width: 1.8-2.4`, `stroke-linecap/linejoin: round`)
- Size 16–22px typical
- Inline directly, or via `v-html` with a string map for dynamic lists (see `ProfileView.vue` `icons` map)
- Never emoji in UI chrome — use SVG line icons for minimalist consistency

## Files of Interest

- `src/assets/main.css` — theme tokens, fonts, `glass-panel`, scroll reveal classes
- `src/composables/useScrollReveal.js` — call `useScrollReveal()` at top of every view's `<script setup>`
- `src/components/ProductCard.vue` — reusable card
- `src/components/NavbarTop.vue` (desktop) / `NavbarBottom.vue` (mobile)
- `src/views/HomeView.vue` — primary design reference for new pages
- `src/App.vue` — root layout; switches navbar on `md` breakpoint, hides navbars on auth routes
- `src/router/index.js` — route definitions

## Conventions

- Mobile-first: NavbarBottom on mobile, NavbarTop on desktop, switch at `md` (768px)
- Use `useScrollReveal()` + `class="reveal"` (and `reveal-delay-1..4`) on top-level sections for fade-in
- Format prices with `price.toLocaleString('id-ID')` — typically a `formatPrice` helper per view
- Use `<router-link>` for internal nav, never raw `<a>`
- Auth pages (login/register) hide both navbars (handled in `App.vue` via `isAuthPage` check)

## Responsive / Mobile

**Target breakpoints** (Tailwind defaults):

- Mobile L (primary mobile target): **425px** — below `sm`
- `sm`: 640px
- `md`: 768px — navbar swap (NavbarBottom → NavbarTop)
- `lg`: 1024px

**Mobile-first conventions baked in across views:**

- Cart items stay row-layout at all sizes (`flex-row` always); thumbnail is `w-24 h-24 sm:w-32 sm:h-32` — never full-width at mobile
- Hero card padding: `p-6 sm:p-8` (less padding at narrow widths)
- Auth card padding: `p-5 sm:p-7`; offset shadow scales `6px → 8px` at sm+
- Carousel headline: `text-3xl sm:text-4xl md:text-5xl`
- Carousel height: 240px → 280px (sm) → 300px (md) via media query (`.carousel-h`)
- Carousel slide inner padding: `px-7 sm:px-12 md:px-16 py-7 sm:py-9 md:py-10` (horizontal lega untuk hindari arrow overlap, vertical buat jarak ke dots/edges)
- Stats / count pills: `gap-2 sm:gap-3`, `px-3 sm:px-4`, `text-[11px] sm:text-xs`, with `whitespace-nowrap` on individual stat texts so they don't break mid-word
- Stat cards grid: `gap-2 sm:gap-3 px-1 sm:px-2`, card padding `p-3 sm:p-4`, value `text-lg sm:text-xl`, label `text-[9px] sm:text-[10px]`
- Catalog tab buttons: `px-5 sm:px-6`; catalog category chips: `px-4 sm:px-5`, `text-xs sm:text-sm`
- Catalog product grid gap: `gap-3 sm:gap-4`
- Product detail title: `text-xl sm:text-2xl`; price: `text-2xl sm:text-3xl`; CTA buttons: `py-3 sm:py-3.5`, `text-xs sm:text-sm`
- Notification / chat list items: `gap-3 sm:gap-4`, `p-3 sm:p-5` (or `p-3 sm:p-4`)
- Notification mark-all button: `text-[11px] sm:text-xs`, `px-3 sm:px-4`, with `whitespace-nowrap`
- Auth title `text-2xl sm:text-3xl`

**Active chat height fix (mobile):**
The active-chat container in `ChatView.vue` uses `height: calc(100dvh - 12rem)` at mobile and `calc(100dvh - 8rem)` at md+ — the larger subtraction at mobile accounts for fixed NavbarBottom (h-16) + bottom spacer (pb-20) + main padding. `100dvh` (dynamic viewport) handles mobile address-bar collapse better than `100vh`.

**When adding new views:**

- Default to mobile-friendly sizing first, then scale up with `sm:` / `md:` prefixes
- For row-style list items (cart, chat, notif), prefer `flex-row` with smaller thumbnail at mobile rather than `flex-col` with full-width image
- For stat-pill / horizontal bar-style content, add `whitespace-nowrap` on items to prevent ugly mid-word wrapping at narrow widths
- For fixed-height sections that need to fill viewport, use `dvh` not `vh`, and account for NavbarBottom + spacer (~144px) at mobile
