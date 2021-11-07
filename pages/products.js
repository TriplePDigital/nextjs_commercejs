import { useState, useEffect } from 'react'
import { Navbar } from '../components'
import axios from 'axios'
import getStripe from '../lib/stripe'

export default function Home({ products }) {
	const buy = async (price) => {
		const {
			data: { id }
		} = await axios.post(`/api/checkout_sessions`, {
			items: [{ price: price.id, quantity: 1 }]
		})

		const stripe = await getStripe()
		await stripe.redirectToCheckout({
			sessionId: id
		})
	}

	return (
		<>
			<Navbar />
			{products.map((product, index) => (
				<div
					key={index}
					className={`mx-2 my-4 bg-gray-200 border-2 border-black px-4 py-8`}
				>
					<p>{product.product.name}</p>
					<p>{(product.unit_amount / 100).toFixed(2)}</p>
					<button onClick={() => buy(product)}>Buy</button>
				</div>
			))}
		</>
	)
}

export async function getServerSideProps(context) {
	const { data } = await axios.get('http://localhost:3000/api/list_products')

	return {
		props: {
			products: data
		}
	}
}
