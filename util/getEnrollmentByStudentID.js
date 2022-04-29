import { fetcher } from './fetcher'

export default async function getEnrollmentByStudentID(studentID) {
	const query = `
        *[_type == 'enrollment' && references('${studentID}')]{
  ...,
  course -> {
     title,
     instructors[] ->{name},
     slug,
     "coverImage": coverImage{asset->},
     "enrollCount": count(*[_type == 'enrollment' && references(^._id)]{...}),
  },
  student,
  "progress": *[_type == 'progress' && references(^._id)]{
    status,
    "title": content -> {title}
  }
}
    `
	const result = await fetcher(query)
	return result
}
