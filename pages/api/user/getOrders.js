import axios from 'axios'
import xml2js from 'xml2js'

export default async function (req, res) {
	if (req.method !== 'GET') {
		res.status(405).json({ message: 'Method Not Allowed' })
	} else {
		const { email } = await req.query

		const payment = await axios.post(`https://sweetblinginc.transactiongateway.com/api/query.php?security_key=${process.env.NMI_SECRET_KEY}&email=${email.toLowerCase().trim()}`)

		const parser = new xml2js.Parser()

		const response = await parser.parseStringPromise(payment.data)

		const { transaction } = response.nm_response

		if (!transaction) {
			res.status(400)
			res.json({ message: 'Transaction not found', transactions: [] })
		} else {
			//remove unnecessary properties from transaction object
			const data = transaction.map((transaction) => {
				const { transaction_id, product } = transaction
				return { transaction_id, product }
			})
			res.status(200).json({ message: 'Transaction found', transactions: data })
		}
	}
}
