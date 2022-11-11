import React from 'react'
import Image from 'next/image'
import checkout from '@/util/checkout'
import Script from 'next/script'
import axios from 'axios'

function Mjbiz2022({ products }) {
	return (
		<div>
			<Script
				src="https://secure.nmi.com/token/CollectCheckout.js"
				data-checkout-key="checkout_public_Du2E7M5C7spt3N8Vs9Su2tuFs9UgM25W"
			/>
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
				<div className="bg-ncrma-500 opacity-75 absolute top-0 left-0 w-full h-full"></div>
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
			<div className="w-full my-10">
				<button
					className="block bg-transparent border-2 border-ncrma-400 hover:bg-ncrma-400 text-back hover:text-white uppercase font-medium rounded w-1/3 mx-auto px-4 py-3"
					onClick={() => {
						checkout(products.courses)
					}}
				>
					Purchase PCRM Bundle
				</button>
			</div>
			<div className="relative w-1/4 h-32 mx-auto">
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

export async function getStaticProps() {
	const products = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/promo/getAllCourses`)
	return {
		props: {
			products: products.data
		}
	}
}

export default Mjbiz2022
