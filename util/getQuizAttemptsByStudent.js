import { fetcher } from './fetcher'
import groq from 'groq'

export default async function getQuizAttemptsByStudent(studentID) {
	const query = groq`
  *[_type == "quizAttempt" && references("${studentID}")]{
  _id,
  score,
  _createdAt,
  quiz -> {
    _id,
    title,
    stage -> {
      _id,
      title,
      order,
      mission -> {
          _id,
          "slug": slug.current,
          title,
          instructors[]->{
            _id,
            name,
            email,
            "avatar": avatar.asset->
          }
      }
    }
  },
  } | order(_createdAt desc)`
	return await fetcher(query)
}
