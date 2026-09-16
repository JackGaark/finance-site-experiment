<script>
  // The textbook's one empirical result: 1926 to 1999, rolling one-year bills returned 3.8 percent a year
  // on average, while buying a 20-year bond and selling it a year later returned 5.5 percent.
  // Compounding those averages shows what the gap means over the whole sample.
  import * as d3 from 'd3';
  import { usd } from '../finance.js';

  const start = 1926;
  const end = 1999;
  const series = [
    { key: 'bills', name: 'Roll one-year bonds', rate: 0.038, color: 'var(--series-1)' },
    { key: 'long', name: 'Buy 20-year bond, sell after a year', rate: 0.055, color: 'var(--series-2)' }
  ];
  const yearsList = d3.range(start, end + 1);
  const grow = (rate, yr) => Math.pow(1 + rate, yr - start);

  let width = $state(640);
  let hoverYear = $state(null);

  const H = 300;
  const m = { top: 16, right: 30, bottom: 44, left: 52 };
  const iw = $derived(Math.max(width - m.left - m.right, 120));
  const ih = H - m.top - m.bottom;
  const x = $derived(d3.scaleLinear().domain([start, end]).range([0, iw]));
  const y = $derived(d3.scaleLinear().domain([0, grow(0.055, end)]).range([ih, 0]).nice());
  const lineFor = $derived((rate) => d3.line().x((yr) => x(yr)).y((yr) => y(grow(rate, yr)))(yearsList));

  function onMove(ev) {
    const [px] = d3.pointer(ev);
    const yr = Math.round(x.invert(px - m.left));
    hoverYear = yr < start || yr > end ? null : yr;
  }
</script>

<div class="chart" bind:clientWidth={width}>
  <svg
    viewBox="0 0 {width} {H}"
    role="img"
    aria-label={`Growth of one dollar from 1926 to 1999 at the two strategies' average returns. Rolling one-year bonds at 3.8 percent reaches ${usd(grow(0.038, end))}; buying a 20-year bond and selling after one year at 5.5 percent reaches ${usd(grow(0.055, end))}.`}
    onpointermove={onMove}
    onpointerleave={() => (hoverYear = null)}
  >
    <g transform="translate({m.left},{m.top})">
      <g class="grid">
        {#each y.ticks(5) as t}<line x1="0" x2={iw} y1={y(t)} y2={y(t)} />{/each}
      </g>
      <g class="axis" transform="translate(0,{ih})">
        <line x1="0" x2={iw} y1="0" y2="0" />
        {#each x.ticks(6) as t}<text x={x(t)} y="20" text-anchor="middle">{t}</text>{/each}
      </g>
      <g class="axis">
        {#each y.ticks(5) as t}<text x="-10" y={y(t)} dy="0.32em" text-anchor="end">${t}</text>{/each}
        <text class="axis-title" x="-42" y="-4">Value of $1</text>
      </g>

      {#each series as s}
        <path class="line" d={lineFor(s.rate)} stroke={s.color} />
        <text class="label" x={x(end) + 6} y={y(grow(s.rate, end))} dy="0.32em" fill={s.color}>{(s.rate * 100).toFixed(1)}%</text>
      {/each}

      {#if hoverYear !== null}
        <line class="crosshair" x1={x(hoverYear)} x2={x(hoverYear)} y1="0" y2={ih} />
        {#each series as s}
          <circle cx={x(hoverYear)} cy={y(grow(s.rate, hoverYear))} r="4" fill="var(--paper)" stroke={s.color} stroke-width="2" />
        {/each}
      {/if}
    </g>
  </svg>
  {#if hoverYear !== null}
    <div class="tooltip" style="left: {m.left + x(hoverYear)}px; top: {m.top + y(grow(0.055, hoverYear))}px">
      <div class="t-muted">{hoverYear}</div>
      {#each series as s}
        <div><span class="swatch" style="background: {s.color}"></span>{s.name}: {usd(grow(s.rate, hoverYear))}</div>
      {/each}
    </div>
  {/if}
</div>

<div class="legend" aria-hidden="true">
  {#each series as s}
    <span><span class="swatch" style="background: {s.color}"></span>{s.name}, {(s.rate * 100).toFixed(1)}% a year</span>
  {/each}
</div>
