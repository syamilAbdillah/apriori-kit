<script>
  export let label = ''
  export let error = undefined

  export let placeholder = ''
  export let required = false
  export let value = ''
  export let name

  export let options = []

  export const id = crypto.randomUUID()
</script>

<div class="form-control mb-4">
  <label class="label" for="{id}">
    <span class="label-text text-gray-500" class:text-error={error}>{ label }</span>
  </label> 
  <select {id} bind:value on:change class="select select-bordered" class:select-error={error} {name} {placeholder} {required}>
    {#each options as option, index (option.id)}
      <option value={option.id}>{option.name}</option>
    {:else}
      <option disabled selected>no option available</option>
    {/each}
  </select>
  {#if error}
    <label class="label">
      <span class="label-text-alt" class:text-error={error}>{error}</span>
    </label> 
  {/if}
</div>