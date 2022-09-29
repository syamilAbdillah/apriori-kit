<script>
  export let label = ''
  export let error = undefined

  export let type = 'text'
  export let placeholder = ''
  export let required = false
  export let value = ''
  export let name
  export let disabled = false
  export let min
  export let max

  function typeAction(node) {
    node.type = type;
    if(type == 'number') {
      node.min = min
      node.max = max
    }
  }

  export let id = crypto.randomUUID()
</script>

<div class="form-control">

  <label class="label" for={id}>
    <span class="label-text" class:text-gray-500={!error} class:text-error={error}>{ label }</span>
  </label>
  
  <input 
    {placeholder} 
    {required}
    bind:value={value}
    {name}
    {id}
    {disabled} 
    autocomplete="{type == 'password' ? 'off': 'on'}" 
    class="input input-bordered w-full" 
    class:input-error={error}
    use:typeAction 
  />
  
  {#if error}
    <label class="label" for={id}>
      <span class="label-text-alt text-error">{ error }</span>
    </label>
  {/if}
</div>