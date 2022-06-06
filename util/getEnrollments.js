import groq from 'groq'
import { fetcher } from './fetcher'

export async function getAllEnrollments() {
	const query = groq`
        *[_type == 'enrollment']{
			...,
			course -> {
				title,
				instructors[] ->{name, _id},
				slug,
				"enrollCount": count(*[_type == 'enrollment' && references(^._id)]{...}),
				colorCode
			},
			student->{
			...
			},
			"progress": *[_type == 'progress' && references(^._id)]{
			status,
			"title": content -> {title}
			}
		}
    `
	return await fetcher(query)
}

export async function getMostPopularCourses() {
	const query = groq`
		*[_type == 'mission']{
			_id,
			title,
			"slug": slug.current,
			colorCode,
			instructors[] ->{name,"avatar":avatar.asset->,email},
			"memberCount": count(*[_type == 'enrollment' && references(^._id)])
		} | order(memberCount desc)
	`
	return await fetcher(query)
}

export async function getLatestEnrollments() {
	const query = groq`
		*[_type == 'enrollment']{
			_id,
			_createdAt,
			course->{
				_id,
				title,
				colorCode,
				instructors[]->{_id,name,"avatar":avatar.asset->},
				"track": *[_type=='track' && references(^._id)]{name,_id}[0]
			},
			student->{
				firstName,
				lastName,
				"avatar": avatar.asset->,
				role,
				email
			}
		} | order(_createdAt desc)`

	return await fetcher(query)
}

export async function getEnrollmentsPerUser(term, input = false) {
	const query = groq`
        *[_type == 'user'] ${
			input
				? `| score(firstName match '*${term}*' || lastName match '*${term}*' || email match '*${term}*', boost(email match '*${term}*', 4)) | order(_score desc)`
				: ''
		}
			{
				_id,
				_score,
				firstName,
				lastName,
				email,
				avatar{
					asset->
				},
				achievements,
				"enrollment": *[_type == 'enrollment' && references(^._id)]{
					_id,
					course->{
						title,
						"stages": *[_type =='stage' && references(^._id)]
					},
					"progress": *[_type == 'progress' && references(^._id)] | order(status desc){
						content ->{
							_id,
							"slug": slug.current,
							"parentStage": stage->_id,
							title
						},
						status,
						_id
					},
				},
				"count": count(*[_type == 'enrollment' && references(^._id)]{...})
			}
    `
	return await fetcher(query)
}
