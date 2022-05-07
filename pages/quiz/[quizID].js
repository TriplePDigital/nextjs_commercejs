import getQuizByID from '@/util/getQuizByID'
import getUserByEmail from '@/util/getUserByEmail'
import { getSession } from 'next-auth/client'
import { useState } from 'react'

function Quiz({ quizID, session, content }) {
	console.log(content)
	const quiz = content.type

	const [quizResponse, setQuizResponse] = useState(null)

	return (
		<>
			<div>
				<p>
					Number of previous attempts by you: {quiz.attempts.length}
				</p>
				<p>Minimum score required to pass: {quiz.minimumScore}</p>
				<p>Number of question in this quiz: {quiz.questions.length}</p>
			</div>
			<div className="">
				{quiz.questions.map((question, index) => {
					return (
						<div key={index}>
							<form>
								<p>{question.title}</p>
								{question.answers.map((answer, i) => {
									return (
										<label key={i}>
											{' '}
											{answer.answers}
											<input
												type="radio"
												name={index}
												value={answer.answers}
												onChange={() => {
													setQuizResponse({
														i: answer.answers
													})
												}}
											/>
										</label>
									)
								})}
							</form>
						</div>
					)
				})}
			</div>
		</>
	)
}

export default Quiz

export async function getServerSideProps(ctx) {
	const session = await getSession(ctx)
	if (!session) {
		return {
			redirect: {
				destination:
					'/auth/login?callbackUrl=http://localhost:3000/auth/welcome',
				permanent: false
			}
		}
	} else {
		const quizID = ctx.query.quizID
		const user = await getUserByEmail(session.user.email)
		const quiz = await getQuizByID(quizID, user._id)
		return {
			props: {
				quizID,
				session: user,
				content: quiz
			}
		}
	}
}
