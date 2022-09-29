import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const client = new PrismaClient()

async function seed() {
	try {
		const data = {
			username: 'administrator',
			password: 'administrator',
		}

		const exists = await client.user.findUnique({
			where: {
				username: data.username,
			}
		})

		if(exists) {
			console.log(`cancel seeding user with username "${data.username}" already exists`)
			return
		}

		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(data.password, salt)

		data.password = hash

		const user = await client.user.create({data})
		console.log(`success seeding user with id: ${user.id}`)
	} catch(error) {
		console.log(`failed seeding user with error: ${error.message}`)
	}
}

seed()