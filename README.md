# apex-svelte-dashboard

Standard front-end template for Miromi projects. Full-featured SvelteKit 2 + Svelte 5 admin dashboard with 36 pages, dark/light mode, OKLCH theme tokens, and a reusable component library.

Visually modeled after [Apex Dashboard — Svelte Edition](https://demo.dashboardpack.com/apex-svelte/) — every component rewritten in-house, MIT-licensed.

## Tech stack

- **Framework:** SvelteKit 2 + Svelte 5 (runes)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4 (OKLCH tokens)
- **Charts:** LayerChart 2
- **Icons:** @lucide/svelte
- **Dark mode:** mode-watcher
- **Fonts:** Geist Sans + Geist Mono (self-hosted)

## Quick start

```bash
pnpm install
pnpm dev       # http://localhost:5173
pnpm build     # production build
pnpm preview   # preview built app
```

## Project structure

```
src/
├── lib/
│   ├── config.ts          # brand & feature flags — start here when forking
│   ├── utils.ts           # cn(), money(), compact(), pct()
│   ├── layout/            # Sidebar, Header, CommandPalette, ThemeCustomizer
│   ├── ui/                # reusable primitives (Button, Card, Table, ...)
│   ├── charts/            # LayerChart wrappers
│   ├── data/              # per-page mock data (swap for real API calls)
│   ├── stores/            # rune-based global state
│   └── i18n/              # locale strings
├── routes/
│   ├── (app)/             # main app pages under shell layout
│   └── (auth)/            # login/register/forgot (standalone layout)
└── app.css                # Tailwind + design tokens
```

## Using this as a template

1. Fork or clone this repo, rename in `package.json` and `README.md`.
2. Edit `src/lib/config.ts` — brand name, user placeholder.
3. Edit `src/app.css` — swap `--color-primary` OKLCH for your brand color.
4. Replace files under `src/lib/data/` with real API calls.
5. Delete pages you don't need under `src/routes/(app)/`.

## Implementation plan

See [docs/plans/2026-07-28-apex-svelte-dashboard.md](docs/plans/2026-07-28-apex-svelte-dashboard.md) for the full 9-phase roadmap.

## License

MIT © Miromi
