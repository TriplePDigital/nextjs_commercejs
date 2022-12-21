import groq from 'groq'
import { fetcher } from './fetcher'

export default async function getQuizByID(quizID, userID) {
	const query = groq`
        *[_type == "checkpoint" && _id == '${quizID}']
        {
        _id,
        _createdAt,
        _updatedAt,
        order,
        "attempts": *[_type == "quizAttempt" && references('${userID}') && references(^._id)],
        type ->{
            questions [] -> {
	            title,
	            answers []{
	                answers,
	                correct
	            }
            },
            minimumScore,
        },
        stage -> {
            mission -> {
                "slug": slug.current,
                _id
            },
            order,
        }
        }[0]
    `
	const result = await fetcher(query)
	return result
}
