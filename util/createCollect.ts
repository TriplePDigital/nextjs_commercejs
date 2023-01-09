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

export const finishSubmit = (token: string, user: User, product: Product, endpoint: string) => {
	console.log({ token, user, product, endpoint })
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
			notify('success', 'Order successfully placed!', '1')
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

export default function injectCollect(collectJsUrl, tokenizationKey) {
	try {
		const script = document.createElement('script')

		script.setAttribute('src', collectJsUrl)
		script.setAttribute('data-tokenization-key', tokenizationKey)
		script.setAttribute('data-variant', 'inline')

		document.querySelector('body').appendChild(script)

		return new Promise((resolve, reject) => {
			script.onload = function () {
				// @ts-ignore
				resolve(window.CollectJS)
			}
		})
	} catch (e) {
		console.error(e)
	}
}

export const collectConfig = {
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
	}
}
