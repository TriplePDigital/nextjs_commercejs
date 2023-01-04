import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaEnvelope } from 'react-icons/fa'
import Button from '@/components/util/Button'
import { injectCollectJS } from '@/util/createCollect'
import getter from '@/util/getter'
import useSWR from 'swr'
import { Certificate } from '@/types/schema/certificate'
import { SWRResponse } from '@/types/index'
import Anchor from '@/components/util/Anchor'
import { userContextObject } from './_app'
import { Membership } from '@/types/schema/membership'
import { Mission } from '@/types/schema/mission'

const CheckoutPage: React.FC = () => {
	const router = useRouter()
	const { user: account } = useContext(userContextObject)
	const [user, setUser] = React.useState({
		firstName: '',
		lastName: '',
		email: ''
	})

	const { type, price, sku, discount }: { type?: string; price?: string; sku?: string; discount?: number } = router.query

	const { data: certificate, error: certificateError } = useSWR<SWRResponse<Certificate>>(`*[_type=="certification" && sku=="${sku}"]{...,missions[]->{...}}[0]`, getter)

	const { data: membership, error: membershipError } = useSWR<SWRResponse<Membership>>(`*[_type=="membership" && sku=="${sku}"]{...}[0]`, getter)

	useEffect(() => {
		injectCollectJS(price, `/api/purchase/${type}`)
	}, [type, price, sku])

	if (!certificate && type === 'certification') return <div>Loading...</div>

	if (!membership && type === 'membership') return <div>Loading...</div>

	if (certificateError || membershipError) console.error(certificateError || membershipError)

	return (
		<div className="w-full h-full flex items-center justify-center">
			<form
				className="flex flex-col w-full mt-10"
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
						value={price}
					/>
					<input
						type={'hidden'}
						name={'sku'}
						value={sku}
					/>
					<span className="text-sm text-center">Purchases of online or downloadable products/services are final and non-refundable. You recognize and agree all sales are final with no warranties once a course is accessed.</span>
					<Button
						id="payButton"
						type="button"
					>
						Purchase
					</Button>
				</div>
			</form>
			{type === 'certification' && (
				<CheckoutDetails
					link={certificate.result.slug.current}
					price={price}
					productType={type}
					name={certificate.result.title}
					description={certificate.result.description}
					extras={certificate.result.missions}
				/>
			)}
			{type === 'membership' && (
				<CheckoutDetails
					link={''}
					price={price}
					productType={type}
					name={membership.result.name}
					description={membership.result.description}
					extras={membership.result.benefits}
				/>
			)}
		</div>
	)
}
export default CheckoutPage

type CheckoutDetailsProps = {
	link: string
	price: number | string
	productType: string
	name: string
	description: string
	extras: string[] | Mission[]
}

const CheckoutDetails: React.FC<CheckoutDetailsProps> = ({ name, link, description, extras, productType, price }) => {
	return (
		<div className="w-full flex flex-col">
			<h2 className="text-xl mb-3">Order details:</h2>
			<Anchor
				href={`/certificates/${link}`}
				variant="link"
			>
				<p className="font-medium">
					{name} | <span className="capitalize opacity-60">{productType}</span>
				</p>
			</Anchor>
			<p className="text-sm mb-3">{description}</p>
			<h3 className="font-medium">Included {productType === 'certification' ? 'courses' : 'benefits'}:</h3>
			<ul className="list-disc ml-6">
				{extras.map((mission, missionIndex) => {
					return (
						<li
							className="text-sm"
							key={missionIndex}
						>
							{typeof mission === 'string' ? mission : mission.title}
						</li>
					)
				})}
			</ul>
			<h3 className="text-xl font-medium border-t border-gray-500 mt-3 border-opacity-25">
				Total: ${price}
				<span className="opacity-60 text-sm">{productType === 'membership' && '/month'}</span>
			</h3>
		</div>
	)
}
