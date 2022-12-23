import { FaCheck, FaEnvelope } from 'react-icons/fa'
import React, { useState } from 'react'
import { GrClose } from 'react-icons/gr'
import { Loader } from '@/components/util'
import { injectCollectJS } from '../../pages/memberships'

const PriceCard = ({ title, description, price, benefits, sku, selected, handleSelect, setShowOverlay }) => {
	const [showPurchaseModal, setShowPurchaseModal] = useState(false)
	const [loading, setLoading] = useState(false)
	const [user, setUser] = useState({
		email: '',
		firstName: '',
		lastName: ''
	})

	return (
		<div className="flex flex-col h-fit p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
			<h3 className="mb-4 text-2xl font-semibold">{title}</h3>
			<p className="font-light text-gray-500 italic sm:text-base dark:text-gray-400">{description}</p>
			<div className="flex justify-center items-baseline my-8">
				<span className="mr-2 text-5xl font-extrabold relative">
					<span className="text-sm font-medium absolute top-0 left-0">$</span>
					<span className="ml-3">{price}</span>
				</span>
				<span className="text-gray-500 dark:text-gray-400">/ month</span>
			</div>
			<ul
				role="list"
				className="mb-8 space-y-4 text-left"
			>
				{benefits.map((item, itemIndex) => {
					return (
						<li
							className="flex items-center space-x-3"
							key={itemIndex}
						>
							<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
							<span>{item}</span>
						</li>
					)
				})}
			</ul>
			<a
				className="text-white bg-ncrma-600 hover:bg-ncrma-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
				onClick={() => {
					setShowPurchaseModal(true)
					handleSelect({
						title,
						sku,
						price
					})
					injectCollectJS(price)
					setShowOverlay(true)
				}}
			>
				Get started
			</a>
			<div
				id="defaultModal"
				tabIndex={showPurchaseModal ? 0 : -1}
				aria-hidden={showPurchaseModal ? 'false' : 'true'}
				className={`fixed ${showPurchaseModal ? 'visible z-50' : '-z-10 invisible'} w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full`}
			>
				<div className="relative w-1/2 mx-auto h-full max-w-2xl md:h-auto">
					<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
						<div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white">Purchase {selected.title} membership</h3>
							<button
								type="button"
								className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
								data-modal-toggle="defaultModal"
								onClick={() => {
									setShowPurchaseModal(false)
									handleSelect({
										title: '',
										sku: '',
										price: ''
									})
									setShowOverlay(false)
								}}
							>
								<GrClose className="w-4 h-4" />
								<span className="sr-only">Close modal</span>
							</button>
						</div>
						<div className="p-6 space-y-6">
							<form
								className="flex flex-col w-full"
								id="form"
							>
								<div className="flex flex-col items-center gap-2 justify-center w-full">
									<div className="w-3/4">
										<label
											htmlFor="firstName"
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
										>
											First Name
										</label>
										<input
											type="text"
											id="firstName"
											name="first_name"
											className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ncrma-500 focus:border-ncrma-500 block w-full pl-2.5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ncrma-500 dark:focus:border-ncrma-500"
											placeholder="John"
											onChange={(event) => setUser({ ...user, firstName: event.target.value })}
											value={user.firstName}
											required={true}
										/>
									</div>
									<div className="w-3/4">
										<label
											htmlFor="lastName"
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
										>
											Last Name
										</label>
										<input
											type="text"
											id="lastName"
											name="last_name"
											className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ncrma-500 focus:border-ncrma-500 block w-full pl-2.5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ncrma-500 dark:focus:border-ncrma-500"
											placeholder="Doe"
											onChange={(event) => setUser({ ...user, lastName: event.target.value })}
											value={user.lastName}
											required={true}
										/>
									</div>
									<div className="w-3/4">
										<label
											htmlFor="input-group-1"
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
										>
											Your Email
										</label>
										<div className="relative">
											<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
												<FaEnvelope className="w-5 h-5 text-gray-400 dark:text-gray-400" />
											</div>
											<input
												type="email"
												id="input-group-1"
												name="email"
												className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ncrma-500 focus:border-ncrma-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ncrma-500 dark:focus:border-ncrma-500"
												placeholder="name@ncrma.com"
												required={true}
												aria-describedby="marketing-email-explanation"
												onChange={(event) => setUser({ ...user, email: event.target.value })}
												value={user.email}
											/>
										</div>
									</div>
									<div className="w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ncrma-500 focus:border-ncrma-500 block w-full pl-2.5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ncrma-500 dark:focus:border-ncrma-500">
										<label
											htmlFor="ccnumber"
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
										>
											Credit Card Number
										</label>
										<div id="ccnumber"></div>
									</div>
									<div className="w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ncrma-500 focus:border-ncrma-500 block w-full pl-2.5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ncrma-500 dark:focus:border-ncrma-500">
										<label
											htmlFor="ccexp"
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
										>
											Credit Card Expiration
										</label>
										<div id="ccexp"></div>
									</div>
									<div className="w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ncrma-500 focus:border-ncrma-500 block w-full pl-2.5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ncrma-500 dark:focus:border-ncrma-500">
										<label
											htmlFor="cvv"
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
										>
											CVV
										</label>
										<div id="cvv"></div>
									</div>
									<input
										type={'hidden'}
										name={'price'}
										value={selected.price}
									/>
									<input
										type={'hidden'}
										name={'sku'}
										value={selected.sku}
									/>
									<span className="text-sm text-center">Purchases of online or downloadable products/services are final and non-refundable. You recognize and agree all sales are final with no warranties once a course is accessed.</span>
								</div>
							</form>
						</div>
						<div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
							<button
								className="w-1/2 mx-auto block bg-transparent border-2 border-ncrma-400 hover:bg-ncrma-400 text-back hover:text-white font-medium rounded px-2 py-3 text-base"
								id="payButton"
								onClick={() => setLoading(true)}
							>
								{loading ? <Loader /> : 'Purchase Membership'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PriceCard
