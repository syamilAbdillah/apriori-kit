import { error, invalid } from '@sveltejs/kit'
import client from '$lib/prisma'

export async function load() {
	const products = await client.product.findMany({
		orderBy: {
			name: 'asc'
		}
	})

	return { products }
}

export const actions = {
	async create({ request }) {
		const form = await request.formData()
		let name = form.get('name')
		let id = crypto.randomUUID()

		// validation
		name = superTrim(name).toLowerCase()
		if(name.length < 1) {
			return invalid(422, {
				name,
				errors: {
					name: 'nama produk tidak boleh kosong !!'
				}
			})
		}

		const exists = await client.product.findUnique({
			where: {name}
		})

		if(exists) {
			console.log('invalid violate unique contstraint')
			return invalid(422, {
				name,
				errors: {
					name: `"${name}" telah digunakan, silahkan pilih nama produk yang unik`,
				}
			})
		}


		// perisiting to db
		const result = await client.product.create({
			data: {id, name}
		})

		return {result}
	},
	async delete({ request }) {
		const form = await request.formData()
		const id = form.get('id')

		const exists = await client.transactionItem.findFirst({
			where: {
				productId: id,
			},
		})

		if(exists) {
			return invalid(422, {
				id, 
				errors: {
					product: `produk "${exists.name}" telah digunakan dalam transaksi, tolong hapus transaksi tersebut terlebih dahulu`
				}
			})
		} 

		const deletedProduct = await client.product.delete({
			where: {id}
		})

		if(!deletedProduct) {
			throw error(500)
		}

		return {
			product: deletedProduct,
			success: true,
		}
	},
}

function superTrim(str) {
	return str.split(' ').filter(word => word.length > 0).join(' ')
}