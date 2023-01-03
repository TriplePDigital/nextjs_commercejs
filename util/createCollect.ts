import { notify } from '@/util/notification'
import axios from 'axios'

interface User {
	firstName: string
	lastName: string
	email: string
}

interface Product {
	price: number
	sku: string
}

const finishSubmit = (token: string, user: User, product: Product, endpoint: string) => {
	const { firstName, lastName, email } = user
	return axios
		.post(`${endpoint}`, {
			firstName,
			lastName,
			email,
			payment_token: token,
			amount: product.price,
			sku: product.sku
		})
		.then((res) => {
			console.log(res)
			notify('success', 'Order successfully placed!')
			return res.data.payload.transactionID
		})
		.catch((err) => {
			notify('error', err?.message, 'There was an error processing your order')
			return null
		})
}

export const injectCollectJS = (price: string, endpoint: string) => {
	// @ts-ignore
	window.CollectJS.configure({
		variant: 'inline',
		paymentType: 'cc',
		price: price,
		currency: 'USD',
		country: 'US',
		styleSniffer: 'true',
		fields: {
			ccnumber: {
				selector: '#ccnumber',
				title: 'Card Number',
				placeholder: '0000 0000 0000 0000'
			},
			ccexp: {
				selector: '#ccexp',
				title: 'Card Expiration',
				placeholder: '00 / 00'
			},
			cvv: {
				display: 'show',
				selector: '#cvv',
				title: 'CVV Code',
				placeholder: '***'
			}
		},
		customCss: {
			border: '0px',
			'background-color': 'rgb(250 250 250)'
		},
		invalidCss: {
			color: 'red',
			'background-color': '#f78e83'
		},
		validCss: {
			color: 'green',
			'background-color': '#d0ffd0'
		},
		focusCss: {
			color: 'black',
			'background-color': 'rgb(220 220 220)'
		},
		placeholderCss: {
			color: 'black',
			'background-color': 'rgb(220 220 220)'
		},
		validationCallback: function (field, status, message) {
			if (status) {
				notify('success', message, field)
			} else {
				notify('warning', message, field)
			}
		},
		callback: function (response) {
			console.log(response)
			const form = document.getElementsByTagName('form')[0].elements
			const res = finishSubmit(
				response.token,
				{
					firstName: form['first_name'].value,
					lastName: form['last_name'].value,
					email: form['email'].value
				},
				{ price: form['price'].value, sku: form['sku'].value },
				endpoint
			)
			Promise.resolve(res).then((res) => {
				if (res) {
					window.location.href = `/success?transid=${res}`
				}
			})
		}
	})
}
