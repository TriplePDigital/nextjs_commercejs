// import Stripe from 'stripe'
// const stripe = new Stripe(process.env.STRIPE_SECRET)

// export default async function handler(req, res) {
// 	//TODO: look up user based on email in req.body.email
// 	//TODO: store associated customer id in user's document in database
// 	if (req.method === 'POST') {
// 		// eslint-disable-next-line no-unused-vars
// 		const customerID = 'cus_KYL47WhERA3FGA'
// 		try {
// 			const email =
// 				req.body.email === ''
// 					? 'daniel_papp@outlook.com'
// 					: req.body.email
// 			const session = await stripe.checkout.sessions.create({
// 				mode: req.body.mode ?? 'payment',
// 				payment_method_types: ['card'],
// 				line_items: req.body.items ?? [],
// 				success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
// 				cancel_url: `${req.headers.origin}/products`,
// 				customer_email: email
// 			})
// 			if (session) {
// 				//TODO: if user is purchasing a membership, add membership level to user's document in db
// 				res.status(200).json(session)
// 			}
// 		} catch (error) {
// 			res.status(500).json({
// 				statusCode: 500,
// 				message: error.message
// 			})
// 		}
// 	} else {
// 		res.setHeader('Allow', 'POST')
// 		res.status(405).end(`Method ${req.method} Not Allowed`)
// 	}
// }
