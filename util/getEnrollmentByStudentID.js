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
            "numberOfStages": count(*[_type == 'stage' && references(^._id)]),
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

export const enrollmentQuery = (ID) => groq`
        *[_type == 'enrollment' && references('${ID}')]{
          ...,
          course -> {
            _id,
            title,
            instructors[] ->{name, _id},
            slug,
            "coverImage": coverImage.asset->,
            "enrollCount": count(*[_type == 'enrollment' && references(^._id)]),
            "numberOfStages": count(*[_type == 'stage' && references(^._id)]),
            colorCode,
            "stages": *[_type =='stage' && references(^._id)]{
				...,
				"checkpointCount": count(*[_type == 'checkpoint' && references(^._id)]),
			},
          },
          student,
          "progress": *[_type == 'progress' && references(^._id)]{
            status,
            "title": content -> {title},
            content ->{
				_id,
				"slug": slug.current,
				"parentStage": stage->_id,
			},
			_id
          }
        }
    `
