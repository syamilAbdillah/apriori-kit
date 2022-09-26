import { json } from '@sveltejs/kit'
import client from '$lib/prisma'

export async function POST({ request }) {
	const payload = await request.json()
	let createdAt = String(new Date(payload.createdAt).getTime())
	let id = crypto.randomUUID()

	const transactionItems = payload
		.products
		.map(product => ({ productId: product.id }))

	const result = await client.transaction.create({
		data: {
			id,
			createdAt,
			transactionItems: {
				create: transactionItems,
			}
		}
	})

	console.log(result)

	return json(result)
}