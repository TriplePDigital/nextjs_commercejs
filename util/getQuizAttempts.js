import { fetcher } from './fetcher'
import groq from 'groq'

export default async function getQuizAttempts() {
	const query = groq`
        *[_type=='quizAttempt'] {
        _createdAt,
        _id,
        user ->{
	        _id,
	        email,
	        firstName,
	        lastName,
	        "enrollment": *[_type == "enrollment" && references(^._id)]{
	            _createdAt,
	            course -> {
	              ...
	            },
	        },
	        avatar{
	            asset ->
	        },
	        achievements ->
        },
        score,
        "checkpoint":quiz->{
          _id,
          stage->{
            _id,
            mission ->{
                _id,
                title,
                instructors[]->{_id,name}
            },
            slug,
            title
          },
          slug,
          "quiz":type->{
            _id,
            minimumScore,
            title,
          }
        }
      } | order(_createdAt desc)[0...50]`
	return await fetcher(query)
}
