import React from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import getter from '@/util/getter'
import { SWRResponse } from '@/types/index'
import { Track } from '@/types/schema'

function TrackSlugPage() {
	const router = useRouter()
	const { slug } = router.query

	console.log(slug)

	const { data: track, error: trackError } = useSWR<SWRResponse<Track>>(`*[_type == "track" && slug.current == "${slug}"]{...,missions[]->}[0]`, getter)

	if (!track?.result) return <div>Loading...</div>

	if (trackError) console.error(trackError)

	console.log(track.result)

	return (
		<section>
			<h1>{track.result.name}</h1>
			<ul>
				{track.result.missions.map((result, index) => (
					//@ts-ignore
					<li key={index}>{result.title}</li>
				))}
			</ul>
		</section>
	)
}

export default TrackSlugPage
