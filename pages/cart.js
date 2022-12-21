import React, { useContext, useEffect, useState } from 'react'
import { cartContextObject } from './_app'
import { BiCart } from 'react-icons/bi'
import useSWR from 'swr'
import { notify } from '@/util/notification'
import getter from '@/util/getter'
import { FaTrash } from 'react-icons/fa'
import { Loader } from '@/components/util'
import checkout from '@/util/checkout'
import Link from 'next/link'

const Cart = () => {
	const ctx = useContext(cartContextObject)
	const { data, error } = useSWR(`*[_type == "mission"]`, getter)
	const [courses, setCourses] = useState([])
	const [checked, setChecked] = useState(false)

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
		return <Loader />
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
				sku: course.sku
			})
		})
		return items
	}
	return (
		<section className="w-2/3 mx-auto my-10">
			{courses.length > 0 ? (
				courses.map((item, index) => (
					<div
						key={index}
						className="border-b px-4 py-4 flex justify-between items-center"
					>
						<div className="w-3/5 flex flex-col">
							<Link
								passHref={true}
								href={`/mission/${item.slug.current}`}
							>
								<a className="hover:underline cursor-pointer">{item.title}</a>
							</Link>
							<span className="text-gray-400 text-sm">SKU: {item.sku || '000'}</span>
						</div>
						<span className="w-1/5 flex gap-2">
							<span className="text-gray-400 text-sm">Qty: </span>
							<span>{item.quantity}</span>
						</span>
						<span className="w-1/5 flex justify-end items-center">
							<button
								onClick={() => ctx.removeProductFromCart(item._id)}
								title="Remove from cart"
								className="hover:bg-slate-400 p-3 transition-all rounded"
							>
								<FaTrash
									size={20}
									className="text-red-500 ml-auto mr-0"
								/>
							</button>
						</span>
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
			<div className="px-4 py-4 flex justify-between items-center">
				<label
					htmlFor="policy_agree"
					className="w-1/2 flex items-center gap-2 flex-row-reverse"
				>
					<span className="text-sm">Purchases of online or downloadable products/services are final and non-refundable. By checking this box, you recognize and agree all sales are final with no warranties once a course is accessed.</span>
					<input
						type="checkbox"
						name="policy"
						id="policy_agree"
						defaultValue={checked ? 'true' : 'false'}
						onChange={() => setChecked(!checked)}
					/>
				</label>
				<button
					className={`bg-blue-500 text-white px-4 py-2 rounded-md ${courses.length === 0 || !checked ? 'opacity-50 cursor-not-allowed' : ''}`}
					onClick={() => checkout(convertCourseOjbectToCheckoutItem(courses))}
					disabled={courses.length === 0 || !checked}
				>
					Checkout
				</button>
			</div>
		</section>
	)
}

export default Cart
