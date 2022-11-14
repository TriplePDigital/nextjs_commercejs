import axios from 'axios'

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).json({ message: 'Method Not Allowed' })
	} else {
		const { payment_token, email, fname, lname } = req.body
		const { data } = await axios.post(
			'https://secure.nmi.com/api/transact.php',
			{},
			{
				params: {
					type: 'sale',
					security_key: process.env.NMI_SECRET_KEY,
					payment_token,
					amount: '19.95',
					first_name: fname,
					last_name: lname,
					email
				}
			}
		)
		res.status(200).json({ message: 'Order created', data })
	}
}
