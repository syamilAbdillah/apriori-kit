import { json } from '@sveltejs/kit'
import client from '$lib/prisma'
import {loggedInOnlyAPI} from '$lib/guard'

async function _POST({ request }) {
	const payload = await request.json()
	let createdAt = new Date(payload.createdAt)
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


export const POST = loggedInOnlyAPI(_POST)