import axios from 'axios'

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).json({ message: 'Method Not Allowed' })
	} else {
		try {
			const {payment_token, email, first_name, last_name} = req.query
			const {data} = await axios.post(
				'https://secure.nmi.com/api/transact.php',
				{},
				{
					params: {
						type: 'sale',
						security_key: process.env.NMI_SECRET_KEY,
						payment_token,
						amount: '995.00',
						first_name,
						last_name,
						email,
						merchant_defined_field_2: '003'
					}
				}
			)
			console.log(data)
			const response = data.split('&')
			const responseCode = response[8].split('=')[1]
			const responseMsg = response[1].split('=')[1]
			const responseID = response[3].split('=')[1]
			if (Number(responseCode) === 300) {
				return res.status(400).json({message: `Payment failed due to ${responseMsg}`})
			}
			const payload = {
				transactionID: responseID,
				code: responseCode,
				message: responseMsg
			}
			return res.status(200).json({message: 'Order created', payload})
		} catch {
			return res.status(500).json({message: 'Internal Server Error'})
		}
	}
}
