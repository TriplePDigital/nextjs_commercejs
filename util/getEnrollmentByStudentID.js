import groq from 'groq'
import { fetcher } from './fetcher'

export default async function getEnrollmentByStudentID(studentID) {
	const query = groq`
        *[_type == 'enrollment' && references('${studentID}')]{
          ...,
          course -> {
            title,
            instructors[] ->{name, _id},
            slug,
            "coverImage": coverImage.asset->,
            "enrollCount": count(*[_type == 'enrollment' && references(^._id)]),
            colorCode
          },
          student,
          "progress": *[_type == 'progress' && references(^._id)]{
            status,
            "title": content -> {title}
          }
        }
    `
	return await fetcher(query)
}
