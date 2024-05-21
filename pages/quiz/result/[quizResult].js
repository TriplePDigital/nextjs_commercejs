import { useSession } from 'next-auth/client'
import { getQuizResultByIDQuery } from '@/util/getQuizResultByID'
import Link from 'next/link'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import getter from '@/util/getter'
import useSWR from 'swr'
import { Loader } from '@/components/util'
import { userContextObject } from '../../_app'

const QuizResult = () => {
	const { user } = useContext(userContextObject)

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
			<div className="text-center">
				<div>
					<span className="font-medium mr-1">Your score:</span>
					<span className={`font-bold ${result.score > result.checkpoint.type.minimumScore ? 'text-green-500' : 'text-red-500'}`}>{Number(result.score).toFixed(2)}</span> / 100{' '}
					<span className="text-xs text-gray-400">({Number(result.score).toFixed(2)}%)</span>
				</div>
				<div className="text-sm mb-3">
					<span className="font-medium mr-1">Minimum Score to Pass:</span>
					<span className="font-bold">{(Number(result.checkpoint.type.minimumScore) / 100).toFixed(2) * 100}%</span>
				</div>
			</div>
			<section className="mt-5 "></section>
			<div className="flex gap-5 items-center justify-between my-5">
				<Link href={`/missions`}>
					<a className="bg-ncrma-100 hover:bg-ncrma-300 rounded-lg px-6 py-4 w-fit">Back to Courses</a>
				</Link>
				{getNextStage(result.checkpoint.stage.mission?.nextStage) === '' && getNextCheckpoint(result.checkpoint.stage?.checkpoints) === '' ? (
					<Link href={`/user/student/${user?._id}/achievements/${result.checkpoint.stage.mission.slug}`}>
						<a className="bg-ncrma-400 hover:bg-ncrma-600 text-white px-6 py-4 rounded-lg">Finish course</a>
					</Link>
				) : result.checkpoint.stage.checkpoints?.length !== result.checkpoint.order ? (
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
