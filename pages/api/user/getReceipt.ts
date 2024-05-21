import axios from 'axios'
import xml2js from 'xml2js'
import createReceiptResponse from '../util/createReceiptResponse'

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

			const receipt = createReceiptResponse(data)

			res.status(200).json({ message: receipt.message, transaction: receipt })
		}
	}
}
