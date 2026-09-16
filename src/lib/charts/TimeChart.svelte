<script>
  // Figure 5A.2, made live: split a two-year spot rate into a one-year spot rate and a forward rate.
  import * as d3 from 'd3';
  import { forwardRate } from '../finance.js';

  let r1 = $state(8);   // percent
  let r2 = $state(10);  // percent
  let width = $state(640);

  const f2 = $derived(forwardRate(r2 / 100, r1 / 100, 2) * 100);
  const end2 = $derived(Math.pow(1 + r2 / 100, 2));
  const end1 = $derived(1 + r1 / 100);

  const H = 190;
  const m = { top: 34, right: 90, bottom: 10, left: 40 };
  const iw = $derived(Math.max(width - m.left - m.right, 160));
  const x = $derived(d3.scaleLinear().domain([0, 2]).range([0, iw]));

  const rowA = 74;   // the two-year bond
  const rowB = 130;  // the same journey as spot then forward
  const money = (v) => `$${v.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}`;
</script>

<div class="controls">
  <label>
    <span>One-year spot rate <em>r</em><sub>1</sub> <span class="val">{r1.toFixed(1)}%</span></span>
    <input type="range" min="0" max="15" step="0.1" bind:value={r1} />
  </label>
  <label>
    <span>Two-year spot rate <em>r</em><sub>2</sub> <span class="val">{r2.toFixed(1)}%</span></span>
    <input type="range" min="0" max="15" step="0.1" bind:value={r2} />
  </label>
  <span class="spacer"></span>
  <span style="color: var(--ink)">Forward rate <em>f</em><sub>2</sub> = <strong>{f2.toFixed(2)}%</strong></span>
</div>

<div class="chart" bind:clientWidth={width}>
  <svg viewBox="0 0 {width} {H}" role="img" aria-label={`Time chart. Investing one dollar for two years at ${r2.toFixed(1)} percent gives ${money(end2)}. That equals earning ${r1.toFixed(1)} percent in year one and a forward rate of ${f2.toFixed(2)} percent in year two.`}>
    <g transform="translate({m.left},{m.top})">
      <!-- the dated timeline -->
      <line x1={x(0)} x2={x(2)} y1="0" y2="0" stroke="var(--ink)" stroke-width="1.5" />
      {#each [0, 1, 2] as d}
        <line x1={x(d)} x2={x(d)} y1="-7" y2="7" stroke="var(--ink)" stroke-width="1.5" />
        <text class="label-strong" x={x(d)} y="-14" text-anchor="middle">Date {d}</text>
      {/each}
      <text class="label" x={x(0.5)} y="20" text-anchor="middle">Year 1</text>
      <text class="label" x={x(1.5)} y="20" text-anchor="middle">Year 2</text>

      <!-- Row A: hold the two-year bond -->
      <g transform="translate(0,{rowA})">
        <line x1={x(0) + 22} x2={x(2) - 8} y1="0" y2="0" stroke="var(--series-1)" stroke-width="2" />
        <circle cx={x(0)} cy="0" r="4" fill="var(--series-1)" />
        <text class="label-strong" x={x(0) - 8} y="0" dy="0.32em" text-anchor="end">$1</text>
        <rect x={x(1) - 26} y="-11" width="52" height="22" fill="var(--paper)" />
        <text class="label-strong" x={x(1)} y="0" dy="0.32em" text-anchor="middle" fill="var(--series-1)">{r2.toFixed(1)}%</text>
        <circle cx={x(2)} cy="0" r="4" fill="var(--series-1)" />
        <text class="label-strong" x={x(2) + 8} y="0" dy="0.32em">{money(end2)}</text>
      </g>

      <!-- Row B: spot rate, then the forward rate -->
      <g transform="translate(0,{rowB})">
        <line x1={x(0) + 22} x2={x(1) - 8} y1="0" y2="0" stroke="var(--series-1)" stroke-width="2" />
        <line x1={x(1) + 8} x2={x(2) - 8} y1="0" y2="0" stroke="var(--series-2)" stroke-width="2" stroke-dasharray="4 4" />
        <circle cx={x(0)} cy="0" r="4" fill="var(--series-1)" />
        <text class="label-strong" x={x(0) - 8} y="0" dy="0.32em" text-anchor="end">$1</text>
        <rect x={x(0.5) - 24} y="-11" width="48" height="22" fill="var(--paper)" />
        <text class="label-strong" x={x(0.5)} y="0" dy="0.32em" text-anchor="middle" fill="var(--series-1)">{r1.toFixed(1)}%</text>
        <circle cx={x(1)} cy="0" r="4" fill="var(--series-1)" />
        <text class="label-strong" x={x(1)} y="-12" text-anchor="middle">{money(end1)}</text>
        <rect x={x(1.5) - 28} y="-11" width="56" height="22" fill="var(--paper)" />
        <text class="label-strong" x={x(1.5)} y="0" dy="0.32em" text-anchor="middle" fill="var(--series-2)">{f2.toFixed(2)}%</text>
        <circle cx={x(2)} cy="0" r="4" fill="var(--series-2)" stroke="var(--paper)" stroke-width="2" />
        <text class="label-strong" x={x(2) + 8} y="0" dy="0.32em">{money(end2)}</text>
      </g>
    </g>
  </svg>
</div>

<div class="legend" aria-hidden="true">
  <span><span class="swatch" style="background: var(--series-1)"></span>Spot rate, known today</span>
  <span><span class="swatch dash" style="color: var(--series-2)"></span>Forward rate, implied today for year 2</span>
</div>
