/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { client } from '@/util/config'
import { FaCheck, FaEnvelope } from 'react-icons/fa'
import { nanoid } from 'nanoid'
import { notify } from '@/util/notification'
import { Loader } from '@/components/util'
import { useRouter } from 'next/router'

function Intro_offer({ products }) {
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
		setLoading(true)
		const { firstName, lastName, email } = account
		axios
			.post(
				'/api/promo/purchase',
				{},
				{
					params: {
						first_name: firstName,
						last_name: lastName,
						email,
						payment_token: token,
						amount: '995.00',
						sku: '003'
					}
				}
			)
			.then((res) => {
				console.log(res)
				setLoading(false)
				notify('success', 'Order successfully placed!')
				setUser({
					firstName: '',
					lastName: '',
					email: ''
				})
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
		const { firstName, lastName, email } = user
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
			<div className="w-full h-96 relative flex items-center justify-center">
				<h2 className="text-5xl text-center font-semibold z-30 relative text-white uppercase">Professional Cannabis Risk Manager Certification</h2>
				<Image
					src="https://ncrma.net/wp-content/uploads/2022/09/MJBizCon-BG.jpeg"
					alt="MJBizCon 2022 background image"
					layout={'fill'}
					objectFit={'cover'}
					objectPosition={'center'}
					className="z-10"
				/>
				<div className="bg-ncrma-700 opacity-90 absolute top-0 left-0 w-full h-full z-20"></div>
			</div>
			<section className="mx-auto w-2/3 my-10 flex flex-col text-justify">
				<div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
					<h3 className="mb-4 text-2xl font-semibold">PCRM Bundle</h3>
					<p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
						Introductory offer until <span className="text-gray-900 dark:text-gray-400 font-medium">1/1/2023</span>
					</p>
					<div className="flex justify-center items-baseline my-8">
						<span className="mr-2 text-5xl font-extrabold">
							<span className="line-through mr-2 opacity-25 text-3xl">$1995</span>$995
						</span>
					</div>
					<ul
						role="list"
						className="mb-8 space-y-4 text-left"
					>
						<li className="flex items-center space-x-3">
							<FaCheck className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
							<span>
								Includes <span className="font-semibold">33</span> courses
							</span>
						</li>
						<li className="flex items-center space-x-3">
							<FaCheck className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
							<span>
								<span className="font-semibold">6</span> areas of focus
							</span>
						</li>
						<li className="flex items-center space-x-3">
							<FaCheck className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
							<span>PCRM Online Exam</span>
						</li>
						<li className="flex items-center space-x-3">
							<FaCheck className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
							<span>
								<span className="font-semibold">Certificate</span> of completion
							</span>
						</li>
					</ul>
					<a
						href="#form"
						className="text-white bg-ncrma-600 hover:bg-ncrma-700 focus:ring-4 focus:ring-ncrma-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-ncrma-900"
					>
						Purchase
					</a>
				</div>
				<p className="mt-5">
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
			<div className="md:w-1/2 w-full my-10 flex flex-col gap-0 mx-auto items-center justify-center">
				<p className="mt-2 text-lg text-center text-gray-800 dark:text-gray-400 md:px-0 px-5">
					Until 1/1/2023 save over 50% and pay the introductory offer of <span className="font-bold">$995</span>!
				</p>
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
						<span className="text-sm text-center">Purchases of online or downloadable products/services are final and non-refundable. You recognize and agree all sales are final with no warranties once a course is accessed.</span>
						<button
							className="w-1/4 block bg-transparent border-2 border-ncrma-400 hover:bg-ncrma-400 text-back hover:text-white font-medium rounded px-2 py-3 text-base"
							id="payButton"
						>
							{loading ? (
								<span className="relative max-h-14 flex items-center justify-center black">
									<Loader size={16} />
								</span>
							) : (
								'Purchase PCRM Bundle'
							)}
						</button>
					</div>
				</form>
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

export default Intro_offer
