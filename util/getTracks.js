import groq from 'groq'
import { fetcher } from './fetcher'

export default async function getTracks() {
	const query = groq`
        *[_type == 'track']{
				...,
				missions[] -> {
					...,
					"numberOfStages": count(*[_type == 'stage' && references(^._id)]),
					instructors[]->,
					coverImage{
						asset->
					},
					colorCode,
                    "enrollCount": count(*[_type == 'enrollment' && references(^._id)]),
				},
				"numCourses": coalesce(length(missions), 0),
				achievement ->{
					title,
					slug
				}
			} | order(numCourses desc)
    `
	return await fetcher(query)
}

export const trackQuery = groq`
        *[_type == 'track']{
				...,
				missions[] -> {
					...,
					"numberOfStages": count(*[_type == 'stage' && references(^._id)]),
					instructors[]->,
					coverImage{
						asset->
					},
					colorCode,
                    "enrollCount": count(*[_type == 'enrollment' && references(^._id)]),
				},
				"numCourses": coalesce(length(missions), 0),
				achievement ->{
					title,
					slug
				}
			} | order(numCourses desc)
    `