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
	const redirect = to => Response.redirect(event.url.origin + to)
	const sessionId = event.cookies.get('session_id')
	const isLogin = event.url.pathname == '/login'

	if(isLogin && !sessionId) {
		return resolve(event)
	}

	if(!isLogin && !sessionId) {
		return redirect('/login')
	}

	const session = await client.session.findUnique({
		where: { id: sessionId },
		include: {
			user: true,
		}
	})

	if(isLogin && session) {
		return redirect('/')
	}

	if(!isLogin && !session) {
		return redirect('/login')
	}

	event.locals.user = session?.user
	return resolve(event)
}

export const handle = sequence(logger, authentication)