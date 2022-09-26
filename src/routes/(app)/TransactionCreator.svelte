<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import CardContainer from '$lib/CardContainer.svelte'
	import TextInput from '$lib/TextInput.svelte'
	import Select from '$lib/Select.svelte'
	import TransactionItem from './TransactionItem.svelte'
	import toHTMLDate from '$lib/toHTMLDate'

	let date = toHTMLDate(new Date())
	let selected
	export let options
	let loading = false
	let error
	let transactionItems = []
	const dispatch = createEventDispatcher()
	
	// on select
	$: {
		if(selected) {
			options = options.filter(item => {
				if(item.id == selected) {
					transactionItems = [...transactionItems, item]
				}

				return item.id != selected
			})

			selected = undefined
		}
	}

	function handleClose({ detail }) {
		transactionItems = transactionItems.filter(elm => {
			if(detail.id == elm.id) {
				const arr = [...options, elm]
				arr.sort((a, b) => a.name < b.name ? -1: 1)
				options = arr
			}
			return detail.id != elm.id
		})	
	}

	function handleReset() {
		options = [...options, ...transactionItems]
		transactionItems = []
	}

	async function createTransaction() {
		loading = true
		fetch('/api/transactions', {
			method: 'POST',
			body: JSON.stringify({
				createdAt: new Date(date),
				products: transactionItems,
			})
		})
		.then(resp => resp.json())
		.then(json => {
			dispatch('created')
			handleReset()
		})
		.catch(err => {
			error = err
			console.log(error)
		})
		.finally(() => loading = false)
	}
</script>

<CardContainer>
	<div class="grid lg:grid-cols-4 gap-4">
		<div class="lg:col-span-1 lg:row-span-2">
			<TextInput 
				type="date"
				bind:value={date}
				label="tanggal transaksi"
			/>
		</div>

		<div class="lg:col-span-3 grid gap-2">
			{#if options}
				<Select bind:value={selected} label="pilih item" {options} />
			{:else if error}
				<p>{JSON.stringify(error)}</p>
			{:else}
				<div class="w-full h-full bg-base-300 animate-pulse rounded-lg">
				</div>
			{/if}

			{#if transactionItems.length}
				<span class="text-gray-500 text-sm">item transaksi</span>
				{#each transactionItems as item, index (item.id)}
					<TransactionItem on:close={handleClose} id={item.id}>
						{ item.name }
					</TransactionItem>
				{/each}

				{#if loading}
					<button class="btn loading" disabled>loading</button>
				{:else}
					<div class="flex justify-end pt-4 gap-2">
						<button 
							class="btn btn-ghost text-primary" 
							on:click={handleReset}
						>
							hapus semua item
						</button>
						<button on:click={createTransaction} class="btn btn-primary">simpan</button>
					</div>
				{/if}
			{/if}
		</div>	
	</div>
</CardContainer>