import getUserFromSession from './getUserFromSession'

export const isActive = async (sessionEmail) => {
	try {
		const userCheck = await getUserFromSession(sessionEmail)
		if (!userCheck) {
			return false
		} else {
			return userCheck.active ? true : false
		}
	} catch (error) {
		throw new Error(error)
	}
}
