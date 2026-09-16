# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page editorial explainer of Appendix 5A ("The Term Structure of Interest Rates") from Ross, Westerfield and Jaffe's *Corporate Finance*. Svelte 5 + Vite, no router, no backend, no tests. Content lives in one article component with six interactive d3-in-SVG figures.

## Commands

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # static output in dist/ (gitignored)
pnpm preview    # serve dist/
```

There is no lint, typecheck or test script. `jsconfig.json` enables `checkJs`, so editor diagnostics apply to `.js` and `.svelte` files.

## Architecture

- `src/App.svelte` is the entire article: prose, `<M>` equations, and `<Figure>` blocks that mount the chart components. Edit here to change text or the order of sections.
- `src/lib/finance.js` holds all bond maths (spot pricing, yield by bisection, forward rates). Rates are decimals (0.08), while chart components keep slider state in percent and convert at the call site.
- `src/lib/charts/*.svelte` are the six figures. Each follows the same pattern: Svelte 5 runes (`$state`/`$derived`), d3 used only for scales, lines and pointer maths, and the SVG rendered declaratively in the template (no d3 DOM selection). Width comes from `bind:clientWidth` on a `.chart` wrapper with a `viewBox` that tracks it. Every SVG carries a computed `aria-label` describing the current state.
- `src/lib/Math.svelte` wraps KaTeX (`tex`, `display`, `number` props; equations are numbered "A.n" in the article). `src/lib/Figure.svelte` provides figure/caption with a `wide` option.
- `src/app.css` is the only stylesheet. Design tokens live on `:root` (`--paper`, `--ink*`, `--rule*`, `--series-1/2/3`, `--serif`, `--sans`, `--measure`). Shared chart classes (`.chart`, `.axis`, `.label`, `.label-strong`, `.line`, `.crosshair`, `.controls`) are defined here, so new charts should reuse them rather than add scoped styles.
- `public/figures/` holds static plates from the textbook PDF (`.png`) and two hand-drawn SVG diagrams.

## Conventions from the README

- Series colours are fixed by meaning: olive `--series-1` for spot rates, plum `--series-2` for forward rates or a second strategy, slate blue `--series-3` as a third. They are chosen for colour-vision-deficiency separation and 3:1 contrast on white.
- Every chart with two series has a legend; every chart has a hover tooltip, keyboard access wherever a control exists, and a table view when the data is not already in the text.
- No non-user-triggered motion; respect `prefers-reduced-motion`.
- Typography: Newsreader for readable text, Source Sans 3 for axis labels and controls (loaded from Google Fonts in `index.html`).
