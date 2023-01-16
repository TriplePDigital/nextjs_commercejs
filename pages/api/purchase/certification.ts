import axios from 'axios'
import getUserOrCreate from '../util/user'
import { client } from '@/util/config'
import { Certification, Enrollment, Mission } from '@/types/schema'
import createResponse from '../util/createResponse'
import { NextApiRequest, NextApiResponse } from 'next'
import { notificationBody } from '../admin/notification'

export const config = {
	runtime: 'edge'
}

export default async function purchaseCertificate(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ message: 'Method Not Allowed' })
	} else {
		try {
			const { sku, payment_token, email, firstName, lastName, amount }: { sku: string; payment_token: string; email: string; firstName: string; lastName: string; amount: number } = req.body

			// get the user or create the user checking out
			const user = await getUserOrCreate(email, firstName, lastName)

			// get the membership product
			const certificate: Omit<Certification, 'missions'> & { missions: [Mission] } = await client.fetch(`*[_type == 'certification' && sku == '${sku}']{...,missions[]->}[0]`)

			const missions = certificate.missions.map((mission) => mission)

			const missionTitles = certificate.missions.map((mission) => mission.title)

			const missionIDs: string[] = []

			missions.forEach((mission) => {
				if ('_id' in mission) {
					missionIDs.push(mission._id as string)
				}
			})

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
					order_description: `${certificate.title} certificate bundle, including courses (${missions.map((mission) => ('title' in mission ? mission.title : ''))}).`,
					security_key: process.env.NMI_SECRET_KEY,
					customer_receipt: true
				}
			})

			const isAlreadyEnrolled: Enrollment[] = await client.fetch(`*[_type == 'enrollment' && user._ref == '${user._id}']`)

			// enroll the user in the courses
			for (const missionID of missionIDs) {
				if (!isAlreadyEnrolled.some((enrollment) => enrollment?.course?._ref === missionID)) {
					await client.create({
						_type: 'enrollment',
						course: {
							_type: 'reference',
							_ref: missionID
						},
						student: {
							_type: 'reference',
							_ref: user._id
						}
					})
				} else {
					console.log(`already enrolled in ${missionID}`)
				}
			}

			// return the response
			const response = createResponse(data)

			const notification = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/notification`, {
				cause: 'purchase',
				customerFirst: firstName,
				customerLast: lastName,
				customerEmail: email,
				transactionID: 'transactionID' in response ? response.transactionID : '',
				courses: missionTitles
			} as notificationBody)

			if (response.error) {
				return res.status(400).json({ error: response.error, message: response.message })
			} else {
				return res.status(200).json({ message: 'Order created', payload: response, notification: notification.data })
			}
		} catch (e) {
			console.error(e)
			return res.status(500).json({ message: e.message })
		}
	}
}
