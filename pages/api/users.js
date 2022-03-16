import dbConnect from '../../util/db'
import { User } from '../../models/User'

dbConnect()

export default async function (req, res) {
	try {
		if (req.method === 'GET') {
			let doc = await User.find().exec()
			res.status(200)
			res.json(doc)
		}
		if (req.method === 'POST') {
			let doc = await User.findOne({ email: req.body.email })

			if (doc) {
				res.status(500).json({ error: 'User already exists' })
			} else {
				let newUser = {
					email: req.body.email,
					orders: req.body.orders
				}
				let result = await User.create(newUser)
				res.json(result)
			}
		}
	} catch (error) {
		res.status(500)
		res.json({ message: error.message })
	}
}
