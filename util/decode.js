import jsonwebtoken from 'jsonwebtoken'

export default function decode() {
	const token = document.cookie.matchAll('next-auth.session-token')
	if (token) {
		try {
			const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
			return decoded
		} catch (e) {
			return null
		}
	}
	return null
}
