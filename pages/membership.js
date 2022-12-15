import { FaCheck } from 'react-icons/fa'
import { useState } from 'react'
import Image from 'next/image'

const MembershipPage = () => {
	const [individual, setIndividual] = useState(true)
	return (
		<section className="bg-white dark:bg-gray-900">
			<div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
				<div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12 relative">
					<h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Designed for business teams like yours</h2>
					<div className="relative h-32">
						<Image
							src="https://ncrma.net/wp-content/uploads/2020/11/INDIVIDUAL-MEMBERSHIPS-TRANSPARENT-1-1.png"
							layout="fill"
							alt="Membership promo banner image."
						/>
					</div>
					<label className="inline-flex relative items-center mb-4 cursor-pointer">
						<input
							type="checkbox"
							value={individual}
							className="sr-only peer"
							onChange={() => setIndividual(!individual)}
						/>
						<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
						<span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{individual ? 'Individual Membership' : 'Company Membership'}</span>
					</label>
				</div>
				{individual ? (
					<div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
						<div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
							<h3 className="mb-4 text-2xl font-semibold">INDIVIDUAL</h3>
							<p className="font-light text-gray-500 italic sm:text-base dark:text-gray-400">Not a Company Membership Employee.</p>
							<div className="flex justify-center items-baseline my-8">
								<span className="mr-2 text-5xl font-extrabold relative">
									<span className="text-sm font-medium absolute top-0 left-0">$</span>
									<span className="ml-3">250</span>
								</span>
								<span className="text-gray-500 dark:text-gray-400">/yearly</span>
							</div>
							<ul
								role="list"
								className="mb-8 space-y-4 text-left"
							>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>20% Discount on all NCRM Academy Courses</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Complimentary NCRM Academy course upon joining</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Access to NCRMA Monthly Newsletter</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Access to expert knowledge of insurance and risk management products</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Cannabis risk management focused training and resources</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Connection with our Service Partners for industry expertise</span>
								</li>
							</ul>
							<a
								href="#"
								className="text-white bg-ncrma-600 hover:bg-ncrma-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
							>
								Get started
							</a>
						</div>
						<div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
							<h3 className="mb-4 text-2xl font-semibold">EDUCATION</h3>
							<p className="font-light text-gray-500 italic sm:text-base dark:text-gray-400">Full-time Professor or Dean in Risk Management, Business or Insurance.</p>
							<div className="flex justify-center items-baseline my-8">
								<span className="mr-2 text-5xl font-extrabold relative">
									<span className="text-sm font-medium absolute top-0 left-0">$</span>
									<span className="ml-3">130</span>
								</span>
								<span className="text-gray-500 dark:text-gray-400 dark:text-gray-400">/yearly</span>
							</div>
							<ul
								role="list"
								className="mb-8 space-y-4 text-left"
							>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>20% Discount on all NCRM Academy Courses</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Complimentary NCRM Academy course upon joining</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Access to NCRMA Monthly Newsletter</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Access to expert knowledge of insurance and risk management products</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Cannabis risk management focused training and resources</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Connection with our Service Partners for industry expertise</span>
								</li>
							</ul>
							<a
								href="#"
								className="text-white bg-ncrma-600 hover:bg-ncrma-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
							>
								Get started
							</a>
						</div>
						<div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
							<h3 className="mb-4 text-2xl font-semibold">YOUNG ENTREPRENEUR</h3>
							<p className="font-light text-gray-500 italic sm:text-base dark:text-gray-400">Under 26 years of age, Not a Company Membership Employee.</p>
							<div className="flex justify-center items-baseline my-8">
								<span className="mr-2 text-5xl font-extrabold relative">
									<span className="text-sm font-medium absolute top-0 left-0">$</span>
									<span className="ml-3">100</span>
								</span>
								<span className="text-gray-500 dark:text-gray-400">/yearly</span>
							</div>
							<ul
								role="list"
								className="mb-8 space-y-4 text-left"
							>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>20% Discount on all NCRM Academy Courses</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Complimentary NCRM Academy course upon joining</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Access to NCRMA Monthly Newsletter</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Access to expert knowledge of insurance and risk management products</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Cannabis risk management focused training and resources</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Connection with our Service Partners for industry expertise</span>
								</li>
							</ul>
							<a
								href="#"
								className="text-white bg-ncrma-600 hover:bg-ncrma-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
							>
								Get started
							</a>
						</div>
					</div>
				) : (
					<div className="space-y-8 lg:grid lg:grid-cols-2 sm:gap-6 xl:gap-10 lg:space-y-0">
						<div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
							<h3 className="mb-4 text-2xl font-semibold">COMPANY MEMBERSHIP</h3>
							<p className="font-light text-gray-500 italic sm:text-base dark:text-gray-400">Dispensary, Cultivation, Extraction and Infusion Facility, Manufacturing or Ancillary Cannabis Business.</p>
							<div className="flex justify-center items-baseline my-8">
								<span className="mr-2 text-5xl font-extrabold relative">
									<span className="text-sm font-medium absolute top-0 left-0">$</span>
									<span className="ml-3">800</span>
								</span>
								<span className="text-gray-500 dark:text-gray-400">/yearly</span>
							</div>
							<ul
								role="list"
								className="mb-8 space-y-4 text-left"
							>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>20% discount on all NCRM Academy courses</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Complimentary Risk Consultation upon joining</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Access to NCRMA Monthly Newsletter</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Access to expert knowledge of insurance and risk management products</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>NCRPS planning and support</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Access to association owned captive insurance products</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Customized solutions</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span> Connection with our Service Partners for industry expertise</span>
								</li>
							</ul>
							<a
								href="#"
								className="text-white bg-ncrma-600 hover:bg-ncrma-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
							>
								Get started
							</a>
						</div>
						<div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
							<h3 className="mb-4 text-2xl font-semibold">ASSOCIATION</h3>
							<p className="font-light text-gray-500 italic sm:text-base dark:text-gray-400">Member Association Involved in the Cannabis Industry.</p>
							<div className="flex justify-center items-baseline my-8">
								<span className="mr-2 text-5xl font-extrabold relative">
									<span className="text-sm font-medium absolute top-0 left-0">$</span>
									<span className="ml-3">1200</span>
								</span>
								<span className="text-gray-500 dark:text-gray-400 dark:text-gray-400">/yearly</span>
							</div>
							<ul
								role="list"
								className="mb-8 space-y-4 text-left"
							>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Collaborative association features- joint branding, PR, marketing and event efforts</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Promotion of your association to our members and ancillary businesses</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Customized education for members of your association</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>20% discount on NCRM Academy courses</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Discounted access to NCRMA Risk Protection Services</span>
								</li>
								<li className="flex items-center space-x-3">
									<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
									<span>Connection with our Service Partners for industry expertise</span>
								</li>
							</ul>
							<a
								href="#"
								className="text-white bg-ncrma-600 hover:bg-ncrma-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
							>
								Get started
							</a>
						</div>
					</div>
				)}
			</div>
		</section>
	)
}

export default MembershipPage
