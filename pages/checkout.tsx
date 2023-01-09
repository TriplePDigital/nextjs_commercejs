import React from 'react'
import { useRouter } from 'next/router'
import { FaEnvelope } from 'react-icons/fa'
import Button from '@/components/util/Button'
import { collectConfig } from '@/util/createCollect'
import getter from '@/util/getter'
import useSWR from 'swr'
import { Certification, Membership, Mission, SanityKeyedReference, User } from '@/types/schema'
import { SWRResponse } from '@/types/index'
import Anchor from '@/components/util/Anchor'
import useCollect from '../hooks/useCollect'
import CardNumInput from '@/components/Collect/CardNumber'
import CardExpInput from '@/components/Collect/CardExp'
import CardCVVInput from '@/components/Collect/CardCVV'
import { notify } from '@/util/notification'
import { useNextSanityImage } from 'next-sanity-image'
import { client } from '@/util/config'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'

type DiscountFieldProps = {
	user?: { firstName: string; lastName: string; email: string }
	discount?: number
	price: number
	handle: React.Dispatch<React.SetStateAction<{ firstName: string; lastName: string; email: string }>>
	setDiscount: React.Dispatch<React.SetStateAction<number>>
	setFinalPrice: React.Dispatch<React.SetStateAction<number>>
}

const DiscountField: React.FC<DiscountFieldProps> = ({ handle, setDiscount, setFinalPrice, price }) => {
	const [membershipID, setMembershipID] = React.useState('7954349408')
	const [search, setSearch] = React.useState(false)

	const { data, error } = useSWR<SWRResponse<Omit<User, 'membershipType'> & { membershipType: Membership }>>(!search ? null : `*[_type == 'user' && membershipID == '${membershipID}']{...,membershipType->}[0]`, getter)

	// if (!data && apply) return <Loader />

	if (error) console.error(error)

	const imageProps = useNextSanityImage(client, data?.result.avatar.asset)

	return (
		<div className="w-3/4">
			<label
				htmlFor="discount"
				className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
			>
				Membership Number
			</label>
			<div className="flex gap-1">
				<input
					type="text"
					id="membershipID"
					name="membershipID"
					className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ncrma-500 focus:border-ncrma-500 block w-full pl-2.5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ncrma-500 dark:focus:border-ncrma-500"
					placeholder="012345678"
					onChange={(event) => setMembershipID(event.target.value)}
					defaultValue={membershipID}
					maxLength={10}
					minLength={10}
				/>
				<Button
					onClick={() => setSearch(true)}
					type="button"
				>
					Search
				</Button>
			</div>
			{data?.result && (
				<div className="mt-2 rounded bg-gray-100 px-2 py-2">
					<div className="flex items-center justify-between">
						<div className="flex gap-3 items-center w-full">
							{data.result.avatar ? (
								<div className="rounded-full h-24 w-24 aspect-square relative overflow-hidden shadow border border-gray-100">
									<Image
										src={imageProps.src}
										loader={imageProps.loader}
										blurDataURL={imageProps.blurDataURL}
										layout="fill"
										objectFit="cover"
										objectPosition="center"
										quality={50}
										placeholder="blur"
										alt="user profile image in a round shape"
									/>
								</div>
							) : null}

							<div className="flex flex-col w-2/4">
								<h3 className="font-bold">
									{data.result.firstName} {data.result.lastName}
								</h3>
								<span className="opacity-50 text-sm">{data.result.email}</span>
								<span className="border-t mt-2 font-semibold">{data.result.membershipType.name}</span>
							</div>
						</div>
						<div className="">
							<label
								htmlFor="apply"
								className="sr-only"
							>
								Select to apply discount
							</label>
							<input
								className="bg-ncrma-500 rounded h-5 w-5 text-ncrma-500 focus:ring-ncrma-500 border-ncrma-500"
								type="checkbox"
								name="apply"
								id="apply"
								onClick={() => {
									handle(() => {
										return {
											firstName: data.result.firstName,
											lastName: data.result.lastName,
											email: data.result.email
										}
									})
									//set discount if user has more than 0 left on account
									if (data.result.discountUsage > 0) {
										console.log(data.result.membershipType.discount, typeof data.result.membershipType.discount)
										setDiscount(data.result.membershipType.discount)
										setFinalPrice(price - price * (data.result.membershipType.discount / 100))
									} else {
										notify('warning', 'No discount left on account', '1')
									}
								}}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

const CheckoutPage: React.FC = () => {
	const router = useRouter()
	const [user, setUser] = React.useState({
		firstName: '',
		lastName: '',
		email: ''
	})
	const [proceed, setProceed] = React.useState(false)
	const [discount, setDiscount] = React.useState(0)
	const [finalPrice, setFinalPrice] = React.useState(0)

	const { type, sku }: { type?: string; price?: string; sku?: string; discount?: number } = router.query

	const { data: certificate, error: certificateError } = useSWR<SWRResponse<Certification>>(`*[_type=="certification" && sku=="${sku}"]{...,missions[]->{...}}[0]`, getter)

	const { data: membership, error: membershipError } = useSWR<SWRResponse<Membership>>(`*[_type=="membership" && sku=="${sku}"]{...}[0]`, getter)

	const [collect, response, reset] = useCollect({
		config: collectConfig,
		customer: user,
		product: {
			sku: sku,
			price: finalPrice
		},
		endpoint: `/api/purchase/${type}`
	})

	// useEffect(() => {
	// 	injectCollectJS(price, `/api/purchase/${type}`)
	// }, [type, price, sku])

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
					<DiscountField
						user={user}
						handle={setUser}
						discount={discount}
						setDiscount={setDiscount}
						setFinalPrice={setFinalPrice}
						price={type === 'certification' ? certificate.result.price : membership.result.price}
					/>

					<div className="w-3/4 flex gap-3 items-center">
						<span className="border-b w-full h-1 block" />
						<p className="font-bold">OR</p>
						<span className="border-b w-full" />
					</div>
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
					<Button
						onClick={(e) => {
							e.preventDefault()
							if (user.email && user.firstName && user.lastName) {
								collect.configure()
								setProceed(true)
							} else {
								notify('error', 'Please fill out all fields', '1')
							}
						}}
						type="button"
					>
						Proceed
					</Button>
					{proceed && (
						<>
							<div className="w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ncrma-500 focus:border-ncrma-500 block w-full pl-2.5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ncrma-500 dark:focus:border-ncrma-500">
								<label
									htmlFor="ccnumber"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
								>
									Credit Card Number
									<CardNumInput />
								</label>
							</div>
							<div className="w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ncrma-500 focus:border-ncrma-500 block w-full pl-2.5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ncrma-500 dark:focus:border-ncrma-500">
								<label
									htmlFor="ccexp"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
								>
									Credit Card Expiration
								</label>
								<CardExpInput />
							</div>
							<div className="w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ncrma-500 focus:border-ncrma-500 block w-full pl-2.5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ncrma-500 dark:focus:border-ncrma-500">
								<label
									htmlFor="cvv"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
								>
									CVV
								</label>
								<CardCVVInput />
							</div>
							{/*TODO: Fix this issue with price being dynamic*/}
							<input
								type={'hidden'}
								name={'price'}
								value={0}
							/>
							<input
								type={'hidden'}
								name={'sku'}
								value={sku}
							/>
							<span className="text-sm text-center">Purchases of online or downloadable products/services are final and non-refundable. You recognize and agree all sales are final with no warranties once a course is accessed.</span>
						</>
					)}
					<Button
						disabled={!proceed}
						id="payButton"
						type="button"
						className={`${!proceed ? 'invisible' : 'visible'}`}
					>
						Purchase
					</Button>
				</div>
			</form>
			{type === 'certification' && (
				<CheckoutDetails
					link={`/certificates/${certificate.result.slug.current}`}
					price={certificate.result.price}
					productType={type}
					name={certificate.result.title}
					description={certificate.result.description}
					extras={certificate.result.missions}
					discount={discount}
				/>
			)}
			{type === 'membership' && (
				<CheckoutDetails
					//TODO: fix this link being passed as a prop
					link={''}
					price={membership.result.price}
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
	price: number
	productType: string
	name: string
	description: string
	extras: Array<Mission> | Array<string> | Array<SanityKeyedReference<Mission>>
	discount?: number
}

const CheckoutDetails: React.FC<CheckoutDetailsProps> = ({ name, link, description, extras, productType, price, discount }) => {
	return (
		<div className="w-full flex flex-col h-full">
			<h2 className="text-xl mb-3">Order details:</h2>
			<Anchor
				href={link}
				variant="link"
			>
				<p className="font-medium">
					{name} | <span className="capitalize opacity-60">{productType}</span>
				</p>
			</Anchor>
			<p className="text-sm mb-3">
				<ReactMarkdown>{description}</ReactMarkdown>
			</p>
			<h3 className="font-medium">Included {productType === 'certification' ? 'courses' : 'benefits'}:</h3>
			<ul className="list-disc ml-6">
				{extras.map((mission: string | Mission | SanityKeyedReference<Mission>, missionIndex) => {
					return (
						<li
							className="text-sm"
							key={missionIndex}
						>
							{typeof mission === 'string' && mission}
							{typeof mission === 'object' && 'title' in mission && mission.title}
						</li>
					)
				})}
			</ul>
			<span className="border-t border-gray-500 mt-3 border-opacity-25" />
			{discount ? <h3 className="opacity-50">Discount: -${Number((discount / 100) * price).toFixed(2)}</h3> : null}
			<h3 className="text-xl font-medium">
				Total: ${discount ? Number((1 - discount / 100) * price).toFixed(2) : Number(price).toFixed(2)}
				<span className="opacity-60 text-sm">{productType === 'membership' && '/month'}</span>
			</h3>
		</div>
	)
}
