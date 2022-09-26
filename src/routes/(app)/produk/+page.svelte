<script>
	import { enhance, applyAction } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import CardContainer from '$lib/CardContainer.svelte'
	import TextInput from '$lib/TextInput.svelte'
	import Table from '$lib/Table.svelte'
	import Thead from '$lib/Thead.svelte'
	import Tr from '$lib/Tr.svelte'
	import Td from '$lib/Td.svelte'

	export let data
	export let form

	let loading = false
	let deleteLoading

	const submitAction = ({ form: formElm, data, cancel }) => {
		loading = true
		return ({ result }) => {
			loading = false
			if(result.type == 'success') {
				formElm.reset()
				invalidateAll()
			}

			applyAction(result)
		}
	}

	const deleteAction = ({ form: formElm, data, cancel }) => {
		deleteLoading = data.get('id')
		return ({ result }) => {
			deleteLoading = undefined
			if(result.type == 'success') {
				formElm.reset()
				invalidateAll()
			}

			if(result.type == 'invalid') {
				alert(result.data?.errors?.product)
			}

			if(result.type == 'error') {
				alert('gagal dalam menghapus data produk')
			}

			applyAction(result)
		}
	}
</script>

<svelte:head>
	<title>data produk</title>
</svelte:head>


<div class="grid gap-4">
	<div>
		<CardContainer>
			<form 
				action="?/create" 
				method="POST" 
				class="grid gap-4"
				use:enhance={submitAction}
			>
				<TextInput
					name="name"
					placeholder="ketik nama produk"
					label="nama produk"
					required
					value={form?.name || ''}
					error={form?.errors?.name}
					disabled={loading}
				/>

				<div class="flex">
					{#if loading}
						<button class="btn loading" disabled>loading</button>
					{:else}
						<button type="submit" class="btn btn-primary">simpan</button>
					{/if}
				</div>
			</form>
		</CardContainer>
	</div>

	<div>
		<CardContainer>
			<Table>
				<colgroup slot="colgroup">
					<col class="w-auto">
					<col class="w-full">
				</colgroup>
				<svelte:fragment slot="head">
					<Thead cols={['aksi', 'nama produk']} />
				</svelte:fragment>
				<tbody slot="body">
					{#each data.products as product, index (product.id)}
						<Tr>
							<Td class="border">
								<form 
									method="POST"
									action="?/delete"
									use:enhance={deleteAction}
									class="inline-flex" 
								>
									<input type="hidden" name="id" value={product.id}>
									{#if deleteLoading == product.id}
										<button class="btn loading" disabled>loading</button>
									{:else}
										<button class="btn btn-primary btn-sm" type="submit">
											hapus
										</button>
									{/if}
								</form>
							</Td>
							<Td class="border">{product.name}</Td>
						</Tr>
					{:else}
						<tr>
							<Td colspan="2">
								<div class="p-4 w-full flex justify-center items-center">
									<span class="text-2xl text-base-300">belum ada data</span>
								</div>
							</Td>
						</tr>
					{/each}
				</tbody>
			</Table>
		</CardContainer>
	</div>
</div>