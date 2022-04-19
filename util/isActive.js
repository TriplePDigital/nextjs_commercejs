import { configuredSanityClient as client } from '@/util/img'

export const isActive = async (sessionEmail) => {
	try {
		const query = `*[_type == 'user' && email == '${await sessionEmail}']`
		const userCheck = await client.fetch(query, {})

		if (userCheck.length === 0) {
			// throw 'User not found'
			return false
		} else {
			const active = await userCheck[0].active
			if (active) {
				return true
			} else {
				return false
			}
		}
	} catch (error) {
		throw new Error(error)
	}
}
