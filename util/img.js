import { useNextSanityImage } from 'next-sanity-image'
import sanityClient from '@sanity/client'

export default function imgConstructor(asset) {
	const configuredSanityClient = sanityClient({
		projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
		dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
		useCdn: true
	})

	try {
		const imgProps = useNextSanityImage(configuredSanityClient, asset)
		return imgProps
	} catch (error) {
		return ''
	}
}
