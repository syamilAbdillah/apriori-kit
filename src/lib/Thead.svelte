<script>
  import Th from './Th.svelte'
  export let cols = []
</script>

<thead class="border-b">
  <tr>
    {#each cols as col, index}
      <Th>{ col }</Th>
    {/each}
  </tr>
</thead>