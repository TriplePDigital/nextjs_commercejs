import { useNextSanityImage } from 'next-sanity-image'
import sanityClient from '@sanity/client'

export const configuredSanityClient = sanityClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
	useCdn: process.env.NODE_ENV === 'production'
})

export default function imgConstructor(asset) {
	try {
		return useNextSanityImage(configuredSanityClient, asset)
	} catch (error) {
		throw new Error(error)
	}
}
