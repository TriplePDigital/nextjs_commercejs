import { fetcher } from './fetcher'

export default async function getQuizByID(quizID, userID) {
	const query = `
        *[_type == "checkpoint" && _id == '${quizID}']
        {
        _id,
        _createdAt,
        _updatedAt,
        order,
        type ->{
            questions [] -> {
            title,
            answers []{
                answers,
                correct
            }
            },
            "attempts": *[_type == "quizAttempt" && references('${userID}')]{
            _id,
            _createdAt,
            _updatedAt,
            score
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
