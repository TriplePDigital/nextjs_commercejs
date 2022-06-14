// import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET)

// export default async function handler(req, res) {
// 	try {
// 		const products = await stripe.prices.list({
// 			active: true,
// 			limit: 10,
// 			expand: ['data.product']
// 		})
// 		if (!products) {
// 			throw new Error('No products found')
// 		}
// 		res.status(200).json(products.data)
// 	} catch (error) {
// 		res.status(500).json({ statusCode: 500, message: error.message })
// 	}
// }
