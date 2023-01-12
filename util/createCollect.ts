import { notify } from '@/util/notification'
import axios from 'axios'
import { client } from '@/util/config'

export interface Account {
	firstName: string
	lastName: string
	email: string
	id?: string
}

export interface Product {
	price: number
	sku: string
	discountUsed?: boolean
}

export const finishSubmit = (token: string, user: Account, product: Product, endpoint: string) => {
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
			notify('success', 'Order successfully placed!', '1')
			if (product.discountUsed) {
				client
					.patch(user.id)
					.dec({ discountUsage: 1 })
					.commit()
					.then((res) => console.log(res))
			}
			return res.data.payload.transactionID
		})
		.catch((err) => {
			notify('error', err?.message, 'There was an error processing your order')
			return null
		})
}

export default function injectCollect(collectJsUrl, tokenizationKey) {
	try {
		// @ts-ignore
		const script = document.createElement('script')

		script.setAttribute('src', collectJsUrl)
		script.setAttribute('data-tokenization-key', tokenizationKey)
		script.setAttribute('data-variant', 'inline')

		// @ts-ignore
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
