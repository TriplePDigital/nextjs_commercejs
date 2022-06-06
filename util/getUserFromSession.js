import { fetcher } from './fetcher'
import groq from 'groq'

export default async function getUserFromSession(email) {
	const query = groq`*[_type=="user" && email=="${email}"]{_id, role}[0]`

	return await fetcher(query)
}
