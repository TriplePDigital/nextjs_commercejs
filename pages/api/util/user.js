import { client } from '@/util/config'

export const config = {
	runtime: 'edge'
}

const getUserOrCreate = async (email, firstName, lastName, role = 'student') => {
	const userCheck = await client.fetch(`*[_type == 'user' && email == '${email.toLowerCase().trim()}'][0]`)

	let user

	if (!userCheck) {
		//create user object
		let userObj = {
			_type: 'user',
			email: email.toLowerCase().trim(),
			firstName,
			lastName,
			active: false,
			role,
			avatar: {
				_type: 'image',
				asset: {
					_ref: 'image-9dcb9bb1b32805305dedaf9f0a2161930f585190-500x500-png',
					_type: 'reference'
				}
			}
		}

		user = await client.create(userObj)
	} else {
		//return existing user
		user = userCheck
	}

	return user
}

export default getUserOrCreate
