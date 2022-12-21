/* eslint-disable no-unused-vars */
import getQuizByID from '@/util/getQuizByID'
import getUserByEmail from '@/util/getUserByEmail'
import { getSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/router'
import { client } from '@/util/config'
import { Loader } from '@/components/util'
import mdConfig from '@/util/md'
import ReactMarkdown from 'react-markdown'

function Quiz({ quizID, session, content }) {
	const quiz = content.type
	const [quizResponse, setQuizResponse] = useState([])
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [enrollment, setEnrollment] = useState(null)
	const [loading, setLoading] = useState(true)

	const LENGTH = quiz.questions.length - 1
	const ATTEMPTS = content.attempts.length || 0

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

	const handleAnswerOption = (event) => {
		// get quiz responses
		// check for current question's answer
		// if answer is there, push answer to current response index in array
		// if answer is already there, remove the answer from the array
		// else add answer to array of the current question index

		const answer = event.target.value

		let responses = quizResponse

		if (responses[currentQuestion]) {
			let index = responses[currentQuestion].findIndex((resp) => resp === answer)
			if (index === -1) {
				responses[currentQuestion].push(answer)
			} else {
				responses[currentQuestion].splice(index, 1)
			}
		} else {
			responses[currentQuestion] = [answer]
		}

		setQuizResponse([...responses])
	}

	const handleSubmit = () => {
		let newScore = 0
		for (let i = 0; i < quiz.questions.length; i++) {
			const correctAnswers = quiz.questions[i].answers.filter((answer) => answer.correct)
			const numberOfCorrectAnswers = correctAnswers.length
			if (numberOfCorrectAnswers === 1) {
				correctAnswers[0].answers === quizResponse[i][0] ? newScore++ : null
			} else {
				//TODO: Figure out a way to handle selecting the correct choices but also the incorrect ones. Currently we are giving 100% if the student selects all options and not all of them are correct.
				let partialScore = 0
				for (let j = 0; j < quizResponse[i].length; j++) {
					if (correctAnswers.find((answer) => answer.answers === quizResponse[i][j])) {
						partialScore++
					} else {
						partialScore--
					}
				}
				newScore += partialScore / numberOfCorrectAnswers
			}
		}
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
			router.push(`/quiz/result/[quizResult]`, `/quiz/result/${quizAttempt._id}`)
		}
	}

	useEffect(() => {
		const enrollment = client.fetch(`*[_type == "enrollment" && references('${session._id}') && references('${content.stage.mission._id}')][0]`)

		enrollment
			.then((res) => {
				setEnrollment(res)
				setLoading(false)
			})
			.catch((err) => {
				throw new Error(err)
			})
		return () => {}
	}, [session, content])

	return loading ? (
		<Loader />
	) : (
		<>
			<div className="bg-gray-100 shadow-md border rounded p-5 my-4 w-2/3 mx-auto">
				<p>Number of previous attempts by you: {ATTEMPTS}</p>
				<p>Minimum percentage to pass: {quiz.minimumScore}%</p>
				<p>Number of question: {quiz.questions.length}</p>
			</div>
			<div className="flex flex-col w-2/3 mx-auto">
				<form onChange={(e) => handleAnswerOption(e)}>
					<div className="py-1.5 border-b border-gray-100 last:mb-3">
						<div className="flex justify-between items-center">
							<div>
								<p className="text-gray-500">
									Question {currentQuestion + 1} of {quiz.questions.length}
								</p>
								<p className="font-semibold">
									<ReactMarkdown
										components={mdConfig}
										className="my-2"
									>
										{quiz.questions[currentQuestion].title}
									</ReactMarkdown>
								</p>
							</div>
							<p className="text-gray-500 self-start mt-5">Point: {100 / quiz.questions.length}</p>
						</div>
						<div className="flex flex-col">
							{quiz.questions[currentQuestion].answers.map((answer, i) => {
								return (
									<label key={nanoid()}>
										<input
											type="checkbox"
											name={currentQuestion}
											value={answer.answers}
											checked={quizResponse[currentQuestion]?.includes(answer.answers)}
										/>
										{answer.answers}
									</label>
								)
							})}
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
							onClick={currentQuestion + 1 === quiz.questions.length ? (e) => sendQuizResults(e) : (e) => handleNext(e)}
							className="text-black hover:text-white bg-ncrma-400 focus:bg-ncrma-600 hover:bg-ncrma-600 px-3 py-1.5 rounded block w-1/5 min-w-fit transition-all"
						>
							{currentQuestion + 1 === quiz.questions.length ? 'Submit' : 'Next'}
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
