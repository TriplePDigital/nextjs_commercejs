import axios from 'axios'
import xml2js from 'xml2js'
import { client } from '@/util/config'

// offload the user checking to this function.
// takes in an email and returns either the found user or a newly created user
const userCheck = async () => {}

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

				const course = await client.fetch(`*[_type == 'mission' && sku == '${sku}'][0]`)

				const userCheck = await client.fetch(`*[_type == 'user' && email == '${email.toLowerCase().trim()}']`)

				if (userCheck.length > 0) {
					const existingUser = userCheck[0]
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
			}
		}
	}
}

/***************************************************************************************************/

// {
//     "event_id": "9b312dfd-3174-4748-9447-d63c8744305a",
//     "event_type": "transaction.sale.success",
//     "event_body": {
//         "merchant": {
//             "id": "1234",
//             "name": "Test Account"
//         },
//         "features": {
//             "is_test_mode": true
//         },
//         "transaction_id": "1234560000",
//         "transaction_type": "cc",
//         "condition": "pendingsettlement",
//         "processor_id": "ccprocessora",
//         "ponumber": "123456789",
//         "order_description": "this is a description",
//         "order_id": "12345678",
//         "customerid": "",
//         "customertaxid": "",
//         "website": "https://example.com",
//         "shipping": "",
//         "currency": "USD",
//         "tax": "0.08",
//         "surcharge": "",
//         "cash_discount": "",
//         "tip": "",
//         "requested_amount": "54.04",
//         "shipping_carrier": "",
//         "tracking_number": "",
//         "shipping_date": "",
//         "partial_payment_id": "",
//         "partial_payment_balance": "",
//         "platform_id": "",
//         "authorization_code": "123456",
//         "social_security_number": "",
//         "drivers_license_number": "",
//         "drivers_license_state": "",
//         "drivers_license_dob": "",
//         "billing_address": {
//             "first_name": "Jessica",
//             "last_name": "Jones",
//             "address_1": "123 Fake St.",
//             "address_2": "123123",
//             "company": "Alias Investigations",
//             "city": "New York City",
//             "state": "NY",
//             "postal_code": "12345",
//             "country": "US",
//             "email": "someone@example.com",
//             "phone": "555-555-5555",
//             "cell_phone": "",
//             "fax": "444-555-6666"
//         },
//         "shipping_address": {
//             "first_name": "Jessica",
//             "last_name": "Jones",
//             "address_1": "123 Fake St.",
//             "address_2": "123123",
//             "company": "Alias Investigations",
//             "city": "New York City",
//             "state": "NY",
//             "postal_code": "12345",
//             "country": "US",
//             "email": "someone@example.com",
//             "phone": "",
//             "fax": ""
//         },
//         "card": {
//             "cc_number": "411111******1111",
//             "cc_exp": "1022",
//             "cavv": "",
//             "cavv_result": "",
//             "xid": "",
//             "eci": "",
//             "avs_response": "N",
//             "csc_response": "",
//             "cardholder_auth": "",
//             "cc_start_date": "",
//             "cc_issue_number": "",
//             "card_balance": "",
//             "card_available_balance": "",
//             "entry_mode": "",
//             "cc_bin": "",
//             "cc_type": ""
//         },
//         "action": {
//             "amount": "54.04",
//             "action_type": "sale",
//             "date": "20200406175755",
//             "success": "1",
//             "ip_address": "1.2.3.4",
//             "source": "virtual_terminal",
//             "api_method": "virtual_terminal",
//             "username": "exampleuser",
//             "response_text": "SUCCESS",
//             "response_code": "100",
//             "processor_response_text": "",
//             "processor_response_code": "",
//             "device_license_number": "",
//             "device_nickname": ""
//         }
//     }
// }
