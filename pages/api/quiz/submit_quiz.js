import axios from 'axios'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { quizID, answers } = req.body

		const query =
			encodeURIComponent(`*[_type == 'checkpoint' && _id == '9902f253-9878-41f2-884e-f18dc2471f7b']{
                ...,
                questions[] -> {
                    ...,
                    answers
                }
            }`)

		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_SANITY_URL}query=${query}`
		)

		console.log(res)
	} else {
		res.setHeader('Allow', 'POST')
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
