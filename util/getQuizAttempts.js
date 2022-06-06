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
	        enrollment -> {
	            _createdAt,
	            course -> {
	              ...
	            }
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
      }`
	return await fetcher(query)
}
