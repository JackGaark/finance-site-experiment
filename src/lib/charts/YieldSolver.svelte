<script>
  // Example 5A.1, made live: price a two-year coupon bond off the spot rates, then find the single
  // rate y that reproduces that price. The curve is the present value as a function of y.
  import * as d3 from 'd3';
  import { priceFromSpots, priceAtYield, yieldToMaturity, usd, pct } from '../finance.js';

  let r1 = $state(8);
  let r2 = $state(10);
  let coupon = $state(5); // percent of face
  let width = $state(640);
  let hoverY = $state(null);

  const face = 1000;
  const cfs = $derived([face * coupon / 100, face * (1 + coupon / 100)]);
  const price = $derived(priceFromSpots(cfs, [r1 / 100, r2 / 100]));
  const ytm = $derived(yieldToMaturity(cfs, price));

  const H = 300;
  const m = { top: 16, right: 24, bottom: 44, left: 62 };
  const iw = $derived(Math.max(width - m.left - m.right, 120));
  const ih = H - m.top - m.bottom;
  const x = $derived(d3.scaleLinear().domain([0, 0.2]).range([0, iw]));
  const yDomain = $derived([priceAtYield(cfs, 0.2) * 0.95, priceAtYield(cfs, 0) * 1.02]);
  const y = $derived(d3.scaleLinear().domain(yDomain).range([ih, 0]).nice());
  const samples = $derived(d3.range(0, 0.2001, 0.0025).map((r) => [r, priceAtYield(cfs, r)]));
  const path = $derived(d3.line().x((d) => x(d[0])).y((d) => y(d[1]))(samples));

  function onMove(ev) {
    const [px] = d3.pointer(ev);
    const r = x.invert(px - m.left);
    hoverY = r < 0 || r > 0.2 ? null : r;
  }
</script>

<div class="controls">
  <label>
    <span><em>r</em><sub>1</sub> <span class="val">{r1.toFixed(1)}%</span></span>
    <input type="range" min="0" max="15" step="0.1" bind:value={r1} style="width: 7rem" />
  </label>
  <label>
    <span><em>r</em><sub>2</sub> <span class="val">{r2.toFixed(1)}%</span></span>
    <input type="range" min="0" max="15" step="0.1" bind:value={r2} style="width: 7rem" />
  </label>
  <label>
    <span>Coupon <span class="val">{coupon.toFixed(1)}%</span></span>
    <input type="range" min="0" max="15" step="0.5" bind:value={coupon} style="width: 7rem" />
  </label>
  <span class="spacer"></span>
  <span style="color: var(--ink); text-align: right">Price {usd(price)}<br />Yield to maturity <strong>{pct(ytm)}</strong></span>
</div>

<div class="chart" bind:clientWidth={width}>
  <svg
    viewBox="0 0 {width} {H}"
    role="img"
    aria-label={`Present value of the bond's cash flows against a single discount rate. The curve crosses the spot-rate price of ${usd(price)} at a yield of ${pct(ytm)}.`}
    onpointermove={onMove}
    onpointerleave={() => (hoverY = null)}
  >
    <g transform="translate({m.left},{m.top})">
      <g class="grid">
        {#each y.ticks(5) as t}<line x1="0" x2={iw} y1={y(t)} y2={y(t)} />{/each}
      </g>
      <g class="axis" transform="translate(0,{ih})">
        <line x1="0" x2={iw} y1="0" y2="0" />
        {#each x.ticks(5) as t}<text x={x(t)} y="20" text-anchor="middle">{(t * 100).toFixed(0)}%</text>{/each}
        <text class="axis-title" x={iw} y="38" text-anchor="end">Single discount rate y</text>
      </g>
      <g class="axis">
        {#each y.ticks(5) as t}<text x="-10" y={y(t)} dy="0.32em" text-anchor="end">${t.toLocaleString()}</text>{/each}
      </g>

      <!-- the price fixed by the spot rates -->
      <line x1="0" x2={iw} y1={y(price)} y2={y(price)} stroke="var(--series-2)" stroke-dasharray="4 4" />
      <text class="label" x="4" y={y(price) - 6} fill="var(--series-2)">Price from spot rates, {usd(price)}</text>

      <path class="line" d={path} stroke="var(--series-1)" />

      <!-- the root -->
      <line x1={x(ytm)} x2={x(ytm)} y1={y(price)} y2={ih} stroke="var(--ink-3)" stroke-dasharray="2 3" />
      <circle cx={x(ytm)} cy={y(price)} r="5.5" fill="var(--series-2)" stroke="var(--paper)" stroke-width="2" />
      <text class="label-strong" x={x(ytm) + 9} y={ih - 8}>y = {pct(ytm)}</text>

      {#if hoverY !== null}
        <line class="crosshair" x1={x(hoverY)} x2={x(hoverY)} y1="0" y2={ih} />
        <circle cx={x(hoverY)} cy={y(priceAtYield(cfs, hoverY))} r="4" fill="var(--paper)" stroke="var(--series-1)" stroke-width="2" />
      {/if}
    </g>
  </svg>
  {#if hoverY !== null}
    <div class="tooltip" style="left: {m.left + x(hoverY)}px; top: {m.top + y(priceAtYield(cfs, hoverY))}px">
      <div class="t-muted">y = {pct(hoverY, 1)}</div>
      <div>PV = {usd(priceAtYield(cfs, hoverY))}</div>
    </div>
  {/if}
</div>

<div class="legend" aria-hidden="true">
  <span><span class="swatch" style="background: var(--series-1)"></span>PV of {usd(cfs[0], 0)} then {usd(cfs[1], 0)} at rate y</span>
  <span><span class="swatch dash" style="color: var(--series-2)"></span>Price set by the two spot rates</span>
</div>
