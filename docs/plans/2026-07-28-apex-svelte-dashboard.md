# Apex Svelte Dashboard — Implementation Plan

> **For Hermes:** Use `subagent-driven-development` skill to implement this plan task-by-task.

**Goal:** Build a full, reusable SvelteKit admin dashboard template (`apex-svelte-dashboard`) that visually clones the Apex Dashboard Svelte demo — 36 pages across Overview, Commerce, Apps, Finance, System — to serve as the standard FE template for all future Miromi projects.

**Architecture:** SvelteKit 2 + Svelte 5 (runes API) SPA with adapter-static for easy embedding. Component-driven — every UI primitive built once in `src/lib/ui/`, pages compose them. Dark sidebar + light content shell, OKLCH theme tokens in Tailwind v4, JSON-based mock data per page (swappable for real APIs later). Storybook for isolated component development.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, TypeScript strict, Tailwind CSS 4 (OKLCH), shadcn-svelte + bits-ui primitives, LayerChart 2 for charts, @lucide/svelte icons, mode-watcher for dark mode, @fontsource Geist + Geist Mono, Storybook 8, Vitest + Playwright.

**Repo:** `hilmimuharromi/apex-svelte-dashboard` (public template repo — will be forked/cloned per project).

---

## Phase 0 — Repo & Foundations (Day 1)

### Task 0.1: Scaffold SvelteKit project
- Create: `apex-svelte-dashboard/` via `npx sv create`
- Options: SvelteKit demo=no, TypeScript=yes, ESLint+Prettier+Vitest+Playwright=yes
- Verify: `pnpm dev` boots on :5173

### Task 0.2: Install Tailwind v4 + shadcn-svelte
- `pnpm add -D tailwindcss @tailwindcss/vite`
- `pnpm dlx shadcn-svelte@latest init` (base color: neutral, style: default)
- Config: `src/app.css` imports Tailwind, defines OKLCH tokens (see design section below)
- Verify: `pnpm build` clean

### Task 0.3: Install remaining deps
- `pnpm add layerchart @lucide/svelte mode-watcher tailwind-variants bits-ui @fontsource/geist-sans @fontsource/geist-mono`
- `pnpm add -D @storybook/sveltekit`
- Verify: no peer dep warnings

### Task 0.4: Design tokens (OKLCH theme in app.css)
- Sidebar bg: `oklch(0.145 0 0)` (near-black)
- Primary/accent: `oklch(0.72 0.18 155)` (emerald-mint)
- Bg (light): `oklch(0.98 0.005 240)`
- Card: white + `shadow-sm`, `rounded-xl`
- Font: Geist Sans body, Geist Mono numbers
- Dark mode override: swap bg/fg/card tokens
- Verify: Storybook color swatches render both themes

### Task 0.5: Init repo + push
- `git init`, `.gitignore` (SvelteKit default)
- `gh repo create hilmimuharromi/apex-svelte-dashboard --public --source=. --push`
- Add MIT LICENSE + README (project purpose, tech stack, dev/build commands)
- Verify: repo visible on GitHub

---

## Phase 1 — Shell & Navigation (Day 2–3)

Build the persistent layout that wraps every page.

### Task 1.1: Root layout `+layout.svelte`
- Grid: sidebar (280px, collapsible to 72px) + header (64px) + main
- Slot for page content, mode-watcher wrapper for dark mode
- Files: `src/routes/+layout.svelte`, `src/lib/stores/sidebar.svelte.ts` (rune-based collapsed state, persisted)

### Task 1.2: Sidebar component
- Sections: OVERVIEW, COMMERCE, APPS, FINANCE, SYSTEM (collapsible group headers)
- Brand: "Apex DASHBOARD" (configurable via `$lib/config.ts`)
- Nav items with lucide icons + optional badge (e.g. Orders 12, Notifications 3)
- User card at bottom (avatar initials, name, role, logout)
- Files: `src/lib/layout/Sidebar.svelte`, `src/lib/layout/nav-items.ts`
- Active link detection via `$page.url.pathname`

### Task 1.3: Header component
- Search button `⌘K` (opens command palette)
- Primary CTA button (configurable per page)
- Theme toggle (mode-watcher)
- Customize theme drawer trigger
- Notifications popover (bell + dot)
- User menu popover (avatar → profile/settings/logout)
- Files: `src/lib/layout/Header.svelte`

### Task 1.4: Command palette (⌘K)
- Modal with fuzzy search over all nav items + quick actions
- Files: `src/lib/layout/CommandPalette.svelte`
- Uses `cmdk-sv` or custom bits-ui dialog
- Keyboard: Cmd/Ctrl+K to open, Esc to close, arrows to navigate

### Task 1.5: Theme customizer drawer
- Right-side sheet: primary color picker (6 presets), radius slider (0–1rem), sidebar variant (dark/light), font selector
- Persists to localStorage, applies via CSS custom props
- Files: `src/lib/layout/ThemeCustomizer.svelte`

### Task 1.6: Notification & user popovers
- Reusable Popover (bits-ui)
- Notifications: list of 3 mock items + "View all"
- User menu: Profile / Settings / Log out
- Files: `src/lib/layout/NotificationsPopover.svelte`, `UserMenu.svelte`

---

## Phase 2 — UI Component Library (Day 4–6)

Every reusable primitive lives in `src/lib/ui/`. One file per component, Storybook story per component.

### Task 2.1: Base primitives (shadcn-svelte)
- `Button`, `Badge`, `Card`, `Input`, `Label`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`
- Install via `pnpm dlx shadcn-svelte@latest add <name>`
- Verify each renders in Storybook with all variants

### Task 2.2: Data display
- `Table` (sortable, sticky header, row hover)
- `Pagination` (page numbers + prev/next)
- `StatCard` (label, value, delta% with up/down arrow, sparkline optional)
- `ProgressBar` (label + % + description)
- `Avatar` (initials fallback, image, size variants)
- `StatusPill` (Completed/Processing/Pending/Cancelled + color map)

### Task 2.3: Overlays
- `Dialog`, `Sheet` (drawer), `Popover`, `Tooltip`, `DropdownMenu`, `Toast` (sonner-svelte)

### Task 2.4: Charts (LayerChart wrappers)
- `LineChart`, `BarChart`, `AreaChart`, `DonutChart`, `Sparkline`
- Props: data, color(s), height, showAxes, showLegend
- Consistent tooltip style

### Task 2.5: Forms
- `FormField` wrapper (label + input + error msg)
- `DatePicker` (bits-ui calendar)
- `FileUpload` (drag-and-drop zone)

### Task 2.6: Empty & loading states
- `EmptyState` (icon + title + description + optional CTA)
- `Skeleton` (block, text, avatar variants)
- `Spinner`

---

## Phase 3 — Overview Pages (Day 7–9)

### Task 3.1: `/` Dashboard (default)
- 4 StatCards (Revenue, Users, Orders, Page Views)
- Overview chart card (tabs: Revenue/Orders/Profit → LineChart) + right sidebar with totals (Total, Avg, Peak, YoY)
- Traffic Sources DonutChart + legend
- Goals card (3 ProgressBars)
- Recent Orders Table (6 rows, View all link)
- Files: `src/routes/+page.svelte`, `src/lib/data/dashboard.ts`

### Task 3.2: `/analytics`
- Traffic overview (AreaChart, date range picker)
- Top pages Table
- Device breakdown (DonutChart)
- Geo map (simple SVG world or grid) — or Table if too heavy
- Bounce rate + session duration stat cards

### Task 3.3: `/ecommerce`
- Sales metrics grid
- Revenue by category (BarChart)
- Top products Table
- Sales funnel (custom horizontal bars)

### Task 3.4: `/crm`
- Pipeline stages (Kanban-style columns, read-only)
- Deals Table
- Contact activity feed

### Task 3.5: `/saas`
- MRR/ARR StatCards
- Subscription growth (AreaChart)
- Churn rate + retention cohort (table heatmap)

### Task 3.6: `/charts`
- Gallery page: every chart variant with sample data + code snippet
- Reference doc for future devs

---

## Phase 4 — Commerce Pages (Day 10–11)

### Task 4.1: `/orders` (list)
- Filters: status, date range, search
- Table: OrderID, Customer, Product, Amount, Status, Date, Actions
- Bulk actions (checkbox column + toolbar)
- Pagination

### Task 4.2: `/orders/[id]` (detail)
- Order header (ID, date, status, actions: refund/cancel/mark shipped)
- Customer card + shipping address
- Line items Table
- Timeline (status history)

### Task 4.3: `/products` (list)
- Grid or Table toggle
- Filters (category, stock status, price range)
- Product card: image, name, price, stock badge

### Task 4.4: `/products/new` and `/products/[id]/edit`
- Form: name, description (textarea), price, stock, category, images (FileUpload)
- Save/Cancel buttons

### Task 4.5: `/customers` (list)
- Table: Avatar+Name, Email, Orders count, Total spent, Last order, Status
- Row click → `/customers/[id]`

### Task 4.6: `/customers/[id]`
- Profile header (avatar, name, contact, tags)
- Stats row (LTV, orders, avg order)
- Order history Table + Activity timeline (tabs)

### Task 4.7: `/invoices` (list) + `/invoices/[id]`
- List: Table with Invoice#, Client, Amount, Status, Due date
- Detail: printable invoice layout, line items, totals, Pay/Download buttons

---

## Phase 5 — Apps Pages (Day 12–14)

### Task 5.1: `/mail`
- 3-column: folders sidebar / mail list / preview pane
- Mock threads, star/archive/delete actions

### Task 5.2: `/chat`
- 2-column: conversations list / chat pane with bubbles + input
- Mock messages with timestamps and read receipts

### Task 5.3: `/files`
- Breadcrumb + folder grid + file list toggle
- Upload button, right-click context menu

### Task 5.4: `/kanban`
- Drag-and-drop board (svelte-dnd-action)
- 4 columns: Todo/In Progress/Review/Done
- Card: title, tags, avatar, due date

### Task 5.5: `/calendar`
- Month view (7-col grid, current month + prev/next nav)
- Event dots on days, click day → events list
- Add event dialog

### Task 5.6: `/wizard`
- Multi-step form (4 steps: Details → Address → Payment → Confirm)
- Progress indicator top
- Prev/Next buttons, Submit on final step

### Task 5.7: `/forms`
- Showcase page: all form primitives with examples + validation states

---

## Phase 6 — Finance & System Pages (Day 15–16)

### Task 6.1: `/billing`
- Current plan card + upgrade CTA
- Payment methods list (add/remove)
- Invoices history Table
- Usage meters (ProgressBars)

### Task 6.2: `/users` (list)
- Table with Role filter, Invite button
- Row actions: edit, deactivate

### Task 6.3: `/users/[id]`
- Profile edit form + permissions matrix

### Task 6.4: `/notifications`
- Full-page list (grouped by day)
- Mark all read, filter by type

### Task 6.5: `/settings`
- Left tabs: General / Account / Security / API keys / Integrations / Appearance
- Each tab a form section

### Task 6.6: `/help` (Help & Support)
- Search box + FAQ accordion + contact form
- Popular articles cards

### Task 6.7: `/docs` (Documentation)
- 2-column: TOC sidebar + markdown-rendered content
- Placeholder MD files for "Getting Started", "Components", "Theming"

---

## Phase 7 — Auth Pages (Day 17)

Standalone layout (no sidebar/header).

### Task 7.1: `/(auth)/login`
- Centered card, email + password, Remember me, Forgot link, Social login buttons

### Task 7.2: `/(auth)/register`
- Same shell + name field, T&C checkbox

### Task 7.3: `/(auth)/forgot-password`
- Email field + submit + back to login

### Task 7.4: `/(auth)/reset-password`
- New password + confirm + submit

### Task 7.5: 404 + 500 error pages
- `src/routes/+error.svelte`: illustration + message + Go home button

---

## Phase 8 — i18n, Polish, DX (Day 18–19)

### Task 8.1: i18n rune store
- `src/lib/i18n/index.ts`: locale store + `t()` function
- Files: `en.json`, `de.json`, `fr.json` (nav labels, common buttons)
- Language switcher in Header

### Task 8.2: Storybook coverage
- Story for every `src/lib/ui/*` component
- Deploy Storybook static build to `storybook-static/`
- CI: `pnpm build-storybook`

### Task 8.3: Responsive audit
- Test each page at 375 / 768 / 1024 / 1440
- Sidebar collapses to sheet on <lg screens
- Tables become scrollable-x or card-list on mobile

### Task 8.4: Accessibility pass
- All interactive elements keyboard-reachable
- ARIA labels on icon-only buttons
- Focus rings visible in both themes
- `pnpm axe` (add @axe-core/playwright test)

### Task 8.5: E2E smoke test (Playwright)
- Test: load /, navigate to each top-level route, no console errors
- Test: dark mode toggle persists

### Task 8.6: README + docs
- README: screenshots, features, quick start, folder structure, deploy notes
- `docs/theming.md`, `docs/adding-a-page.md`, `docs/replacing-mock-data.md`

### Task 8.7: Template usage docs
- Section in README: "Using this as a template" — fork/clone → rename → replace brand → swap mocks for real APIs
- Example `src/lib/config.ts` (brand name, logo, primary color) as single-file customization point

---

## Phase 9 — Ship (Day 20)

### Task 9.1: Deploy demo
- Build with `adapter-static`
- Deploy to VPS at `apex-demo.miromi.id` (nginx + Cloudflare)
- Or Cloudflare Pages if preferred

### Task 9.2: Tag v1.0.0
- `git tag v1.0.0 && git push --tags`
- GitHub release with screenshots + demo URL

### Task 9.3: Announce internally
- Note in memory: template ready, how to fork for new projects

---

## Execution Approach

Per task: bite-sized (2–5 min each in most cases; Phase 3+ page tasks may take 30–60 min because each page composes many primitives).

**Recommended flow:**
1. Complete Phase 0 sequentially (foundation must be solid).
2. From Phase 2 onward, dispatch `delegate_task` subagents in parallel where possible (e.g. 3 page tasks concurrently, each in its own component).
3. Two-stage review per task: spec compliance (matches demo?) → code quality (Svelte 5 idioms, no anti-patterns).
4. Commit per task, PR per phase.

---

## Risks & Mitigations

- **Chart parity:** LayerChart tooltips may differ slightly from demo. Accept close-enough, don't chase pixel-perfect.
- **Command palette lib:** cmdk-sv is young. Fallback: custom bits-ui dialog + fuzzy filter.
- **Storybook + Svelte 5:** Ensure @storybook/sveltekit ≥8.4 for runes support.
- **Drag-and-drop (Kanban):** svelte-dnd-action is Svelte 4 first — verify Svelte 5 compat; else use HTML5 native.
- **Scope creep:** 36 pages is a lot. If time slips, deprioritize `/wizard`, `/help`, `/docs` — they're template-y, easy to add later.
