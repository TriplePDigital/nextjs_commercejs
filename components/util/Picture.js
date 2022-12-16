import { useNextSanityImage } from 'next-sanity-image'
import { client } from '@/util/config'
import Image from 'next/image'

const Picture = ({ avatar, quality, alt }) => {
	const imageProps = useNextSanityImage(client, avatar)

	return (
		<Image
			src={imageProps.src}
			loader={imageProps.loader}
			blurDataURL={imageProps.blurDataURL}
			placeholder="blur"
			layout="fill"
			objectFit="cover"
			objectPosition="center"
			quality={quality}
			alt={alt}
			loading={'lazy'}
		/>
	)
}

export default Picture
