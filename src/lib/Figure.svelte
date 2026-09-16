<script>
  /** @type {{ label?: string, caption?: string, wide?: boolean, children: any }} */
  let { label = '', caption = '', wide = false, children } = $props();
</script>

<figure class:wide>
  {@render children()}
  {#if caption || label}
    <figcaption>
      {#if label}<span class="fig-label">{label}</span>{#if caption}<br />{/if}{/if}
      {caption}
    </figcaption>
  {/if}
</figure>
