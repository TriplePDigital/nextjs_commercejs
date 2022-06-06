import groq from 'groq'
import { fetcher } from './fetcher'

export default async function getTracks() {
	const query = groq`
        *[_type == 'track']{
				...,
				missions[] -> {
					...,
					instructors[]->,
					coverImage{
						asset->
					},
					colorCode,
                    "enrollCount": count(*[_type == 'enrollment' && references(^._id)]),
				},
				achievement ->{
					title,
					slug
				}
			}
    `
	return await fetcher(query)
}
