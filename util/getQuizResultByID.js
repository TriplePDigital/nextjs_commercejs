import groq from 'groq'
import { fetcher } from './fetcher'

export default async function getQuizResultByID(quizID) {
	const query = groq`
    *[_type == "quizAttempt" && _id == "${quizID}"]{
        _id,
        score,
        _createdAt,
        quiz->{
            _id,
            title,
            order,
            stage->{
            _id,
            order,
            "checkpoints": *[_type == "checkpoint" && references(^._id)]|order(order asc){
                order,
                _id
            },
            mission ->{
                "slug": slug.current,
                "nextStage": *[_type == "stage" && references(^._id)]|order(order asc){_id,order}
            }
            },
        }
        }[0]
    `
	return await fetcher(query)
}
