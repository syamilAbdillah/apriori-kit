<script>
	import { createEventDispatcher } from 'svelte'
	export let id 
	const dispatch = createEventDispatcher()
	const handleClick = () => dispatch('close', {id})
</script>

<div class="px-4 py-2 flex justify-between items-center border rounded-lg">
	<span class="font-bold">
		<slot></slot>
	</span>
	<button class="btn btn-sm btn-square text-primary btn-ghost" on:click={handleClick}>
		<svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
	</button>
</div>