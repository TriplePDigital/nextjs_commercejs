import axios from 'axios'
import xml2js from 'xml2js'

export default async function (req, res) {
	if (req.method !== 'GET') {
		res.status(405).json({ message: 'Method Not Allowed' })
	} else {
		const { transid } = await req.query

		const payment = await axios.post(`https://sweetblinginc.transactiongateway.com/api/query.php?security_key=${process.env.NMI_SECRET_KEY}&transaction_id=${transid}`)

		const parser = new xml2js.Parser()

		const response = await parser.parseStringPromise(payment.data)

		const { transaction } = response.nm_response

		if (!transaction) {
			res.status(400)
			res.json({ message: 'Transaction not found' })
		} else {
			const data = transaction[0]

			const response = {
				transaction_id: data.transaction_id[0],
				amount: data.action[0].amount[0],
				product: data.product,
				email: data.email[0],
				name: `${data.first_name[0]} ${data.last_name[0]}`,
				description: data.order_description[0]
			}
			res.status(200).json({ message: 'Transaction found', transaction: response })
		}
	}
}
