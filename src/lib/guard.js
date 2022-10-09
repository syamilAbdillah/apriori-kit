import { redirect } from '@sveltejs/kit'

export function loggedInOnly(handler) {
	return function(event) {
		if(!event.locals.user) {
			throw redirect(301, '/login')
			return
		}

		return handler(event)
	}
}


export function notLoggedInOnly(handler) {
	return function(event) {
		if(event.locals.user) {
			throw redirect(301, '/')
			return
		}

		return handler(event)
	}
}


export function loggedInOnlyAPI(handler) {
	return function(event) {
		if(!event.locals.user) {
			throw error(401, 'not authendicated')
			return
		}

		return handler(event)
	}
}