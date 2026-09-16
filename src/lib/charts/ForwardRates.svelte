<script>
  // Example 5A.3, made live: type a set of spot rates and read off the forward rate over each year.
  import * as d3 from 'd3';
  import { forwardRates, pct } from '../finance.js';

  let spots = $state([5, 6, 7, 6]); // percent
  let width = $state(640);
  let hover = $state(null);

  const years = [1, 2, 3, 4];
  const forwards = $derived(forwardRates(spots.map((s) => s / 100)).map((f) => f * 100));

  const H = 280;
  const m = { top: 20, right: 30, bottom: 44, left: 44 };
  const iw = $derived(Math.max(width - m.left - m.right, 120));
  const ih = H - m.top - m.bottom;
  const x = $derived(d3.scalePoint().domain(years).range([0, iw]).padding(0.5));
  const yLo = $derived(Math.min(0, d3.min(forwards) - 1));
  const yHi = $derived(Math.max(10, d3.max([...spots, ...forwards]) + 1));
  const y = $derived(d3.scaleLinear().domain([yLo, yHi]).range([ih, 0]).nice());
  const bw = $derived(Math.min(28, x.step() * 0.28));

  function setSpot(i, v) {
    const n = Number(v);
    if (Number.isFinite(n)) spots[i] = Math.min(20, Math.max(0, n));
  }
</script>

<div class="controls" style="justify-content: center">
  {#each years as yr, i}
    <label>
      <span>Spot rate, year {yr}</span>
      <input type="number" min="0" max="20" step="0.1" value={spots[i]} oninput={(e) => setSpot(i, e.currentTarget.value)} aria-label={`Spot rate for year ${yr} in percent`} />
    </label>
  {/each}
</div>

<div class="chart" bind:clientWidth={width}>
  <svg viewBox="0 0 {width} {H}" role="img" aria-label="Spot rates and the one-year forward rates they imply, by year.">
    <g transform="translate({m.left},{m.top})">
      <g class="grid">
        {#each y.ticks(5) as t}<line x1="0" x2={iw} y1={y(t)} y2={y(t)} />{/each}
      </g>
      <g class="axis">
        {#each y.ticks(5) as t}<text x="-10" y={y(t)} dy="0.32em" text-anchor="end">{t}%</text>{/each}
      </g>
      <g class="axis" transform="translate(0,{ih})">
        {#each years as yr}<text x={x(yr)} y="20" text-anchor="middle">Year {yr}</text>{/each}
      </g>
      <line x1="0" x2={iw} y1={y(0)} y2={y(0)} stroke="var(--rule)" />

      {#each years as yr, i}
        {@const s = spots[i]}
        {@const f = forwards[i]}
        <g
          onpointerenter={() => (hover = i)}
          onpointerleave={() => (hover = null)}
          role="presentation"
        >
          <rect x={x(yr) - bw - 1} y={Math.min(y(s), y(0))} width={bw} height={Math.abs(y(s) - y(0))} fill="var(--series-1)" rx="2" />
          {#if i > 0}
            <rect x={x(yr) + 1} y={Math.min(y(f), y(0))} width={bw} height={Math.abs(y(f) - y(0))} fill="var(--series-2)" rx="2" />
            <text class="label" x={x(yr) + 1 + bw / 2} y={(f >= 0 ? y(f) - 6 : y(f) + 14)} text-anchor="middle" fill="var(--series-2)">{f.toFixed(2)}%</text>
          {:else}
            <text class="label" x={x(yr) + 1 + bw / 2} y={y(0) - 6} text-anchor="middle" fill="var(--ink-3)" font-style="italic">f₁ = r₁</text>
          {/if}
          <text class="label" x={x(yr) - bw / 2 - 1} y={y(s) - 6} text-anchor="middle">{s.toFixed(1)}%</text>
          <rect x={x(yr) - x.step() / 2} y="0" width={x.step()} height={ih} fill="transparent" />
        </g>
      {/each}
    </g>
  </svg>
  {#if hover !== null}
    <div class="tooltip" style="left: {m.left + x(years[hover])}px; top: {m.top + Math.min(y(spots[hover]), y(forwards[hover])) - 4}px">
      <div class="t-muted">Year {years[hover]}</div>
      <div><span class="swatch" style="background: var(--series-1)"></span>r<sub>{years[hover]}</sub> = {pct(spots[hover] / 100)}</div>
      {#if hover > 0}
        <div><span class="swatch" style="background: var(--series-2)"></span>f<sub>{years[hover]}</sub> = (1.{String(Math.round(spots[hover]*100)).padStart(4,'0')})<sup>{years[hover]}</sup> ⁄ (1.{String(Math.round(spots[hover-1]*100)).padStart(4,'0')})<sup>{years[hover]-1}</sup> − 1 = {pct(forwards[hover] / 100)}</div>
      {/if}
    </div>
  {/if}
</div>

<div class="legend" aria-hidden="true">
  <span><span class="swatch" style="background: var(--series-1)"></span>Spot rate r<sub>n</sub></span>
  <span><span class="swatch" style="background: var(--series-2)"></span>Forward rate over year n, f<sub>n</sub></span>
</div>
