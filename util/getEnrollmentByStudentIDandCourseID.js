import { fetcher } from './fetcher'
import groq from 'groq'

export default async function getEnrollmentByStudentIDandCourseID(
	userID,
	courseID
) {
	const query = groq`
    *[_type == 'enrollment' && references('${userID}') && references('${courseID}')]{
    _id,
    "progress": *[_type == 'progress' && references(^._id)] | order(status desc){
        content ->{
            _id,
            "slug": slug.current,
            "parentStage": stage->_id,
            title
        },
        status,
        _id
    },
    course ->{
        _id,
        "slug": slug.current,
        title,
        "stages": *[_type == 'stage' && references(^._id)] | order(order asc){
            _id,
            "slug": slug.current,
            title,
            "checkpoints": *[_type == 'checkpoint' && references(^._id)] | order(order asc){
                type-> {
                    _id,
                    body,
                    duration,
                    vimeoVideo,
                    attempts[]->,
                    minimumScore,
                    questions[]->,
                    title,
                    instructor -> {name, _id, "avatar":avatar.asset->, stages[]->}
                },
                order,
                title,
                _id,
                instance
            }
        }
    },
    student -> {
        _id,
        "quizAttempts": *[_type == 'quizAttempt' && references(^._id)] | order(score desc){
            _id,
            score,
            "quizID": quiz->_id
        }
    }
    }[0]
    `
	return await fetcher(query)
}
