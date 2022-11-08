import React, { useContext, useEffect, useState } from 'react'
import { cartContextObject } from './_app'
import { BiCart } from 'react-icons/bi'
import useSWR from 'swr'
import { notify } from '@/util/notification'
import getter from '@/util/getter'
import { FaTrash } from 'react-icons/fa'
import { Loader } from '@/components/util'
import Script from 'next/script'
import checkout from "@/util/checkout";

const Cart = () => {
	const ctx = useContext(cartContextObject)
	const { data, error } = useSWR(`*[_type == "mission"]`, getter)
	const [courses, setCourses] = useState([])

	const getCourseDataFromCart = () => {
		let filtered = []
		ctx.cart.forEach((item) => {
			let course = data.result.find((course) => {
				if (course._id === item.item) {
					return course
				}
			})
			course['quantity'] = item.quantity
			filtered.push(course)
		})
		setCourses(filtered)
	}

	useEffect(() => {
		if (data) getCourseDataFromCart()
	}, [data, ctx.cart])

	if (!data) {
		return <Loader/>
	}
	if (error) {
		notify('error', 'Error', 'There was an error loading your cart')
		return <div></div>
	}
	const convertCourseOjbectToCheckoutItem = (courses) => {
		let items = []
		courses.forEach((course) => {
			items.push({
				quantity: course.quantity,
				sku: course.sku,
			})
		})
		return items
	}
	return (
		<section className="w-2/3 mx-auto my-10">
			<Script
				src="https://secure.nmi.com/token/CollectCheckout.js"
				data-checkout-key="checkout_public_Du2E7M5C7spt3N8Vs9Su2tuFs9UgM25W"
			/>
			{courses.length > 0 ? (
				courses.map((item, index) => (
					<div
						key={index}
						className="border-b px-4 py-4 flex justify-between items-center"
					>
						<div className="w-3/5 flex flex-col">
							<span className="">{item.title}</span>
							<span className="text-gray-400 text-sm">SKU: {item.sku || '000'}</span>
						</div>
						<span className="w-1/5 text-right">{item.quantity}</span>
						<button
							className="w-1/5"
							onClick={() => ctx.removeProductFromCart(item._id)}
							title="Remove from cart"
						>
							<FaTrash
								size={20}
								className="text-red-500 ml-auto mr-0"
							/>
						</button>
					</div>
				))
			) : (
				<div className="border-b px-4 py-4 text-center flex flex-col items-center justify-center">
					<BiCart
						size={75}
						className="opacity-25"
					/>
					<p>Your cart is empty</p>
				</div>
			)}
			<div className="border-b px-4 py-4 w-full">
				<span className="text-gray-400 text-right text-sm w-full inline-block">The total price for your order will be shown after you click checkout</span>
			</div>
			<div className="px-4 py-4 flex justify-end items-center">
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded-md"
					onClick={() => checkout(convertCourseOjbectToCheckoutItem(courses))}
				>
					Checkout
				</button>
			</div>
		</section>
	)
}

export default Cart
