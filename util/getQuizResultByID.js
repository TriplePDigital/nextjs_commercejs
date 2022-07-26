import groq from 'groq'
import { fetcher } from './fetcher'

export default async function getQuizResultByID(quizAttemptID) {
	const query = groq`
    *[_type == "quizAttempt" && _id == "${quizAttemptID}"]{
        _id,
        score,
        _createdAt,
        "checkpoint": quiz->{
            _id,
            title,
            order,
            stage->{
                _id,
                order,
                "checkpoints": *[_type == "checkpoint" && references(^._id)]|order(order asc){
                    order,
                    _id,
                },
                mission ->{
                    title,
                    "slug": slug.current,
                    "nextStage": *[_type == "stage" && references(^._id)]|order(order asc){_id,order}
                }
            },
            type -> {
                minimumScore,
                questions[]->{
                    title,
                    _id,
                    answers[]{
                        correct,
                        answers,
                        _key
                    }
                },
            }
        }
        }[0]
    `
	return await fetcher(query, false)
}
