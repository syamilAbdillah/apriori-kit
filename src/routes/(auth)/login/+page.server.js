import { invalid, redirect } from '@sveltejs/kit'
import bcrypt from 'bcryptjs'
import client from '$lib/prisma'
import {notLoggedInOnly} from '$lib/guard'


async function _default({ request, cookies }) {
	const form = await request.formData()
	let username = form.get('username')
	let password = form.get('password')
	const invalidPayload = {
		username,
		errors: {
			username: 'username atau password salah'
		}
	}

	const user = await client.user.findUnique({
		where: {username}
	})
	if(!user) return invalid(422, invalidPayload)
	
	const valid = await bcrypt.compare(password, user.password)
	if(!valid) return invalid(422, invalidPayload)

	const session = await client.session.create({data: {userId: user.id}})
	console.log()
	cookies.set('session_id', session.id)

	throw redirect(301, '/')
}

export const load = notLoggedInOnly(e => {
	return {
		success: true,
	}
})
export const actions = {
	default: notLoggedInOnly(_default),
}