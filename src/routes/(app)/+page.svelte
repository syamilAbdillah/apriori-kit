<script>
	import { enhance, applyAction } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import CardContainer from '$lib/CardContainer.svelte'
	import TextInput from '$lib/TextInput.svelte'
	import Select from '$lib/Select.svelte'
	import toHTMLDate from '$lib/toHTMLDate'
	import TransactionCreator from './TransactionCreator.svelte'

	export let data

	let deleteLoading

	const deleteAction = ({ form, data, cancel }) => {
		deleteLoading = data.get('id')
		return ({ result }) => {
			deleteLoading = undefined
			if(result.type == 'success') {
				invalidateAll()
			}

			if(result.type == 'error') {
				alert('gagal dalam menghapus data produk')
			}

			applyAction(result)
		}
	}
</script>

<svelte:head>
	<title>data penjualan</title>
</svelte:head>


<div class="grid gap-4">
	<div>
		<TransactionCreator options={data.products} on:created={() => invalidateAll()}/>
	</div>
	
	<div>
		<CardContainer>
			<div class="overflow-x-auto">
				<table class="table w-full">
					<colgroup>
						<col class="w-auto">
						<col class="w-auto">
						<col class="w-full">
					</colgroup>
					<thead>
						<tr>
							<th>aksi</th>
							<th>tanggal transaksi</th>
							<th>item transaksi</th>
						</tr>
					</thead>
					<tbody>
						{#each data.transactions as transaction, index (transaction.id)}
							<tr>
								<td>
									<form 
										method="POST"
										action="?/delete"
										use:enhance={deleteAction}
										class="inline-flex" 
									>
										<input type="hidden" name="id" value={transaction.id}>
										{#if deleteLoading == transaction.id}
											<button class="btn loading btn-sm" disabled>loading</button>
										{:else}
											<button disabled={deleteLoading} class="btn btn-primary btn-sm" type="submit">
												hapus
											</button>
										{/if}
									</form>
								</td>
								<td>{ toHTMLDate(transaction.createdAt) }</td>
								<td>{ transaction.items.join(', ') }</td>
							</tr>
						{:else}
							<tr>
								<td colspan="3">
									<div class="p-4 w-full flex justify-center items-center">
										<span class="text-2xl text-base-300">belum ada data</span>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</CardContainer>
	</div>
</div>