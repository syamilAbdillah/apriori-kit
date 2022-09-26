<script>
	export let src 
	export let alt = 'image'
</script>

<div class="avatar w-12 h-12">
	<div class="w-full aspect-square bg-base-200">
		<img {src} {alt}>
	</div>
</div>