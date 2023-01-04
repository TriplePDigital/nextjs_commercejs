import React from 'react'
import { useRouter } from 'next/router'
import getter from '@/util/getter'
import useSWR from 'swr'
import ReactMarkdown from 'react-markdown'
import Anchor from '@/components/util/Anchor'

function CertificateSlugPage() {
	const router = useRouter()
	const { slug } = router.query
	const { data: certificate, error: certificateError } = useSWR(`*[_type=="certification" && slug.current=="${slug}"]{...,missions[]->{...}}[0]`, getter)
	if (!certificate) return <div>Loading...</div>
	if (certificateError) return <div>failed to load</div>
	return (
		<section className="mt-10 flex lg:flex-row flex-col">
			<div className="flex flex-col lg:w-2/3 w-full">
				<h1 className="text-4xl font-medium mb-4">{certificate.result.title}</h1>
				<ReactMarkdown>{certificate.result.description}</ReactMarkdown>
			</div>
			<div className="flex flex-col lg:w-1/3 w-full">
				<Anchor
					href={`/checkout?price=${certificate.result.price}&type=certification&sku=${certificate.result.sku}`}
					className="text-center"
					variant="button"
				>
					Purchase
				</Anchor>
			</div>
		</section>
	)
}

export default CertificateSlugPage
