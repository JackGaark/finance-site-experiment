<script>
  // Figure 5A.1, made live: drag the spot rates and watch the forward rates they imply.
  import * as d3 from 'd3';
  import { forwardRates, pct } from '../finance.js';

  const PRESETS = {
    rising: [4, 5.2, 6.2, 6.9, 7.4, 7.7, 7.9],
    flat: [6, 6, 6, 6, 6, 6, 6],
    inverted: [7.5, 6.9, 6.3, 5.9, 5.6, 5.4, 5.3]
  };

  let spots = $state([...PRESETS.rising]); // percent
  let preset = $state('rising');
  let showForward = $state(true);
  let width = $state(640);
  let hover = $state(null); // { i, x, y }

  const years = [1, 2, 3, 4, 5, 6, 7];
  const H = 320;
  const m = { top: 30, right: 24, bottom: 44, left: 48 };

  const forwards = $derived(forwardRates(spots.map((s) => s / 100)).map((f) => f * 100));
  const iw = $derived(Math.max(width - m.left - m.right, 120));
  const ih = H - m.top - m.bottom;
  const x = $derived(d3.scaleLinear().domain([0.5, 7.5]).range([0, iw]));
  const yMax = $derived(Math.max(12, d3.max([...spots, ...forwards]) + 1));
  const y = $derived(d3.scaleLinear().domain([0, yMax]).range([ih, 0]).nice());
  const lineGen = $derived(
    d3.line().x((d, i) => x(years[i])).y((d) => y(d)).curve(d3.curveMonotoneX)
  );

  function applyPreset(name) {
    preset = name;
    spots = [...PRESETS[name]];
  }

  function clamp(v) {
    return Math.round(Math.min(15, Math.max(0.25, v)) * 10) / 10;
  }

  function setSpot(i, v) {
    spots[i] = clamp(v);
    preset = null;
  }

  /** d3-drag as a Svelte action on each spot-rate marker. */
  function draggable(node, i) {
    const drag = d3
      .drag()
      .on('start', () => node.classList.add('dragging'))
      .on('drag', (ev) => setSpot(i, y.invert(ev.y)))
      .on('end', () => node.classList.remove('dragging'));
    d3.select(node).call(drag);
    return { destroy() { d3.select(node).on('.drag', null); } };
  }

  function onKey(ev, i) {
    const step = ev.shiftKey ? 1 : 0.1;
    if (ev.key === 'ArrowUp') { setSpot(i, spots[i] + step); ev.preventDefault(); }
    if (ev.key === 'ArrowDown') { setSpot(i, spots[i] - step); ev.preventDefault(); }
  }
</script>

<div class="controls">
  <span class="seg" role="group" aria-label="Preset term structures">
    <button type="button" aria-pressed={preset === 'rising'} onclick={() => applyPreset('rising')}>Rising</button>
    <button type="button" aria-pressed={preset === 'flat'} onclick={() => applyPreset('flat')}>Flat</button>
    <button type="button" aria-pressed={preset === 'inverted'} onclick={() => applyPreset('inverted')}>Inverted</button>
  </span>
  <span class="spacer"></span>
  <label style="flex-direction: row; align-items: center; gap: 0.4rem;">
    <input type="checkbox" bind:checked={showForward} style="accent-color: var(--series-2)" />
    <span>Show implied forward rates</span>
  </label>
</div>

<div class="chart" bind:clientWidth={width}>
  <svg viewBox="0 0 {width} {H}" role="group" aria-label="Spot rates by maturity with the forward rates they imply. Drag a point or use arrow keys to change a spot rate.">
    <g transform="translate({m.left},{m.top})">
      <g class="grid">
        {#each y.ticks(6) as t}
          <line x1="0" x2={iw} y1={y(t)} y2={y(t)} />
        {/each}
      </g>
      <g class="axis" transform="translate(0,{ih})">
        <line x1="0" x2={iw} y1="0" y2="0" />
        {#each years as yr}
          <text x={x(yr)} y="20" text-anchor="middle">{yr}</text>
        {/each}
        <text class="axis-title" x={iw} y="38" text-anchor="end">Maturity (years)</text>
      </g>
      <g class="axis">
        {#each y.ticks(6) as t}
          <text x="-10" y={y(t)} dy="0.32em" text-anchor="end">{t}</text>
        {/each}
        <text class="axis-title" x="-38" y="-16" text-anchor="start">Rate (%)</text>
      </g>

      {#if showForward}
        <path class="line" d={lineGen(forwards)} stroke="var(--series-2)" stroke-dasharray="4 4" />
        {#each forwards as f, i}
          {#if i > 0}
            <circle cx={x(years[i])} cy={y(f)} r="4" fill="var(--paper)" stroke="var(--series-2)" stroke-width="2" />
          {/if}
        {/each}
        <text class="label" x={x(7) + 14} y={y(forwards[6])} dy="0.32em" fill="var(--series-2)">f</text>
      {/if}

      <path class="line" d={lineGen(spots)} stroke="var(--series-1)" />
      {#each spots as s, i}
        <g
          class="handle"
          use:draggable={i}
          tabindex="0"
          role="slider"
          aria-label={`Spot rate for year ${years[i]}`}
          aria-valuemin="0.25"
          aria-valuemax="15"
          aria-valuenow={s}
          aria-valuetext={`${s.toFixed(1)} percent`}
          onkeydown={(e) => onKey(e, i)}
          onpointerenter={() => (hover = i)}
          onpointerleave={() => (hover = null)}
          onfocus={() => (hover = i)}
          onblur={() => (hover = null)}
        >
          <circle cx={x(years[i])} cy={y(s)} r="14" fill="transparent" />
          <circle cx={x(years[i])} cy={y(s)} r="5.5" fill="var(--series-1)" stroke="var(--paper)" stroke-width="2" />
          <text class="label-strong" x={x(years[i])} y={y(s) - 12} text-anchor="middle" font-style="italic">r<tspan dy="3" font-size="9">{years[i]}</tspan></text>
        </g>
      {/each}
    </g>
  </svg>

  {#if hover !== null}
    <div class="tooltip" style="left: {m.left + x(years[hover])}px; top: {m.top + y(spots[hover])}px">
      <div><span class="t-muted">Year {years[hover]}</span></div>
      <div><span class="swatch" style="background: var(--series-1)"></span>spot r<sub>{years[hover]}</sub> = {spots[hover].toFixed(2)}%</div>
      {#if hover > 0}
        <div><span class="swatch" style="background: var(--series-2)"></span>forward f<sub>{years[hover]}</sub> = {forwards[hover].toFixed(2)}%</div>
      {/if}
    </div>
  {/if}
</div>

<div class="legend" aria-hidden="true">
  <span><span class="swatch" style="background: var(--series-1)"></span>Spot rate, drag to change</span>
  {#if showForward}<span><span class="swatch dash" style="color: var(--series-2)"></span>One-year forward rate implied</span>{/if}
</div>

<details class="data">
  <summary>Table of values</summary>
  <table>
    <thead><tr><th>Year</th><th>Spot rate</th><th>Forward rate</th></tr></thead>
    <tbody>
      {#each years as yr, i}
        <tr><td>{yr}</td><td>{pct(spots[i] / 100)}</td><td>{i === 0 ? '—' : pct(forwards[i] / 100)}</td></tr>
      {/each}
    </tbody>
  </table>
</details>

<style>
  .handle { cursor: ns-resize; outline: none; }
  .handle:focus-visible circle:nth-child(2) { stroke: var(--ink); stroke-width: 3; }
  .handle:global(.dragging) circle:nth-child(2) { r: 7; }
</style>
