# Apex Svelte Dashboard

The **Apex Svelte Dashboard** is the base administrative template for all Miromi projects. Visually modeled after the modern Apex design and built from the ground up, it provides a feature-rich, high-performance starting point for custom admin portals, eCommerce backoffices, and SaaS management suites.

---

## 🚀 Tech Stack

The template is built with a modern, production-grade frontend runtime:

| Tech Module | Stack Option | Description |
| :--- | :--- | :--- |
| **Framework** | **SvelteKit 2** | Full-stack meta-framework for routing, SSR, and API handling |
| **Component Model** | **Svelte 5** | High-performance reactive UI utilizing raw **Runes** (`$state`, `$derived`, `$effect`) |
| **Styling Engine** | **Tailwind CSS v4** | Compiled via `@tailwindcss/vite` with responsive utility utilities and OKLCH color specs |
| **Visual Charts** | **LayerChart v2** | SVG and Canvas visualization engine built specifically for Svelte |
| **Icons Library** | **Lucide Svelte** | Lightweight SVG iconography bundle supporting tree-shaking |
| **Deployment Engine**| **adapter-node** | Compiles SvelteKit routes into a standard, cloud-ready Node.js Server |

---

## 🛠️ Quick Start

Ensure you have **Node.js 18+** and **pnpm** installed. Let's boot up the development server or compile the static assets:

```bash
# 1. Install dependencies
pnpm install

# 2. Run the hot-reloading development server
pnpm dev

# 3. Compile the application into optimized build output
pnpm build

# 4. Preview the resulting build locally
pnpm preview
```

---

## 📁 Project Structure

Key directories and configuration files inside the `/src` folder:

```text
src/
├── lib/
│   ├── ui/                # Reusable UI primitives (Button, Card, Table, Form inputs)
│   ├── layout/            # Shell skeleton (Sidebar, Header, CommandPalette, Customizer)
│   ├── charts/            # Customizable wrappers for LayerChart (Line, Bar, Donut, Area)
│   ├── types/             # Strict TypeScript definitions (auth.ts & catalog.ts)
│   ├── data/              # Mock databases for tables, listings, and KPI graphs
│   ├── stores/            # Global Svelte 5 Runes states (theme, collapsible sidebar, notifications)
│   ├── config.ts          # Central brand identities and toggleable feature flags
│   └── utils.ts           # Standard utility utilities: CN class merger, dynamic currency/percentage formatters
│
├── routes/
│   ├── (app)/             # Main dashboard applications utilizing the core layout
│   ├── (auth)/            # Standalone login, registration, and recovery shell
│   └── logout/            # REST API endpoints for user session termination
│
└── app.css                # Base Tailwind imports and OKLCH styling token assignments
```

---

## 🧩 UI Components

All components are fully interactive Svelte 5 components exported via `src/lib/ui/index.ts`:

| Component | Description |
| :--- | :--- |
| **Button** | Interactive click targets with variants (`primary`, `secondary`, `outline`, `ghost`, `danger`) and loading spinner states. |
| **Badge** | Subtle pill labels for categorizing statuses, product tags, or quantitative counters. |
| **Card** | Segmented containers supporting header content, visual grids, and custom styling overrides. |
| **Input** | Custom-styled form standard field for texts, emails, password visibility, and search bars. |
| **Textarea** | Scalable multi-line field ideal for logs, notes, and rich textual inputs. |
| **Label** | Form titles optimized for web accessibility requirements. |
| **FormField** | Preconfigured wrappers combining Labels, custom Inputs, and validation alert prompts. |
| **Checkbox** | Lightweight checkmark widgets featuring custom states and simple boolean binding. |
| **Switch** | Mobile-style toggle switches ideal for instant feature updates or settings control. |
| **Select** | Dropdown options picker designed to fit dark/light configurations. |
| **Avatar** | Profile bubble showing user images, falling back to clean high-contrast initials if loading fails. |
| **StatusPill** | Visual indicator tags mapped to order status codes (e.g. `paid`, `pending`, `cancelled`). |
| **StatCard** | KPI indicator boxes supporting progress percentages, up/down symbols, and custom trend flags. |
| **ProgressBar**| Bar charts mapping linear metrics (e.g. disk usage, wizard steps, goal progression). |
| **Table** | Grid rendering utility featuring dynamic headers, custom template cells, and multi-row alignments. |
| **Pagination**| Flexible index buttons for chunking datatable sets. |
| **EmptyState**| Visual placeholder display with icons showing when lists or filters return zero items. |
| **Skeleton** | Animated loading placeholders mimicking actual elements. |
| **Spinner** | SVG loading indicators for forms, modals, or page operations. |
| **Modal** | Modal windows with backdrop overlays, dismiss features, and modular layouts. |
| **Toaster** | System popup manager displaying floating transient event notifications. |
| **RichTextEditor**| Custom contenteditable editor supporting headings, blockquotes, lists, links, and bold formatting. |
| **ImageUpload** | Wide or square image drops with base64 conversion preview systems. |

---

## 📄 Pages (Navigation Groups)

The routes are organized in SvelteKit route groups matching the sidebar navigation structure:

### 📋 Overview
* **Dashboard** (`/`) — Main KPI page aggregating total sales, orders, conversion charts, and activity feeds.
* **Analytics** (`/analytics`) — Performance telemetry, traffic channels, customer device info.
* **eCommerce** (`/ecommerce`) — In-depth trade reports, customer traffic breakdown.
* **CRM** (`/crm`) — Lead acquisition tracking, user segments, conversion rates.
* **SaaS** (`/saas`) — ARR/MRR charting, churn analysis, subscription plans metrics.
* **Charts** (`/charts`) — Showcases various interactive LayerChart configurations (line, area, bar, donut).
* **Components** (`/components`) — Interactive catalog of all UI components for design system testing.

### 🛍️ Commerce
* **Orders** (`/orders`) — Paginated search filters, statuses, prices, addresses.
* **Products** (`/products`) — eCommerce inventory database with filters, SKU tracking, creation.
* **Customers** (`/customers`) — Customer listing, total spend tracking, child profiles.
* **Invoices** (`/invoices`) — Searchable invoices with detail view page (`/invoices/[id]`).

### 📢 Marketing
* **Banners** (`/banners`) — App banner configurations matching mobile placements.
* **Promos** (`/promos`) — Coupon code creations, fixed/percentage discounts, usage metrics.
* **Blog** (`/blog`) — Publishing and catalog listing for brand articles.

### 📱 Apps
* **Mail** (`/mail`) — Mock mail client dashboard with side filters and visual feeds.
* **Chat** (`/chat`) — Live-chat interface simulator.
* **Files** (`/files`) — Visual explorer indicating storage usage.
* **Kanban** (`/kanban`) — Project task lanes with drag-and-drop mechanics.
* **Calendar** (`/calendar`) — Month/Day viewer grid populated with events.
* **Wizard** (`/wizard`) — Multi-step data upload wizard flow.
* **Forms** (`/forms`) — Sample fields, date pickers, validation formats.

### 💳 Finance
* **Billing** (`/billing`) — Customer billing metrics, subscriptions list, invoices.

### ⚙️ System
* **Users** (`/users`) — User profile manager and role hierarchy controller (Admin, Member, Support).
* **Settings** (`/settings`) — General parameters, email gateways, postal systems.
* **Notifications** (`/notifications`) — Interactive chronological message center logs.
* **Help & Support** (`/help`) — FAQs, manuals, and search filters.
* **Documentation** (`/docs`) — Developer API lists and guide codes.

---

## 🎨 Theming

Apex Dashboard implements custom OKLCH tokens styled on top of Tailwind CSS v4 directives:

```css
/* Defined inside src/app.css */
@theme {
  --font-sans: 'Geist Sans', sans-serif;
  --font-mono: 'Geist Mono', monospace;
  --radius: 0.75rem;

  /* Accent Color Configs */
  --color-primary: oklch(0.72 0.18 155); /* Re-calculated on runtime adjustments */
  --color-ring: oklch(0.72 0.18 155);

  /* Shell Configurations */
  --color-background: oklch(0.985 0.003 240);
  --color-foreground: oklch(0.15 0 0);
  --color-card: oklch(1 0 0);
  
  /* Sidebar uses a high-contrast dark color palette by default */
  --color-sidebar: oklch(0.145 0 0);
  --color-sidebar-foreground: oklch(0.985 0 0);
}
```

### Dynamic Accent Colors & Dark Toggle
* **Theme Store** (`/src/lib/stores/theme.svelte.ts`): Monitors client choice settings, saves values locally in LocalStorage, pushes the `.dark` class to `<html>`, and overrides `--color-primary` values on the DOM document element.
* **ThemeCustomizer Component**: Displays options config pane allowing users to switch themes and accents (`emerald`, `blue`, `violet`, `orange`, `pink`, `red`) dynamically.

To configure colors permanently, edit `/src/app.css` or modify the presets mapped in `theme.svelte.ts`.

---

## 🔱 Forking Guide

Follow these steps to customize this dashboard for a new product:

1. **Clone & Setup**: Clone the repository and update the name in `package.json`.
2. **Brand Definition**: Modify `src/lib/config.ts` to substitute default information details:
   ```typescript
   export const APP_CONFIG = {
     brand: {
       name: 'TargetBrand',
       suffix: 'CONSOLE',
       full: 'TargetBrand Administrative Panel'
     }
   } as const;
   ```
3. **Filter Navigation Routes**: Open `src/lib/layout/nav-items.ts` and remove/edit items inside `NAV_GROUPS`. Prune unused routes under `/src/routes/(app)/`.
4. **Data Modeling**: Update the schemas inside `src/lib/types/catalog.ts` to represent your target domain entities.
5. **Add Live APIs**: Replace the mock structures (`src/lib/data/*`) with real Axios/fetch calls using the customized API module client in `src/lib/api.ts`.
6. **Vite Routing Rules**: Ensure config keys in `vite.config.ts` align with your target deployment parameters.

---

## 🔒 Auth Design

Security checks are handled at the Edge / Server level:

* **Request Hook Interceptor** (`src/hooks.server.ts`): Intercepts all client requests server-side. It reads the local `access_token` cookie and attempts validation against the backend API endpoint (`/auth/me`).
* **Sandbox Mode Indicator** (`DUMMY_MODE = true`): When enabled, bypasses network authorization, falling back to a mock local admin profile so the sandbox can be styled and tested without a live backend connection. Set this to `false` in production.
* **Auth Guarding**: Route paths mapped inside `hooks.server.ts` act as protection walls. Unauthorized users hitting dashboard layouts (`(app)/`) are automatically redirected (`303`) to the `/login` route.
* **Cookie-Based Sessions**: Login operations (`login/+page.server.ts`) trigger HTTP-Only Cookie settings expiring in 7 days, cleared cleanly on logout requests (`logout/+server.ts`).

---

## 📦 Deployment

The project builds via the Node adapter (`@sveltejs/adapter-node`) configured inside `vite.config.ts`. The compiled build outputs are completely standalone and lightweight.

### Production Build & Launch
```bash
# Build the production bundle
pnpm build

# Start the Node server (defaults to port 3000)
PORT=8080 HOST=0.0.0.0 node build/index.js
```

### Docker Integration
The compiled Node app can easily be containerized. Below is an optimized multi-stage `Dockerfile`:

```dockerfile
# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN pnpm prune --prod

# --- Run Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "build/index.js"]
```
