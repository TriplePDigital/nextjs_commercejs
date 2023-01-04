import axios from 'axios'
import xml2js from 'xml2js'
import { client } from '@/util/config'

// offload the user checking to this function.
// takes in an email and returns either the found user or a newly created user
const userCheck = async () => {}

export const config = {
	runtime: 'edge'
}

export default async function (req, res) {
	if (req.method !== 'POST') {
		res.status(405).json({ message: 'Method Not Allowed' })
	} else {
		const {
			billing_address: { first_name, last_name, email },
			transaction_id
		} = await req.body.event_body

		const payment = await axios.post(`https://sweetblinginc.transactiongateway.com/api/query.php?security_key=${process.env.NMI_SECRET_KEY}&transaction_id=${transaction_id}`)

		const parser = new xml2js.Parser()

		const response = await parser.parseStringPromise(payment.data)

		const { transaction } = response.nm_response

		if (!transaction) {
			res.status(400)
			res.json({ message: 'Transaction not found' })
		} else {
			const data = transaction[0]

			if (!data.product && data.action[0].source[0] === 'api') {
				// enroll from custom API order
				// this will be converted to a switch statement that checks the merchant defined field against each track and bundles SKU
				try {
					const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/promo/getAllCourses`)

					const userCheck = await client.fetch(`*[_type == 'user' && email == '${email.toLowerCase().trim()}'][0]`)

					let user

					if (!userCheck) {
						//create user object
						let userObj = {
							_type: 'user',
							email: email.toLowerCase().trim(),
							firstName: first_name,
							lastName: last_name,
							active: false,
							role: 'student',
							avatar: {
								_type: 'image',
								asset: {
									_ref: 'image-9dcb9bb1b32805305dedaf9f0a2161930f585190-500x500-png',
									_type: 'reference'
								}
							}
						}

						user = await client.create(userObj)
					} else {
						//link enrollment to existing user
						user = userCheck
					}

					const filteredCourses = data.courses.filter((item) => item.sku !== undefined && item.sku !== null)
					const payload = {
						count: filteredCourses.length
					}

					// default document of enrollments with PCRM enrollment preset
					let enrollmentDoc = [
						{
							_type: 'enrollment',
							student: {
								_type: 'reference',
								_ref: user._id
							},
							course: {
								_type: 'reference',
								_ref: 'c0631150-7b17-40c8-b756-8fa25a139e58'
							}
						}
					]

					for (const item of filteredCourses) {
						enrollmentDoc.push({
							_type: 'enrollment',
							student: {
								_type: 'reference',
								_ref: user._id
							},
							course: {
								_type: 'reference',
								_ref: item._id
							}
						})
					}
					const enrollmentProcess = enrollmentDoc.map(async (enrollment) => {
						return await client.create(enrollment)
					})
					payload['enrollments'] = await Promise.all(enrollmentProcess)
					return res.status(200).json({ message: 'Transaction found', data: payload })
				} catch (error) {
					return res.status(500).json({ message: error.message })
				}
			} else if (data.product.length > 1) {
				console.log(data.product)

				const products = data.product

				const userCheck = await client.fetch(`*[_type == 'user' && email == '${email.toLowerCase().trim()}'][0]`)

				let user

				if (!userCheck) {
					//create user object
					let userObj = {
						_type: 'user',
						email: email.toLowerCase().trim(),
						firstName: first_name,
						lastName: last_name,
						active: false,
						role: 'student',
						avatar: {
							_type: 'image',
							asset: {
								_ref: 'image-9dcb9bb1b32805305dedaf9f0a2161930f585190-500x500-png',
								_type: 'reference'
							}
						}
					}

					user = await client.create(userObj)
				} else {
					//link enrollment to existing user
					user = userCheck
				}

				//for each product in the array, create an enrollment object and link it to the user

				const enrollments = products.map(async (product) => {
					const docs = await client.fetch(`*[_type == 'mission' && sku == '${product.sku[0]}'][0]`)
					if (docs) {
						return { sku: docs.sku, mission: docs._id }
					}
				})

				Promise.all(enrollments)
					.then((enrollments) => {
						let enrollmentDoc = []
						enrollments.forEach((enrollment) => {
							if (enrollment) {
								enrollmentDoc.push({
									_type: 'enrollment',
									student: {
										_type: 'reference',
										_ref: user._id
									},
									course: {
										_type: 'reference',
										_ref: enrollment.mission
									}
								})
							}
						})
						console.log(enrollmentDoc)
						enrollmentDoc.forEach(async (enrollment) => {
							const doc = await client.create(enrollment)
							res.status(200).json({ message: 'Enrollment successful', enrollment: doc })
						})
					})
					.catch((err) => {
						res.status(400).json({ message: 'Error creating enrollment', error: err })
					})

				res.status(200).json({ message: 'Multiple products purchased', products })
			} else {
				const product = data.product[0]
				const sku = product.sku[0]

				//Set of SKUs that represent membership rather than a course
				const membs = ['000', '001', '002', '003', '004']

				console.log(`includes membership sku?: ${membs.includes(sku)}`)

				const membership = await client.fetch(`*[_type == 'membership' && sku == '${sku}'][0]`)
				const user = await client.fetch(`*[_type == 'user' && email == '${email.toLowerCase().trim()}'][0]`)
				const course = await client.fetch(`*[_type == 'mission' && sku == '${sku}'][0]`)
				switch (membs.includes(sku)) {
					case true:
						if (user) {
							await client
								.patch(user._id)
								.set({
									membershipType: {
										_type: 'reference',
										_ref: membership._id
									}
								})
								.commit()
							res.status(200).json({ message: 'User updated successfully' })
						} else {
							const doc = {
								_type: 'user',
								email,
								firstName: first_name,
								lastName: last_name,
								avatar: {
									_type: 'image',
									asset: {
										_ref: 'image-9dcb9bb1b32805305dedaf9f0a2161930f585190-500x500-png',
										_type: 'reference'
									}
								},
								membershipType: {
									_type: 'reference',
									_ref: membership._id
								},
								role: 'student',
								active: false
							}

							const basicAccount = await client.create(doc)

							res.status(200).json({ message: 'User created', user: basicAccount })
						}
						break
					case false:
						if (user) {
							const existingUser = user
							const existingEnrollments = await client.fetch(`*[_type == 'enrollment' && student._ref == '${existingUser._id}']{..., course->{...}}`)

							for (const enrollment of existingEnrollments) {
								if (enrollment.course.sku === sku) {
									//TODO: handle the refund of the purchase if the user already has the course
									res.status(400).json({ message: 'User already enrolled in the purchased course' })
								}
							}

							const enrollment = await client.create({
								_type: 'enrollment',
								student: { _type: 'reference', _ref: existingUser._id },
								course: { _type: 'reference', _ref: course._id }
							})
							res.status(200).json({ message: 'User enrolled in course', enrollment })
						} else {
							const doc = {
								_type: 'user',
								email,
								firstName: first_name,
								lastName: last_name,
								avatar: {
									_type: 'image',
									asset: {
										_ref: 'image-9dcb9bb1b32805305dedaf9f0a2161930f585190-500x500-png',
										_type: 'reference'
									}
								},
								role: 'student',
								active: false
							}

							const basicAccount = await client.create(doc)

							const enrollment = {
								_type: 'enrollment',
								course: {
									_type: 'reference',
									_ref: course._id
								},
								student: {
									_ref: basicAccount._id,
									_type: 'reference'
								}
							}

							const enrollmentCreate = await client.create(enrollment)

							res.status(200).json({ message: 'User created', user: basicAccount, enrollment: enrollmentCreate })
						}
						break
					default:
						res.status(400).json({ message: 'Could not enroll user' })
				}
			}
		}
	}
}
