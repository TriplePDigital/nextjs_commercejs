import { useSession } from 'next-auth/client'
import { getQuizResultByIDQuery } from '@/util/getQuizResultByID'
import Link from 'next/link'
import { MdCheck, MdClose } from 'react-icons/md'
import { useState } from 'react'
import { useRouter } from 'next/router'
import getter from '@/util/getter'
import useSWR from 'swr'
import { Loader } from '@/components/util'

const QuizResult = () => {
	const [showAlert, setShowAlert] = useState(true)

	const router = useRouter()

	const [session, loading] = useSession()

	const { data: quizAttempt, error: quizAttemptError } = useSWR(getQuizResultByIDQuery(router.query.quizResult), getter)

	if (!quizAttempt || loading) return <Loader />

	if (quizAttemptError) return <div>Something went wrong</div>

	const { result } = quizAttempt

	const getNextStage = (stageObj) => {
		const nextStage = stageObj.find((stage) => stage.order === result.checkpoint.stage.order + 1)
		return nextStage?._id || ''
	}

	const getNextCheckpoint = (checkpointObj) => {
		const nextCheckpoint = checkpointObj.find((checkpoint) => checkpoint.order === result.checkpoint.order + 1)
		return nextCheckpoint?._id || ''
	}

	if (!session) router.push(`/auth/login?callbackUrl=${process.env.NEXT_PUBLIC_CALLBACK_BASE_URL}welcome`)

	return (
		<div className="flex flex-col w-2/3 mx-auto mt-5 shadow-md rounded p-8 bg-gray-50 border">
			<div className="mb-3">
				<h1 className="text-3xl font-medium">{result.checkpoint.title}</h1>
				<h2 className="text-lg font-light opacity-50">{result.checkpoint.stage.mission.title}</h2>
			</div>
			<div>
				Your score: <span className={`font-bold ${result.score > result.checkpoint.type.minimumScore ? 'text-green-500' : 'text-red-500'}`}>{result.score}</span> / 100{' '}
				<span className="text-sm text-gray-400">({(Number(result.score) / 100).toFixed(2) * 100}%)</span>
			</div>
			<div className="text-sm mb-3">
				Minimum Score to Pass: {result.checkpoint.type.minimumScore}{' '}
				<span className="text-sm text-gray-400">
					({(Number(result.checkpoint.type.minimumScore) / 100).toFixed(2) * 100}
					%)
				</span>
			</div>
			{showAlert ? (
				<div
					className="relative text-xs text-yellow-700 font-light italic px-4 py-3 w-4/5 mx-auto bg-yellow-100 rounded-lg"
					role="alert"
				>
					We kindly apologize but your responses are not shown at this time. Our team is working on an issue regarding the retrieval of individual student&apos;s responses.{' '}
					<span className="font-bold">Your final score will be stored regardless of this issue being present.</span>
					<button
						className="absolute right-2 top-2 text-gray-400"
						onClick={() => setShowAlert(false)}
					>
						<MdClose size={21} />
					</button>
				</div>
			) : null}
			<section className="mt-5 ">
				{result.checkpoint.type.questions.map((question, questionIndex) => {
					return (
						<div
							className="list-none"
							key={questionIndex}
						>
							<li className="font-medium">{`${questionIndex + 1}.) ${question.title}`}</li>
							<ul className="mx-5 my-2">
								{question.answers.map((answer, answerIndex) => {
									return (
										<li
											key={answerIndex}
											className="flex gap-5 items-center justify-between w-full md:w-full"
										>
											<span className="md:w-1/3 ">{answer.answers}</span>
											<span className="md:w-1/3 text-sm text-gray-600 flex items-center justify-center">Correct response: </span>
											<span className="md:w-1/3">
												{answer.correct ? (
													<MdCheck
														size={21}
														className="text-green-500"
													/>
												) : (
													<MdClose
														size={21}
														className="text-red-500"
													/>
												)}
											</span>
										</li>
									)
								})}
							</ul>
						</div>
					)
				})}
			</section>
			<div className="flex gap-5 items-center justify-between my-5">
				<Link href={`/missions`}>
					<a className="bg-ncrma-100 hover:bg-ncrma-300 rounded-lg px-6 py-4 w-fit">Back to Courses</a>
				</Link>
				{result.checkpoint.stage.checkpoints?.length !== result.checkpoint.order ? (
					<Link href={`/mission/${result.checkpoint.stage.mission.slug}?checkpointID=${getNextCheckpoint(result.checkpoint.stage?.checkpoints)}`}>
						<a className="bg-ncrma-400 hover:bg-ncrma-600 text-white px-6 py-4 rounded-lg">Proceed to next Checkpoint</a>
					</Link>
				) : (
					<Link href={`/mission/${result.checkpoint.stage.mission.slug}?stageID=${getNextStage(result.checkpoint.stage.mission?.nextStage)}`}>
						<a className="bg-ncrma-400 hover:bg-ncrma-600 text-white px-6 py-4 rounded-lg">Proceed to next Stage</a>
					</Link>
				)}
			</div>
		</div>
	)
}

export default QuizResult

// export async function getServerSideProps(ctx) {
// 	const session = await getSession(ctx)
// 	if (!session) {
// 		return {
// 			redirect: {
// 				destination: `/auth/login?callbackUrl=${process.env.NEXT_PUBLIC_CALLBACK_BASE_URL}welcome`,
// 				permanent: false
// 			}
// 		}
// 	} else {
// 		const quizResultID = ctx.query.quizResult
// 		const result = await getQuizResultByID(quizResultID)
// 		return {
// 			props: {
// 				result
// 			}
// 		}
// 	}
// }
