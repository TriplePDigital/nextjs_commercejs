import { emailConfig } from '../../util/config'
import nodemailer from 'nodemailer'
import { client } from '@/util/config'
import { purchaseTemplate } from './templates'
import axios from 'axios'
import { ReceiptResponse } from '../../util/createReceiptResponse'
import { NextApiRequest, NextApiResponse } from 'next'
import type { Notification } from '@/types/schema'

export type notificationBody = {
	cause: string
	customerEmail: string
	customerFirst: string
	customerLast: string
	transactionID: string
	courses: string[]
}

export const config = {
	runtime: 'edge'
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ message: 'Method Not Allowed', error: true })
	} else {
		// get the cause of the notification
		// get the users who are subscribed to the cause
		// send the notification to the admins
		// send welcome email to the user

		const { cause, customerEmail, customerFirst, customerLast, transactionID, courses }: notificationBody = req.body

		let { recipient: email } = await client.fetch<Omit<Notification, 'recipient'> & { recipient: [string] }>(`*[_type == 'notification' && cause == '${cause}'][0]`)

		let { data } = await axios.get<{ message: string; transaction: ReceiptResponse }>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getReceipt?transid=${transactionID}`)

		let transporter = nodemailer.createTransport(emailConfig)

		const success = await transporter.verify()

		if (success) {
			transporter
				.sendMail({
					from: process.env.EMAIL_FROM,
					to: email,
					subject: 'New Cause',
					html: purchaseTemplate({ email: customerEmail, firstName: customerFirst, lastName: customerLast, description: data.transaction.description, courses })
				})
				.then((info) => {
					res.status(200).json({ message: 'Email sent', error: false, info })
				})
				.catch((err) => {
					res.status(400).json({ message: 'Error while attempting to send email', error: true, err })
				})
		} else {
			res.status(400).json({ message: 'Error establishing connection with SMTP server', error: true })
		}
	}
}
