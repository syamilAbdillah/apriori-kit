import { PrismaClient } from '@prisma/client'

let client

if(process.env.NODE_ENV === 'production') {
	client = new PrismaClient()
} else {
	if(!global.__client) {
		global.__client = new PrismaClient()
	}

	client = global.__client
}

export default client