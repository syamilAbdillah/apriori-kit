import client from '$lib/prisma'
import toHTMLDate from '$lib/toHTMLDate'
import apriori from '$lib/apriori'

export let actions = {
	async default({ request }) {
		const form = await request.formData()

		let from = new Date(form.get('from'))
		let to = new Date(form.get('to'))
		let support = Number(form.get('support'))
		let confidence = Number(form.get('confidence'))
		
		if(isNaN(from.getTime())) {
			from = new Date()
		}

		if(isNaN(to.getTime())) {
			to = new Date()
		}

		if(isNaN(support) || support < 1) {
			support = 1
		}

		if(isNaN(confidence) || confidence < 1) {
			confidence = 1
		}

		if(support > 100) {
			support = 100
		}

		if(confidence > 100) {
			confidence = 100
		}

		const transactions = await client.transaction.findMany({
			where: {
				createdAt: {
					gte: from,
					lte: to,
				}
			},
			select: {
				id: true,
				createdAt: true,
				transactionItems: {
					select: {
						product: {
							select: {
								name: true
							}
						}
					}
				}
			}
		})

		const _transactions = []

		const itemsetList = transactions.map(transaction => {
			const _transaction = {
				id: transaction.id,
				createdAt: toHTMLDate(transaction.createdAt),
			}
			const itemset = transaction.transactionItems.map(items => items.product.name)
			itemset.sort()
			_transaction.itemset = itemset.join(',  ')
			_transactions.push(_transaction)
			return itemset
		})

		const {iterations, rules} = await apriori(itemsetList, support, confidence)

		return {
			from: toHTMLDate(from),
			to: toHTMLDate(to),
			support,
			confidence,
			rules,
			iterations,
			transactions: _transactions,
		}
	}
}