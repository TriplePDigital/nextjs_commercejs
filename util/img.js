import { useNextSanityImage } from 'next-sanity-image'
import sanityClient from '@sanity/client'

export const configuredSanityClient = sanityClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
	useCdn: process.env.NODE_ENV === 'production'
})

export default function imgConstructor(
	asset,
	options = {
		fit: null
	}
) {
	try {
		const img = useNextSanityImage(configuredSanityClient, asset)
		if (options.fit === 'fill') {
			delete img['width']
			delete img['height']
			img.layout = 'fill'
			img.objectFit = 'cover' || options.objFit
			img.objectPosition = 'center' || options.objPos
		}
		return img
	} catch (error) {
		throw new Error(error)
	}
}
