/* eslint-disable no-unused-vars */
import getQuizByID from '@/util/getQuizByID'
import getUserByEmail from '@/util/getUserByEmail'
import { getSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/router'
import { configuredSanityClient as client } from '@/util/img'

function Quiz({ quizID, session, content }) {
	const quiz = content.type
	const [quizResponse, setQuizResponse] = useState([])
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [attempt, setAttempt] = useState(null)
	const [enrollment, setEnrollment] = useState(null)
	const [score, setScore] = useState(0)
	const [showScore, setShowScore] = useState(false)

	const LENGTH = quiz.questions.length - 1

	const router = useRouter()

	const handlePrevious = (e) => {
		e.preventDefault()
		const prev = currentQuestion - 1
		prev >= 0 && setCurrentQuestion(prev)
	}

	const handleNext = (e) => {
		e.preventDefault()
		const next = currentQuestion + 1
		next < quiz.questions.length && setCurrentQuestion(next)
	}

	const handleAnswerOption = (answer) => {
		setQuizResponse([
			(quizResponse[currentQuestion] = { answerByUser: answer })
		])
		setQuizResponse([...quizResponse])
	}

	const handleSubmit = () => {
		let newScore = 0
		for (let i = 0; i < quiz.questions.length; i++) {
			quiz.questions[i].answers.map(
				(answer) =>
					answer.correct &&
					answer.answers === quizResponse[i]?.answerByUser &&
					(newScore += 1)
			)
		}
		setScore(newScore)
		setShowScore(true)
		return newScore
	}

	const sendQuizResults = async (e) => {
		e.preventDefault()
		const score = handleSubmit()
		const percRes = (score / quiz.questions.length) * 100
		if (currentQuestion === LENGTH) {
			await client.create({
				_type: 'progress',
				status: percRes,
				content: {
					_type: 'reference',
					_ref: content._id
				},
				enrollment: {
					_type: 'reference',
					_ref: enrollment._id
				}
			})
			let quizAttempt = await client.create({
				_type: 'quizAttempt',
				score: percRes,
				quiz: {
					_ref: quizID,
					_type: 'reference'
				},
				user: {
					_ref: session._id,
					_type: 'reference'
				}
			})
			// setAttempt(quizAttempt)
			router.push(
				`/quiz/result/[quizResult]`,
				`/quiz/result/${quizAttempt._id}`
			)
		}
	}

	useEffect(() => {
		const enrollment = client.fetch(
			`*[_type == "enrollment" && references('${session._id}') && references('${content.stage.mission._id}')][0]`
		)

		enrollment
			.then((res) => {
				setEnrollment(res)
			})
			.catch((err) => {
				throw new Error(err)
			})
		return () => {}
	}, [session, content])

	return (
		<>
			<div className="bg-gray-100 shadow-md border rounded p-5 my-4 w-2/3 mx-auto">
				<p>
					Number of previous attempts by you: {quiz.attempts.length}
				</p>
				<p>Minimum percentage to pass: {quiz.minimumScore}%</p>
				<p>Number of question: {quiz.questions.length}</p>
			</div>
			<div className="flex flex-col w-2/3 mx-auto">
				<form>
					<div className="py-1.5 border-b border-gray-100 last:mb-3">
						<div className="flex justify-between items-center">
							<div>
								<p className="text-gray-500">
									Question {currentQuestion + 1} of{' '}
									{quiz.questions.length}
								</p>
								<p className="font-semibold">
									{quiz.questions[currentQuestion].title}
								</p>
							</div>
							<p className="text-gray-500">
								Point: {100 / quiz.questions.length}
							</p>
						</div>
						<div className="flex flex-col">
							{quiz.questions[currentQuestion].answers.map(
								(answer, i) => {
									return (
										<label key={nanoid()}>
											<input
												type="radio"
												name={i}
												value={answer.answers}
												onChange={(e) =>
													handleAnswerOption(
														answer.answers
													)
												}
												checked={
													answer.answers ===
													quizResponse[
														currentQuestion
													]?.answerByUser
												}
											/>
											{answer.answers}
										</label>
									)
								}
							)}
						</div>
					</div>

					<div className="flex items-center gap-4 mx-auto my-2">
						<button
							onClick={(e) => handlePrevious(e)}
							className="text-black hover:text-white bg-ncrma-400 focus:bg-ncrma-600 hover:bg-ncrma-600 px-3 py-1.5 rounded block w-1/5 min-w-fit transition-all"
							type="button"
						>
							Previous
						</button>
						<button
							onClick={
								currentQuestion + 1 === quiz.questions.length
									? (e) => sendQuizResults(e)
									: (e) => handleNext(e)
							}
							className="text-black hover:text-white bg-ncrma-400 focus:bg-ncrma-600 hover:bg-ncrma-600 px-3 py-1.5 rounded block w-1/5 min-w-fit transition-all"
						>
							{currentQuestion + 1 === quiz.questions.length
								? 'Submit'
								: 'Next'}
						</button>
					</div>
				</form>
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
				destination: `/auth/login?callbackUrl=${process.env.NEXTAUTH_URL}/welcome`,
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
