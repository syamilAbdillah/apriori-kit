import { sequence } from '@sveltejs/kit/hooks'
import client from './lib/prisma'

async function logger({ event, resolve }) {
	const start = Date.now()
	const response = await resolve(event)
	const finish = Date.now()
	const duration = finish - start

	console.log(`[${response.status} - ${event.request.method}] ${event.url.pathname} in ${duration} ms`)
	return response
}

async function authentication({ event, resolve }) {
	const sessionId = event.cookies.get('session_id')

	if(!sessionId) {
		return resolve(event)
	}

	const session = await client.session.findUnique({
		where: { id: sessionId },
		include: {
			user: true,
		}
	})

	if(!session) {
		return resolve(event)
	}

	event.locals.user = session?.user
	return resolve(event)
}

export const handle = sequence(logger, authentication)