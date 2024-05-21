import axios from 'axios'
import getUserOrCreate from '../util/user'
import { client } from '@/util/config'
import createResponse from '../util/createResponse'
import { Membership } from '@/types/schema'

export const config = {
	runtime: 'edge'
}

const transact = async (
	params: {
		amount: string | number
		payment_token: string
		firstName: string
		lastName: string
		email: string
		sku?: string
	},
	url: string,
	description: string
) => {
	const { data } = await axios.post(url, null, {
		params: {
			type: 'sale',
			amount: params.amount,
			payment_token: params.payment_token,
			first_name: params.firstName,
			last_name: params.lastName,
			email: params.email,
			order_description: description,
			security_key: process.env.NMI_SECRET_KEY,
			merchant_defined_field_1: params.sku,
			merchant_defined_field_2: 'membership',
			customer_receipt: true
		}
	})
	return data
}

export default async function purchaseMembership(req, res) {
	if (req.method !== 'POST') {
		res.status(405).json({ message: 'Method Not Allowed' })
	} else {
		try {
			const { sku, payment_token, email, firstName, lastName } = req.body

			// get the user or create the user checking out
			const user = await getUserOrCreate(email, firstName, lastName)

			if (user instanceof Error) {
				throw user
			}

			// get the membership product
			const membership: Membership = await client.fetch(`*[_type == 'membership' && sku == '${sku}'][0]`)

			const transaction = await transact(
				{
					payment_token,
					sku,
					email,
					firstName,
					lastName,
					amount: membership.price
				},
				'https://secure.networkmerchants.com/api/transact.php',
				`${membership.name} membership (${sku}).`
			)

			const transactionResponse = await createResponse(transaction)

			if (transactionResponse.error === false && 'transactionID' in transactionResponse) {
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
						},
						membershipID: transactionResponse.transactionID
					})
					.commit()

				// return the response
				const response = createResponse(data)

				if (response.error) {
					return res.status(400).json({ message: response.error })
				} else {
					return res.status(200).json({ message: 'Order created', payload: response })
				}
			} else {
				return res.status(400).json({ message: transactionResponse.message })
			}
		} catch (e) {
			console.error(e)
			return res.status(500).json({ message: e.message })
		}
	}
}
