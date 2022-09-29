<script>
	import { enhance, applyAction} from '$app/forms'
	import TextInput from '$lib/TextInput.svelte'

	export let form
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<legend class="flex justify-center items-center text-2xl font-bold mb-6">
	<span>login</span>
</legend>

<form class="w-auto" method="POST">
	<TextInput 
		label="username" 
		name="username" 
		placeholder="username" 
		required
		error={form?.errors?.username}
		value={form?.username || ''}
	/>
	<TextInput 
		label="password"
		name="password" 
		placeholder="********" 
		type="password"
		required
	/>
	<div class="flex justify-end items-center gap-2 mt-6">
		<button 
			class="btn btn-primary"
			type="submit"
		>
			login
		</button>
	</div>
</form>