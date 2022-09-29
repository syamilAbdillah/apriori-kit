<script>
	import {enhance, applyAction} from '$app/forms'
	import {invalidateAll} from '$app/navigation'
	import CardContainer from '$lib/CardContainer.svelte'
	import TextInput from '$lib/TextInput.svelte'

	export let data
	export let form

	let createLoading = false
	let deleteLoading

	const createAction = ({form, cancel, data}) => {
		createLoading = true
		return ({ result }) => {
			createLoading = false
			if(result.type == 'success') {
				form.reset()
				invalidateAll()
			}

			applyAction(result)
		}
	}

	const deleteAction = ({form, cancel, data}) => {
		deleteLoading = data.get('id')
		return ({ result }) => {
			deleteLoading = undefined

			if (result.type == 'success') {
				invalidateAll()
			}
			
			applyAction(result)
		}
	}
</script>

<svelte:head>
	<title>data pengguna</title>
</svelte:head>

<div class="grid gap-4">
	<CardContainer>
		<form 
			method="POST" 
			action="?/create" 
			class="grid gap-4 lg:grid-cols-4"
			use:enhance={createAction}
		>
			<div class="lg:col-span-2">
				<TextInput
					name="username"
					label="username"
					placeholder="type something"
					required
					error={form?.erros?.username}
					value={form?.username}
				/>
			</div>
			<TextInput
				name="password"
				label="password"
				type="password"
				placeholder="********"
				required
				error={form?.erros?.password}
			/>
			<TextInput
				name="confirm"
				label="konfirmasi password"
				type="password"
				placeholder="********"
				required
				error={form?.erros?.confirm}
			/>
			<div class="lg:col-span-4 flex justify-end">
				<button 
					type="submit" 
					class="btn btn-primary"
					class:loading={createLoading} 
					disabled={createLoading}
				>
					simpan
				</button>
			</div>
		</form>
	</CardContainer>
	<CardContainer>
		<div class="overflow-x-auto">
			<table class="table w-full">
				<colgroup>
					<col class="w-auto">
					<col class="w-full">
				</colgroup>
				<thead>
					<tr>
						<th>aksi</th>
						<th>username</th>
					</tr>
				</thead>
				<tbody>
					{#each data.users as user, index (user.id)}
						<tr>
							<td>
								<form 
									method="POST" 
									action="?/delete"
									use:enhance={deleteAction}
									class="inline-flex" 
								>
									<input type="hidden" name="id" value={user.id}>
									<button 
										class="btn btn-primary btn-sm" 
										type="submit"
										class:loading={deleteLoading == user.id}
										disabled={deleteLoading}
									>
										hapus
									</button>
								</form>
							</td>
							<td>{user.username}</td>
						</tr>
					{:else}
						<tr>
							<td colspan="2">
								<div class="flex justify-center p-4">
									<span class="text-2xl text-gray-400 font-thin font-mono">
										belum ada data
									</span>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</CardContainer>
</div>