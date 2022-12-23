import React, { useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import getter from '@/util/getter'
import groq from 'groq'
import { Loader } from '@/components/util'
import PriceCard from '@/components/Membership/PriceCard'
import axios from 'axios'
import { notify } from '@/util/notification'

const finishSubmit = (token, user, product) => {
	const { firstName, lastName, email } = user
	return axios
		.post('/api/purchase/membership', {
			first_name: firstName,
			last_name: lastName,
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

const MembershipPage = () => {
	const [product, setProduct] = useState({
		price: '0',
		sku: '',
		title: ''
	})
	const [showOverlay, setShowOverlay] = useState(false)

	const membershipQuery = groq`
		*[_type == "membership"]
	`
	const { data, error } = useSWR(membershipQuery, getter)

	if (!data) return <Loader />
	if (error) console.error(error)

	return (
		<section className="bg-white dark:bg-gray-900">
			{showOverlay && <div className="z-20 absolute opacity-75 bg-black w-[calc(100%_-_5rem)] h-screen"></div>}
			<div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
				<div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12 relative">
					<h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">NCRM Academy Memberships</h2>
					<div className="relative h-32">
						<Image
							src="https://ncrma.net/wp-content/uploads/2020/11/INDIVIDUAL-MEMBERSHIPS-TRANSPARENT-1-1.png"
							layout="fill"
							alt="Membership promo banner image."
						/>
					</div>
				</div>
				<div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
					{data.result
						.sort((a, b) => a.price - b.price)
						.map((doc, docIndex) => {
							return (
								<PriceCard
									key={docIndex}
									price={doc.price}
									description={doc.description}
									benefits={doc.benefits}
									sku={doc.sku}
									title={doc.name}
									handleSelect={setProduct}
									selected={product}
									setShowOverlay={setShowOverlay}
								/>
							)
						})}
				</div>
			</div>
		</section>
	)
}

export const injectCollectJS = (price) => {
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
				{ price: form['price'].value, sku: form['sku'].value }
			)
			Promise.resolve(res).then((res) => {
				if (res) {
					window.location.href = `/success?transid=${res}`
				}
			})
		}
	})
}

export default MembershipPage
