import React, { useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import getter from '@/util/getter'
import groq from 'groq'
import { Loader } from '@/components/util'
import PriceCard from '@/components/Membership/PriceCard'

const MembershipPage = () => {
	const [individual, setIndividual] = useState(true)
	const membershipQuery = groq`
		*[_type == "membership"]
	`
	const { data, error } = useSWR(membershipQuery, getter)
	if (!data) return <Loader />
	if (error) console.error(error)
	return (
		<section className="bg-white dark:bg-gray-900">
			<div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
				<div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12 relative">
					<h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">NCRM Academy Memberships</h2>
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
						{data.result
							.filter((item) => item.type === 'individual')
							.map((doc, docIndex) => {
								return (
									<PriceCard
										key={docIndex}
										price={doc.price}
										description={doc.description}
										benefits={doc.benefits}
										sku={doc.sku}
										title={doc.name}
									/>
								)
							})}
					</div>
				) : (
					<div className="space-y-8 lg:grid lg:grid-cols-2 sm:gap-6 xl:gap-10 lg:space-y-0">
						{data.result
							.filter((item) => item.type === 'company')
							.map((doc, docIndex) => {
								return (
									<PriceCard
										key={docIndex}
										price={doc.price}
										description={doc.description}
										benefits={doc.benefits}
										sku={doc.sku}
										title={doc.name}
									/>
								)
							})}
					</div>
				)}
			</div>
		</section>
	)
}

export default MembershipPage
