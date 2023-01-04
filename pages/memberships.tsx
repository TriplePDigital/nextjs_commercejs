import React, { useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import getter from '@/util/getter'
import groq from 'groq'
import { Loader } from '@/components/util'
import PriceCard from '@/components/Membership/PriceCard'
import { SWRResponse } from '@/types/index'
import { Membership } from '@/types/schema/membership'

const MembershipPage = () => {
	const [product, setProduct] = useState({
		price: '0',
		sku: '',
		title: ''
	})
	const [showOverlay, setShowOverlay] = useState(false)

	const membershipQuery = groq`
		*[_type == "membership"]
	`
	const { data, error } = useSWR<SWRResponse<Membership[]>>(membershipQuery, getter)

	if (!data) return <Loader />
	if (error) console.error(error)

	return (
		<section className="bg-white dark:bg-gray-900">
			{showOverlay && <div className="z-20 absolute opacity-75 bg-black w-[calc(100%_-_5rem)] h-screen"></div>}
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
				</div>
				<div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
					{data.result
						.sort((a, b) => a.price - b.price)
						.map((doc, docIndex) => {
							return (
								<PriceCard
									key={docIndex}
									price={doc.price}
									description={doc.description}
									benefits={doc.benefits}
									sku={doc.sku}
									title={doc.name}
									handleSelect={setProduct}
									selected={product}
									setShowOverlay={setShowOverlay}
								/>
							)
						})}
				</div>
			</div>
		</section>
	)
}

export default MembershipPage
