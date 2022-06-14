import axios from 'axios'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		// eslint-disable-next-line no-unused-vars
		const { quizID, answers } = req.body

		const query =
			encodeURIComponent(`*[_type == 'checkpoint' && _id == '9902f253-9878-41f2-884e-f18dc2471f7b']{
                ...,
                questions[] -> {
                    ...,
                    answers
                }
            }`)

		return await axios.get(
			`${process.env.NEXT_PUBLIC_SANITY_URL}query=${query}`
		)
	} else {
		res.setHeader('Allow', 'POST')
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
