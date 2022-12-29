import React from 'react'
import useSWR from 'swr'
import getter from '@/util/getter'
import CertificationCard from '@/components/Certs/CertificationCard'
import { Loader } from '@/components/util'

function CertificatesPage() {
	const { data: certificates, error: certificatesError } = useSWR(`*[_type=="certification"]{...,missions[]->{...}}`, getter)
	if (!certificates) return <Loader />
	if (certificatesError) return <div>failed to load</div>
	return (
		<section>
			{certificates.result.map((cert, certIndex) => (
				<CertificationCard
					certificate={cert}
					key={certIndex}
				/>
			))}
		</section>
	)
}

export default CertificatesPage
