import { fetcher } from './fetcher'

/**
 * Gets the user's profile document based on email address from Sanity
 * @param string the email address that the query is executed against
 * @returns user's profile document
 */
export default async function getUserByEmail(email) {
	const query = `*[_type == 'user' && email == '${email}']{_id}[0]`
	const result = await fetcher(query)
	return result
}
