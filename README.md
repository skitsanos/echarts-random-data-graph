# Signal — telemetry lab

Signal is a small browser demo for exploring synthetic sensor telemetry. It generates a local time series, draws the readings with an ECharts confidence band, and exposes a few practical interactions: changing the time window, generating a fresh sample, zooming through the chart, and exporting an image.

There is no API, database, or server-side data source. Every reading is generated in the browser, so the demo is safe to run offline after its assets have loaded and is easy to deploy as a static site.

## What is in the demo?

- `src/data.ts` generates bounded, wave-shaped readings with lower and upper confidence values and calculates summary statistics.
- `src/chart.ts` contains the modular ECharts setup, tooltip, confidence band, mean marker, zoom controls, and image export.
- `src/main.ts` connects the page controls to the data and chart modules.
- `src/styles.css` contains the responsive visual design and the mobile layout.
- `src/data.test.ts` covers deterministic generation, bounds, and summary calculations.

The default view shows 90 points. The 30-day, 90-day, and 1-year controls change the generated window; the **New sample** button changes the seed while preserving the selected window.

## Run it locally

Requirements:

- [Bun](https://bun.sh/) 1.x (the current local validation used Bun 1.4.2)
- A modern browser

Install dependencies and start Bun's native HTML development server:

```sh
bun install
bun run dev
```

Then open the local URL printed by Bun. The development server bundles `index.html`, its TypeScript entry point, CSS, and referenced assets without an additional frontend framework or build tool.

## Build for production

```sh
bun run build
```

The output is written to `dist/`. To preview the generated output locally:

```sh
bun run preview
```

The production bundle is created by Bun's HTML-aware bundler:

```sh
bun build ./index.html --outdir=dist --minify --target=browser
```

## Checks

```sh
bun run test
bun run typecheck
bun run build
```

Tests use Bun's built-in test runner. `bun.lock` is committed so local and CI installs resolve the same dependency graph.

## Deploy to Netlify

The repository includes [`netlify.toml`](netlify.toml). Netlify will run the frozen Bun install, build the static bundle, and publish `dist/`:

```toml
[build]
  command = "bun install --frozen-lockfile && bun run build"
  publish = "dist"
```

The site does not need a long-running Bun server in production; Netlify serves the generated static files. If a specific Bun release is required later, set Netlify's `BUN_VERSION` build environment variable rather than adding runtime-specific files to the repository.

## Dependencies

- [Bun](https://bun.sh/) — package manager, development server, test runner, and production bundler
- [ECharts](https://echarts.apache.org/) 6.1 — chart rendering and interactions
- [TypeScript](https://www.typescriptlang.org/) 7.0 — static type checking
