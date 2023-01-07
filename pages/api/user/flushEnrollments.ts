import { client } from '@/util/config'

export default async function (req, res) {
	// take in user ID as a query param
	// get all enrollments for that user
	// delete all enrollments for that user
	// return success and user account

	if (req.method !== 'POST') {
		res.status(405).json({ message: 'Method Not Allowed' })
	} else {
		try {
			const { userID } = await req.query
			const query = `*[_type == "enrollment" && student._ref == "${userID}"]`
			const enrollments = await client.fetch(query)
			enrollments.map(async (enrollment) => await client.delete(enrollment._id))
			res.status(200).json({ message: 'Enrollments flushed', response: true })
		} catch (e) {
			res.status(400).json({ message: e.message })
		}
	}
}
