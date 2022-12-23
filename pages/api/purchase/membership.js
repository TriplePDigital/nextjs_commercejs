import axios from 'axios'
import getUserOrCreate from '../util/user'
import { client } from '@/util/config'

export const config = {
	runtime: 'edge'
}

export default async function purchaseMembership(req, res) {
	if (req.method !== 'POST') {
		res.status(405).json({ message: 'Method Not Allowed' })
	} else {
		try {
			const { sku, payment_token, email, firstName, lastName } = req.body

			// get the user or create the user checking out
			const user = await getUserOrCreate(email, firstName, lastName)

			// get the membership product
			const membership = await client.fetch(`*[_type == 'membership' && sku == '${sku}'][0]`)

			// complete the purchase of the membership
			const url = `https://secure.networkmerchants.com/api/transact.php`

			const { data } = await axios.post(url, null, {
				params: {
					recurring: 'add_subscription',
					plan_id: sku,
					payment_token,
					first_name: firstName,
					last_name: lastName,
					email,
					order_description: `${membership.name} membership`,
					security_key: process.env.NMI_SECRET_KEY,
					customer_receipt: true
				}
			})

			// update the user with the new membership
			await client
				.patch(user._id)
				.set({
					membershipType: {
						_type: 'reference',
						_ref: membership._id
					}
				})
				.commit()

			// return the response
			const response = data.split('&')
			const responseCode = response[8].split('=')[1]
			const responseMsg = response[1].split('=')[1]
			const responseID = response[3].split('=')[1]
			if (Number(responseCode) === 300) {
				return res.status(400).json({ message: `Payment failed due to ${responseMsg}` })
			}
			const payload = {
				transactionID: responseID,
				code: responseCode,
				message: responseMsg
			}
			return res.status(200).json({ message: 'Order created', payload })
		} catch (e) {
			console.error(e)
			return res.status(500).json({ message: e.message })
		}
	}
}
