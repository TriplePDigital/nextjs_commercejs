import React from 'react'
import { useRouter } from 'next/router'
import getter from '@/util/getter'
import useSWR from 'swr'
import ReactMarkdown from 'react-markdown'
import { injectCollectJS } from '@/util/createCollect'
import { FaEnvelope } from 'react-icons/fa'
import Button from '@/components/util/Button'

function CertificateSlugPage() {
	const router = useRouter()
	const [user, setUser] = React.useState({
		firstName: '',
		lastName: '',
		email: ''
	})
	const { slug } = router.query
	const { data: certificate, error: certificateError } = useSWR(`*[_type=="certification" && slug.current=="${slug}"]{...,missions[]->{...}}[0]`, getter)
	if (!certificate) return <div>Loading...</div>
	if (certificateError) return <div>failed to load</div>
	return (
		<section className="mt-10 flex lg:flex-row flex-col">
			<div className="flex flex-col lg:w-2/3 w-full">
				<h1 className="text-4xl font-medium mb-4">{certificate.result.title}</h1>
				<ReactMarkdown>{certificate.result.description}</ReactMarkdown>

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
							value={certificate.result.price}
						/>
						<input
							type={'hidden'}
							name={'sku'}
							value={certificate.result.sku}
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
			</div>
			<div className="flex flex-col lg:w-1/3 w-full">
				<button
					onClick={() => {
						injectCollectJS(certificate.result.price, '/api/purchase/certificate')
					}}
					className="bg-ncrma-400 uppercase text-white font-medium px-3 py-2 rounded"
				>
					Purchase
				</button>
			</div>
		</section>
	)
}

export default CertificateSlugPage
