import { useNextSanityImage } from 'next-sanity-image'
import {client} from '@/util/config'

export default function imgConstructor(
	asset,
	options = {
		fit: null
	}
) {
	try {
		const img = useNextSanityImage(client, asset)
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
