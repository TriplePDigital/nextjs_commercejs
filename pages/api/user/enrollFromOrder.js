import { post } from 'axios'
import xml2js from 'xml2js'
import { configuredSanityClient as client } from '@/util/img'
import { nanoid } from 'nanoid'

export default async function (req, res) {
	try {
		if (req.method === 'GET') {
			res.status(405)
		}
		if (req.method === 'POST') {
			const { first_name, last_name, email } = await req.body.event_body
				.billing_address
			const { transaction_id } = await req.body.event_body

			const payment = await post(
				`https://paybotic.transactiongateway.com/api/query.php?security_key=${
					process.env.NEXT_PUBLIC_PAYBOTIC_KEY
				}&transaction_id=${transaction_id}`
			)

			const parser = new xml2js.Parser()

			const response = await parser.parseStringPromise(payment.data)

			const { transaction } = response.nm_response

			const data = transaction[0]

			const courseName = data?.product[0]?.description[0]

			const courses = await client.fetch(
				`*[_type == 'mission' && title == '${courseName}']`, // query
				{} // params
			)

			const userCheck = await client.fetch(
				`*[_type == 'user' && email == '${email}']`, // query
				{} // params
			)

			if (userCheck.length > 0) {
				res.status(400).send('User already exists')
			} else {
				const doc = {
					_type: 'user',
					email,
					name: `${first_name} ${last_name}`,
					image: 'https://via.placeholder.com/150'
				}

				const basicAccount = await client.create(doc)

				const user = await client
					.patch(basicAccount._id)
					.setIfMissing({ missions: [] })
					.insert('after', 'missions[0]', [
						{
							_type: 'mission',
							_ref: courses[0]._id,
							_key: nanoid()
						}
					])
					.commit({ autoGenerateArrayKeys: true })

				res.status(200).send(user)
			}
		}
	} catch (error) {
		res.status(500)
		res.json({ message: error.message })
	}
}

// const doc = {
// 	_type: 'bike',
// 	name: 'Sanity Tandem Extraordinaire',
// 	seats: 2
// }

// client.create(doc).then((res) => {
// 	console.log(`Bike was created, document ID is ${res._id}`)
// })

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
