import getUserOrCreate from '../util/user'
import { client } from '@/util/config'
import { Track } from '@/types/schema'

export default async function purchaseTrack(req, res) {
	if (req.method !== 'POST') {
		res.status(405).json({ message: 'Method Not Allowed' })
	} else {
		try {
			const { sku, payment_token, email, firstName, lastName, amount }: RequestBody = req.body

			// get the user or create the user checking out
			const user = await getUserOrCreate(email, firstName, lastName)

			// get the track product
			const track = await client.fetch<Track>(`*[_type == 'track' && sku == '${sku}'][0]`)

			res.status(200).json({ message: 'success', track })
		} catch (e) {
			res.status(500).json({ message: e.message })
		}
	}
}

interface RequestBody {
	sku: string
	payment_token: string
	email: string
	firstName: string
	lastName: string
	amount?: number
}
