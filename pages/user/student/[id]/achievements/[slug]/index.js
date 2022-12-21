import React from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import getter from '@/util/getter'
import { Loader } from '@/components/util'
import Link from 'next/link'

const Index = (props) => {
	const router = useRouter()
	const SLUG = router.query.slug

	const { data, error } = useSWR(`*[_type == 'mission' && slug.current == '${SLUG}'][0]`, getter)

	if (!data) return <Loader />

	if (error) console.log(error)

	return (
		<section className="w-2/3 mx-auto flex-col text-center">
			<h1 className="text-4xl font-semibold mb-2">Congratulations on completing {data.result.title}</h1>
			<p>In the future you will be able to download your completion certificates from here.</p>
			<Link
				passHref={true}
				href={'/missions'}
			>
				<a className="rounded bg-ncrma-500 px-3 py-2 text-white mt-5 inline-block ">Back to courses</a>
			</Link>
		</section>
	)
}

export default Index
