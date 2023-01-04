import axios from 'axios'
import getUserOrCreate from '../util/user'
import { client } from '@/util/config'
import { Certificate } from '@/types/schema/certificate'
import { Mission } from '@/types/schema/mission'

export const config = {
	runtime: 'edge'
}

export default async function purchaseMembership(req, res) {
	if (req.method !== 'POST') {
		res.status(405).json({ message: 'Method Not Allowed' })
	} else {
		try {
			const { sku, payment_token, email, firstName, lastName, amount }: { sku: string; payment_token: string; email: string; firstName: string; lastName: string; amount: number } = req.body

			// get the user or create the user checking out
			const user = await getUserOrCreate(email, firstName, lastName)

			// get the membership product
			const certificate: Certificate = await client.fetch(`*[_type == 'certification' && sku == '${sku}']{...,missions[]->}[0]`)

			const missions: Mission[] = certificate.missions.map((mission) => mission)

			// complete the purchase of the membership
			const url = `https://secure.networkmerchants.com/api/transact.php`

			const { data } = await axios.post(url, null, {
				params: {
					type: 'sale',
					amount: amount,
					sku: sku,
					payment_token,
					first_name: firstName,
					last_name: lastName,
					email,
					order_description: `${certificate.title} certificate bundle, including courses (${missions.map((mission) => mission.title)}).`,
					security_key: process.env.NMI_SECRET_KEY,
					customer_receipt: true
				}
			})

			// update the user with the new membership

			// await client
			// 	.patch(user._id)
			// 	.set({
			// 		membershipType: {
			// 			_type: 'reference',
			// 			_ref: membership._id
			// 		}
			// 	})
			// 	.commit()

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
