<script>
  export let title
</script>

<div class="card bg-base-100 shadow">
  <div class="card-body">
    {#if title}
      <h2 class="card-title">{title}</h2>
    {/if}
    <slot></slot>
    <div class="card-actions justify-end">
      <slot name="actions"></slot>
    </div>
  </div>
</div>