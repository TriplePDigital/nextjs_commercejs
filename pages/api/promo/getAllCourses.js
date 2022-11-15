import axios from 'axios'

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		res.status(405).json({ message: 'Method Not Allowed' })
	} else {
		const query = `*[_type == "mission"]{_id, sku}`
		const courses = await axios.get(`https://tfh7h5l0.apicdn.sanity.io/vX/data/query/production?query=${encodeURIComponent(query)}`)

		if (!courses) {
			res.status(400)
			res.json({ message: 'Courses not found', courses: [] })
		} else {
			//add quantity of 1 to each course
			const data = courses.data.result.map((course) => {
				const { _id, sku } = course
				return { sku, quantity: 1 }
			})
			res.status(200).json({ message: 'Courses found', courses: data })
		}
	}
}
