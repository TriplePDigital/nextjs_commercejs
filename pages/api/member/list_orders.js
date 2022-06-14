// import Stripe from 'stripe'
// import { User } from '../../../models/User'
// import dbConnect from '../../../util/db'
// const stripe = new Stripe(process.env.STRIPE_SECRET)

// dbConnect()

// export default async function (req, res) {
// 	try {
// 		let account = await User.findOne({ _id: req.query.id }).exec()

// 		if (!account) {
// 			return res.status(404).json({ error: 'User not found' })
// 		} else {
// 			const invoices = await stripe.invoices.list({
// 				limit: 100
// 			})

// 			if (!invoices) {
// 				throw new Error('No products found')
// 			}

// 			const red = invoices.data.filter(
// 				(invoice) => invoice.customer_email === account.email
// 			)

// 			if (red.length === 0) {
// 				throw new Error('No products found')
// 			} else {
// 				res.status(200).json(red)
// 			}
// 		}
// 	} catch (error) {
// 		res.status(500).json({ message: error.message })
// 	}
// }
