import { invalid, error } from '@sveltejs/kit'
import bcrypt from 'bcryptjs'
import client from '$lib/prisma'

export async function load({ locals }) {
	const users = await client.user.findMany({
		where: {
			NOT: {
				username: locals.user.username
			}
		}
	})

	return {
		users,
	}
}

export const actions = {
	async create({ request }) {
		const form = await request.formData()
		let username = String(form.get('username')).trim()
		let password = String(form.get('password'))
		let confirm = String(form.get('confirm'))

//	validation
		if(username.length < 4) {
			return invalid(422, {
				username,
				errors: {
					username: 'minimal 4 karakter'
				}
			})
		}

		if(password.length < 8) {
			return invalid(422, {
				username,
				errors: {
					password: 'minimal 8 karakter'
				}
			})
		}

		if(password != confirm) {
			return invalid(422, {
				username,
				errors: {
					confirm: 'tidak cocok dengan password'
				}
			})
		}

		const exists = await client.user.findUnique({
			where: {username}
		})

		if(exists) {
			return invalid(422, {
				username,
				errors: {
					username: 'telah digunakan pengguna lain'
				}
			})
		}
// 	password hashing
		const salt = await bcrypt.genSalt(10)
		password = await bcrypt.hash(password, salt)
//	data persisting
		try {
			const user = await client.user.create({
				data: {
					username,
					password,
				}
			})
			return {success: true, user}
		} catch(error) {
			throw error(500)
		}
	},
	async delete({ request }) {
		const form = await request.formData()
		let id = String(form.get('id'))

		const exists = await client.user.findUnique({
			where: {id}
		})

		if(!exists) {
			return invalid(404, {
				id,
				errors: {
					id: `perngguna dengan id "${id}" tidak ditemukan`
				}
			})
		}

		const deleted = await client.user.delete({
			where: {id}
		})

		if(!deleted) {
			throw error(500)
		}

		return {success: true}
	}
}

