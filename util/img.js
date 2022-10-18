import { useNextSanityImage } from 'next-sanity-image'
import configuredSanityClient from '@/util/config'

export default function imgConstructor(
	asset,
	options = {
		fit: null
	}
) {
	try {
		const img = useNextSanityImage(configuredSanityClient(), asset)
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
