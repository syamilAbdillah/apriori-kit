import client from '$lib/prisma'
import { invalid, error } from '@sveltejs/kit'

export async function load() {
	const [transactions, products] = await Promise.all([
		client.transaction.findMany({
			select: {
				id: true,
				createdAt: true,
				transactionItems: {
					select: {
						product: {
							select: {
								name: true
							},
						}
					}
				}
			},

			orderBy: {
				createdAt: 'desc'
			},
		}),
		client.product.findMany({
			orderBy: {
				name: 'asc'
			}
		})
	])

	return {
		transactions: transactions.map(transaction => {
			const items = transaction.transactionItems.map(t => t.product.name)
			items.sort((a, b) => a < b ? -1:1)
			return {
				id: transaction.id,
				createdAt: transaction.createdAt,
				items,
			}
		}),
		products,
	}
}

export const actions = {
	async delete({ request }) {
		const form = await request.formData()
		const id = form.get('id')
		const exists = await client.transaction.findUnique({
			where: {id}
		})

		if(!exists) return invalid(404, {id, errors: {id: 'transaction not found'}})

		const deleted = await client.transaction.delete({
			where: {id}
		})

		if(!deleted) return error(500)

		return {success: true}
	}
}