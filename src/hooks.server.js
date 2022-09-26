import { sequence } from '@sveltejs/kit/hooks'

async function logger({ event, resolve }) {
	const start = Date.now()
	const response = await resolve(event)
	const finish = Date.now()
	const duration = finish - start

	console.log(`[${response.status} - ${event.request.method}] ${event.url.pathname} in ${duration} ms`)
	return response
}

export const handle = sequence(logger)