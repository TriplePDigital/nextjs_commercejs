import sanityClient from '@sanity/client'

export const client = sanityClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
	useCdn: process.env.NODE_ENV === 'production',
	apiVersion: 'v1'
})
