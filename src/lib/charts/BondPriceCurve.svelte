<script>
  // Table 5A.1, made live: the price of bond B at date 1 depends on the spot rate that will prevail over year 2.
  import * as d3 from 'd3';
  import { usd, pct } from '../finance.js';

  let payoff = $state(1210);
  let width = $state(640);
  let hoverR = $state(null);

  const marked = [0.06, 0.07, 0.14];
  const H = 300;
  const m = { top: 16, right: 24, bottom: 44, left: 62 };
  const iw = $derived(Math.max(width - m.left - m.right, 120));
  const ih = H - m.top - m.bottom;
  const priceAt = (r) => payoff / (1 + r);
  const x = $derived(d3.scaleLinear().domain([0, 0.2]).range([0, iw]));
  const y = $derived(d3.scaleLinear().domain([priceAt(0.2) * 0.97, priceAt(0) * 1.01]).range([ih, 0]).nice());
  const samples = $derived(d3.range(0, 0.2001, 0.0025).map((r) => [r, priceAt(r)]));
  const path = $derived(d3.line().x((d) => x(d[0])).y((d) => y(d[1]))(samples));

  function onMove(ev) {
    const [px] = d3.pointer(ev);
    const r = x.invert(px - m.left);
    hoverR = r < 0 || r > 0.2 ? null : r;
  }
</script>

<div class="controls">
  <label>
    <span>Payment at maturity <span class="val">{usd(payoff, 0)}</span></span>
    <input type="range" min="1000" max="1500" step="10" bind:value={payoff} />
  </label>
</div>

<div class="chart" bind:clientWidth={width}>
  <svg
    viewBox="0 0 {width} {H}"
    role="img"
    aria-label={`Price of bond B at date 1 against the one-year spot rate over year 2. At 6 percent the price is ${usd(priceAt(0.06))}, at 7 percent ${usd(priceAt(0.07))}, and at 14 percent ${usd(priceAt(0.14))}.`}
    onpointermove={onMove}
    onpointerleave={() => (hoverR = null)}
  >
    <g transform="translate({m.left},{m.top})">
      <g class="grid">
        {#each y.ticks(5) as t}<line x1="0" x2={iw} y1={y(t)} y2={y(t)} />{/each}
      </g>
      <g class="axis" transform="translate(0,{ih})">
        <line x1="0" x2={iw} y1="0" y2="0" />
        {#each x.ticks(5) as t}<text x={x(t)} y="20" text-anchor="middle">{(t * 100).toFixed(0)}%</text>{/each}
        <text class="axis-title" x={iw} y="38" text-anchor="end">Spot rate over year 2, known only at date 1</text>
      </g>
      <g class="axis">
        {#each y.ticks(5) as t}<text x="-10" y={y(t)} dy="0.32em" text-anchor="end">${t.toLocaleString()}</text>{/each}
      </g>

      <path class="line" d={path} stroke="var(--series-1)" />

      {#each marked as r, i}
        <line x1={x(r)} x2={x(r)} y1={y(priceAt(r))} y2={ih} stroke="var(--ink-3)" stroke-dasharray="2 3" />
        <circle cx={x(r)} cy={y(priceAt(r))} r="5" fill="var(--series-2)" stroke="var(--paper)" stroke-width="2" />
        <text class="label-strong" x={i === 0 ? x(r) - 10 : x(r) + 9} y={y(priceAt(r)) - 8} text-anchor={i === 0 ? "end" : "start"}>{(r * 100).toFixed(0)}% → {usd(priceAt(r))}</text>
      {/each}

      {#if hoverR !== null}
        <line class="crosshair" x1={x(hoverR)} x2={x(hoverR)} y1="0" y2={ih} />
        <circle cx={x(hoverR)} cy={y(priceAt(hoverR))} r="4" fill="var(--paper)" stroke="var(--series-1)" stroke-width="2" />
      {/if}
    </g>
  </svg>
  {#if hoverR !== null}
    <div class="tooltip" style="left: {m.left + x(hoverR)}px; top: {m.top + y(priceAt(hoverR))}px">
      <div class="t-muted">Spot rate over year 2: {pct(hoverR, 1)}</div>
      <div>{usd(payoff, 0)} ⁄ {(1 + hoverR).toFixed(3)} = {usd(priceAt(hoverR))}</div>
    </div>
  {/if}
</div>

<details class="data">
  <summary>Table of values</summary>
  <table>
    <thead><tr><th>Spot rate over year 2</th><th>Price of bond B at date 1</th></tr></thead>
    <tbody>
      {#each [0.04, 0.06, 0.07, 0.10, 0.14] as r}
        <tr><td>{pct(r, 0)}</td><td>{usd(priceAt(r))}</td></tr>
      {/each}
    </tbody>
  </table>
</details>
