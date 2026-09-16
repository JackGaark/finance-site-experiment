# The term structure of interest rates

A single-page, editorial explainer built from Appendix 5A of Ross, Westerfield and Jaffe's
*Corporate Finance* ("The Term Structure of Interest Rates, Spot Rates, and Yield to Maturity").
The look and feel follows [sophielwang.com/blog/jpeg](https://www.sophielwang.com/blog/jpeg):
one quiet serif column, equations set in KaTeX with textbook-style numbering, and figures that
you can pull on.

## Run it

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # static output in dist/
```

## What is on the page

Six interactive figures, all drawn with d3 scales inside Svelte-rendered SVG:

| Figure | What you can do |
|---|---|
| Yield to maturity as a root | Slide the two spot rates and the coupon; the yield is solved live by bisection. |
| The term structure | Drag any spot rate (or use arrow keys). The dashed line is the implied one-year forward rate. Presets for rising, flat and inverted curves. |
| Breaking a two-year spot rate into spot and forward | Slide r₁ and r₂; the time chart from Figure 5A.2 recomputes f₂. |
| Spot rates in, forward rates out | Type four spot rates (Example 5A.3) and read the forward rate over each year. |
| Table 5A.1 as a curve | Hover the price of bond B at date 1 across every possible year-2 spot rate. |
| What 1.7 points a year amounts to | Growth of $1 at the two strategies' 1926–1999 average returns. |

Three static plates are reproduced from the appendix PDF (`public/figures/*.png`) and two editorial
diagrams were drawn by hand as SVG (`public/figures/*.svg`).

## Layout of the code

```
src/
  App.svelte            the article itself
  app.css               tokens, typography, figure and chart styling
  lib/Math.svelte       KaTeX wrapper with optional equation number
  lib/Figure.svelte     figure + caption
  lib/finance.js        bond maths: prices, yields, forward rates
  lib/charts/*.svelte   the six interactive figures
```

## Design notes

- Type: Newsreader for everything a reader reads, Source Sans 3 for axis labels and controls.
- Colour: white paper, warm greys, and three validated chart hues (olive, plum, slate blue) that
  pass colour-vision-deficiency separation and 3:1 contrast on white.
- Every chart has a legend when it carries two series, a hover tooltip, keyboard access where a
  control exists, and a table view where the data is not already stated in the text.
- Reduced-motion is respected; there is no non-user-triggered motion on the page.
