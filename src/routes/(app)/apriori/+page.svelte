<script>
	import { enhance, applyAction } from '$app/forms'
	import CardContainer from '$lib/CardContainer.svelte'
	import TextInput from '$lib/TextInput.svelte'

	export let form
	let loading = false

	const submitAction = ({ cancel }) => {
		if(loading) {
			cancel()
		}
		if(form) {
			form = undefined
		}
		loading = true
		return ({ result }) => {
			loading = false
			applyAction(result)
			console.log(result)
		}
	}
</script>

<svelte:head>
	<title>analisa apriori</title>
</svelte:head>

<div class="grid gap-4 lg:grid-cols-2">
	<div class="lg:col-span-2">
		<CardContainer>
			<form 
				method="POST"
				class="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
				use:enhance={submitAction}
			>
				<TextInput  
					name="from"
					label="dari"
					type="date"
					value={form?.from || ''}
					required
				/>
				<TextInput  
					name="to"
					label="hingga"
					type="date"
					value={form?.to || ''}
					required
				/>
				<TextInput  
					name="support"
					label="min. support % (dalam persen)"
					type="number"
					min={1}
					max={100}
					value={form?.support || 1}
					required
				/>
				<TextInput  
					name="confidence"
					label="min. confidence % (dalam persen)"
					type="number"
					min={1}
					max={100}
					value={form?.confidence || 1}
					required
				/>

				<div class="flex justify-end pt-4 md:col-span-2 lg:col-span-4">
					{#if loading}
						<button class="btn loading" disabled>loading</button>
					{:else}
						<button class="btn btn-primary" type="submit">submit</button>
					{/if}
				</div>
			</form>
		</CardContainer>
	</div>
	{#if loading}
		<button class="btn btn-lg btn-circle loading btn-primary mx-auto"></button>
	{/if}

	{#if form?.transactions}
		<CardContainer title="daftar transaksi penjualan">
			<div class="overflow-x-auto">
				<table class="table w-full">
					<thead>
						<colgroup>
							<col class="w-auto">
							<col class="w-auto">
							<col class="w-full">
						</colgroup>
						<tr>
							<th>#</th>
							<th>tanggal</th>
							<th>itemset</th>
						</tr>
					</thead>
					<tbody>
						{#each form.transactions as transaction, index (transaction.id)}
							<tr>
								<th>{index + 1}</th>
								<td>{transaction.createdAt}</td>
								<td>{transaction.itemset}</td>
							</tr>
						{:else}
							<tr>
								<td colspan="3">
									<div class="flex w-full justify-center py-2">
										<span class="text-gray-400">tidak di temukan</span>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>

				</table>
			</div>
		</CardContainer>
	{/if}

	{#if form?.iterations}
		{#each form.iterations as iteration, index}
			<CardContainer title={`iterasi ke-${index + 1}`}>
				<div class="overflow-x-auto">
					<table class="table w-full">
						<colgroup>
							<col class="w-auto">
							<col class="w-full">
							<col class="w-auto">
							<col class="w-auto">
						</colgroup>
						<thead>
							<tr>
								<th>#</th>
								<th>itemset</th>
								<th>support</th>
								<th>frequent</th>
							</tr>
						</thead>
						<tbody>
							{#each iteration as iterationItem, i }
								<tr>
									<th>{i + 1}</th>
									<td>{iterationItem.itemset}</td>
									<td>{iterationItem.support} %</td>
									<td>{iterationItem.frequent}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</CardContainer>
		{/each}
	{/if}
	{#if form?.rules}
		<div class="lg:col-span-2">
			<CardContainer title="hasil algoritma apriori">
				<div class="grid gap-8">
					{#each Object.keys(form.rules) as key, index}
						<div class="overflow-x-auto">
							<span class="text-lg font-thin font-mono">[ {key} ]</span>
							<table class="table w-full">
								<colgroup>
									<col class="w-auto">
									<col class="w-full">
									<col class="w-auto">
									<col class="w-auto">
								</colgroup>
								<thead>
									<tr>
										<th>#</th>
										<th>aturan asosiatif (A -> B)</th>
										<th>support AUB</th>
										<th>support A</th>
										<th>confidence</th>
									</tr>
								</thead>
								<tbody>
									{#each form.rules[key] as rule, i}
										<tr>
											<th>{i + 1}</th>
											<td>{rule.x}  ->  {rule.y}</td>
											<td>{rule.supportXUY} %</td>
											<td>{rule.supportX} %</td>
											<td>{rule.confidence} %</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						{#if (Object.keys(form.rules).length - index) > 1}
							<div class="divider"></div>
						{/if}
					{/each}
				</div>
			</CardContainer>
		</div>
	{/if}
</div>
