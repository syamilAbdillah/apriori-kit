import { redirect } from '@sveltejs/kit'
import client from '$lib/prisma'

export const actions = {
	async default({ cookies }) {
		const sessionId = cookies.get('session_id')
		await client.session.delete({
			where: {
				id: sessionId,
			}
		})
		cookies.delete('session_id')

		throw redirect(301, '/login')
	}
}