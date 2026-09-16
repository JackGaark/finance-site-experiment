<script>
  import katex from 'katex';

  /** @type {{ tex: string, display?: boolean, number?: string | null }} */
  let { tex, display = false, number = null } = $props();

  const html = $derived(
    katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      strict: 'ignore',
      trust: false
    })
  );
</script>

{#if display}
  <div class="eq" role="math" aria-label={tex}>
    <div class="eq-body">{@html html}</div>
    {#if number}<span class="eq-no">({number})</span>{/if}
  </div>
{:else}
  <span class="m" role="math" aria-label={tex}>{@html html}</span>
{/if}
