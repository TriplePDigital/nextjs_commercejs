/* eslint-disable no-undef */
import React, {useEffect, useState} from 'react'
import Image from 'next/image'
import axios from 'axios'
import collect from '@/util/collect'
import {client} from '@/util/config'
import {FaEnvelope} from 'react-icons/fa'
import {nanoid} from 'nanoid'
import {notify} from '@/util/notification'
import {Loader} from '@/components/util'
import {useRouter} from 'next/router'

function Mjbiz2022({products}) {
	const [user, setUser] = useState({
		firstName: '',
		lastName: '',
		email: '',
		payment_token: ''
	})
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.CollectJS.configure({
				variant: 'inline',
				paymentType: 'cc',
				price: '995.00',
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
					const form = document.getElementsByTagName('form')[0].elements
					finishSubmit(response.token, {
						firstName: form['first_name'].value,
						lastName: form['last_name'].value,
						email: form['email'].value
					})
				}
			})
		}
	}, [])

	const finishSubmit = (token, account) => {
		const {firstName, lastName, email} = account
		axios
			.post(
				'/api/promo/purchase',
				{},
				{
					params: {
						first_name: firstName,
						last_name: lastName,
						email,
						payment_token: token
					}
				}
			)
			.then((res) => {
				console.log(res)
				setLoading(false)
				notify('success', 'Order successfully placed!')
				// router.push(`/success?transid=${res.data.payload.transactionID}`).then(() => notify('success', 'Order created'))
			})
			.catch((err) => {
				setLoading(false)
				notify('error', err?.message, 'There was an error processing your order')
			})
	}

	function signup(event) {
		event.preventDefault()
		setLoading(true)
		const {firstName, lastName, email} = user
		const userDoc = {
			_key: nanoid(16),
			_type: 'person',
			firstName,
			lastName,
			email
		}
		client
			.patch('ea7cda0e-0259-4515-8949-2a3e339f5a9c')
			.setIfMissing({ list: [] })
			.append('list', [userDoc])
			.commit()
			.then(() => {
				setUser({
					firstName: '',
					lastName: '',
					email: ''
				})
				setLoading(false)
				notify('success', 'Thank you for signing up!')
			})
			.catch((err) => {
				setLoading(false)
				notify('error', 'Error', err.message)
			})
	}

	return (
		<div>
			<div className="w-full h-96 relative">
				<Image
					src="https://ncrma.net/wp-content/uploads/2022/09/MJBizCon-Logo.png"
					layout="fill"
					objectFit="contain"
					className="z-20"
					alt="MJBizCon 2022 Logo"
				/>
				<Image
					src="https://ncrma.net/wp-content/uploads/2022/09/MJBizCon-BG.jpeg"
					alt="MJBizCon 2022 background image"
					layout={'fill'}
					objectFit={'cover'}
					objectPosition={'center'}
				/>
				<div className="bg-ncrma-700 opacity-90 absolute top-0 left-0 w-full h-full"></div>
			</div>
			<section className="mx-auto w-2/3 my-10 flex flex-col text-justify">
				<h1 className="text-4xl text-center font-semibold mb-3">Professional Cannabis Risk Manager Certification</h1>
				<p>
					NCRM Academy offers the Professional Cannabis Risk Manager Certification online. Covering a range of subjects such as occupational safety & health, compliance, medical cannabis, and talent optimization, our certification prepares students
					for the many risk of cannabis operations. Instructed by subject matter experts that are recognized and respected in their particular fields and the cannabis industry. If you are a cannabis professional, or an aspiring professional,
					navigating your way into or through the industry adding this designation can significantly boost your career prospects. Becoming a Professional Cannabis Risk Manager - commonly known as a <strong>PCRM</strong> - is a worthwhile goal as you
					plan your career. Weather you are an experienced cannabis operator, compliance professional, safety professional, insurance broker, or if you are just beginning your career being a <strong>PCRM</strong> will make you stand out, in a crowded
					industry, and show your breadth and depth of knowledge in managing the numerous risks found in cannabis operations. Separate yourself from the crowd and show your current or future employer you are dedicated to keeping cannabis businesses
					safe and successful.
				</p>
				<h2 className="text-xl font-bold text-center my-3">NCRM Academy Courses Tracks Include</h2>
				<ul>
					<li>
						<h3 className="font-semibold text-lg">Cannabis Occupational Safety & Health (COSH)</h3>
						<p>
							These courses are designed to keeper cannabis workers and workplaces safe. Learn how to identify the major hazards in the industry and how to develop a world class safety program. Do what is needed to keep this industry’s most valuable
							assets its workers safe.
						</p>
					</li>
					<li>
						<h3 className="font-semibold text-lg">Cannabis Product Safety</h3>
						<p>
							The product safety course are developed to inform operators how to produce and sell safe product to patients and consumers. These courses have the most advanced information and standards to manage the complex problems of cannabis
							pathology and contamination.
						</p>
					</li>
					<li>
						<h3 className="font-semibold text-lg">Cannabis Talent Optimization</h3>
						<p>
							These courses address some of the cannabis industry’s major issues, including employee turnover and how to use talent optimization to solve them. Disgruntled and ineffective employees can be a major hazard to operations, in these course
							you will find out how to avoid common pitfalls
						</p>
					</li>
					<li>
						<h3 className="font-semibold text-lg">Cannabis Compliance</h3>
						<p>
							Compliance is necessary to any business and cannabis is no different. These courses are designed to give you an understanding of the required components of cannabis business’s compliance program, so you do not face unforeseen violations
							and your facility’s license can remain untarnished.{' '}
						</p>
					</li>
					<li>
						<h3 className="font-semibold text-lg">Medical Cannabis</h3>
						<p>
							These courses are designed to inform medical professional of the benefits of cannabis. Learn the history of the plant and how it’s been used by many different people for different purposes. Get a basic understanding of the
							endocannabinoid system and how this plant and cure diseases and improve people’s quality of life. Anyone selling cannabis products should know the many benefits these products bring.
						</p>
					</li>
					<li>
						<h3 className="font-semibold text-lg">Cannabis Risk Management</h3>
						<p>Get an introduction to risk management, insurance, and other basic functions of cannabis operations, security, and governance. This track helps round out any cannabis professional’s understanding of the industry. </p>
					</li>
				</ul>
			</section>
			<div className="md:w-1/2 w-full my-10 flex gap-0 mx-auto items-center justify-center">
				<form className="flex flex-col">
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
									onChange={(event) => setUser({...user, email: event.target.value})}
									value={user.email}
								/>
							</div>
						</div>
						<div
							className="w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ncrma-500 focus:border-ncrma-500 block w-full pl-2.5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ncrma-500 dark:focus:border-ncrma-500">
							<label
								htmlFor="ccnumber"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
							>
								Credit Card Number
							</label>
							<div id="ccnumber"></div>
						</div>
						<div
							className="w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ncrma-500 focus:border-ncrma-500 block w-full pl-2.5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ncrma-500 dark:focus:border-ncrma-500">
							<label
								htmlFor="ccexp"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
							>
								Credit Card Expiration
							</label>
							<div id="ccexp"></div>
						</div>
						<div
							className="w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ncrma-500 focus:border-ncrma-500 block w-full pl-2.5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-ncrma-500 dark:focus:border-ncrma-500">
							<label
								htmlFor="cvv"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
							>
								CVV
							</label>
							<div id="cvv"></div>
						</div>
						<button
							className="w-1/4 block bg-transparent border-2 border-ncrma-400 hover:bg-ncrma-400 text-back hover:text-white font-medium rounded px-2 py-1 text-sm"
							id="payButton"
						>
							{loading ? (
								<span className="relative max-h-14 flex items-center justify-center black">
									<Loader size={16}/>
								</span>
							) : (
								'Purchase PCRM Bundle'
							)}
						</button>
					</div>
					<p
						id="marketing-email-explanation"
						className="mt-2 text-sm text-gray-500 dark:text-gray-400 md:px-0 px-5"
					>
						Sign up for more information about our Professional Cannabis Risk Manager course bundle and other National Cannabis Risk Management Academy courses. To find more information about the PCRM curriculum, please visit our{' '}
						<a
							href="https://ncrma.net/ncrmacademy/"
							target="_blank"
							className="font-medium text-ncrma-800 hover:underline dark:text-ncrma-600"
							rel="noreferrer"
						>
							website
						</a>
						.
					</p>
				</form>
				{/*<label htmlFor="marketing-email-list">*/}
				{/*	Email Address*/}
				{/*	<input*/}
				{/*		id="marketing-email-list"*/}
				{/*		type="email"*/}
				{/*		defaultValue={user.email}*/}
				{/*		onChange={(event) => setUser({ ...user, email: event.target.value })}*/}
				{/*		placeholder="Sign up for more information"*/}
				{/*	/>*/}
				{/*</label>*/}
				{/*<button*/}
				{/*	className="block bg-transparent border-2 border-ncrma-400 hover:bg-ncrma-400 text-back hover:text-white uppercase font-medium rounded px-4 py-3"*/}
				{/*	onClick={(event) => signup(event)}*/}
				{/*>*/}
				{/*	Purchase PCRM Bundle*/}
				{/*</button>*/}
			</div>
			<div className="relative md:w-1/4 w-3/4 h-32 mx-auto">
				<Image
					src="https://ncrma.net/wp-content/uploads/2020/11/NCRMA-LOGO-10-2020-1-1.png"
					alt="NCRM Academy Logo"
					layout={'fill'}
					objectFit={'contain'}
				/>
			</div>
		</div>
	)
}

// export async function getStaticProps() {
// 	const products = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/promo/getAllCourses`)
// 	return {
// 		props: {
// 			products: products.data
// 		}
// 	}
// }

export default Mjbiz2022
