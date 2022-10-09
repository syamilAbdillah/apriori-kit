import { redirect } from '@sveltejs/kit'
import client from '$lib/prisma'
import {loggedInOnly} from '$lib/guard'


async function _default({ cookies }) {
	const sessionId = cookies.get('session_id')
	await client.session.delete({
		where: {
			id: sessionId,
		}
	})
	cookies.delete('session_id')

	throw redirect(301, '/login')
}
export const actions = {
	default: loggedInOnly(_default)
}