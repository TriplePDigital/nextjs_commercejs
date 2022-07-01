import { getSession } from 'next-auth/client'
import getQuizResultByID from '@/util/getQuizResultByID'
import Link from 'next/link'

function quizResult({ result, quizID }) {
	console.log(result)
	const getNextStage = (stageObj) => {
		const nextStage = stageObj.find(
			(stage) => stage.order === result.quiz.stage.order + 1
		)
		return nextStage._id
	}

	const getNextCheckpoint = (checkpointObj) => {
		const nextCheckpoint = checkpointObj.find(
			(checkpoint) => checkpoint.order === result.quiz.order + 1
		)
		return nextCheckpoint._id
	}

	return (
		<div className="flex flex-col w-2/3 mx-auto mt-5">
			<div>Final score: {result.score}</div>
			{/* <div>Quiz position in stage: {result.quiz.order}</div>
			<div>
				Number of checkpoints in the stage:{' '}
				{result.quiz.stage.checkpoints?.length}
			</div>

			<div>
				Number of stages in the mission:{' '}
				{result.quiz.stage.mission?.nextStage?.length}
			</div>
			{result.quiz.stage.checkpoints?.length !== result.quiz.order
				? `This is not the final checkpoint. The next checkpoint is No: ${getNextCheckpoint(
						result.quiz.stage.checkpoints
				  )}`
				: `This is the final checkpoint. The next stage is ${getNextStage(
						result.quiz.stage.mission?.nextStage
				  )}`} */}
			<div className="flex gap-5 items-center justify-between my-5">
				<Link href={`/missions}`}>
					<a className="block bg-gray-300 py-3 px-6 rounded">
						Back to Courses
					</a>
				</Link>
				{result.quiz.stage.checkpoints?.length !== result.quiz.order ? (
					<Link
						href={`/mission/${
							result.quiz.stage.mission.slug
						}?checkpointID=${getNextCheckpoint(
							result.quiz.stage.checkpoints
						)}`}
					>
						<a className="block bg-ncrma-400 py-3 px-6 rounded">
							Proceed to next Checkpoint
						</a>
					</Link>
				) : (
					<Link
						href={`/mission/${
							result.quiz.stage.mission.slug
						}?checkpointID=${getNextStage(
							result.quiz.stage.mission?.nextStage
						)}`}
					>
						<a className="block bg-ncrma-400 py-3 px-6 rounded">
							Proceed to next Stage
						</a>
					</Link>
				)}
			</div>
		</div>
	)
}

export default quizResult

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
		const quizResultID = ctx.query.quizResult
		const result = await getQuizResultByID(quizResultID)
		return {
			props: {
				result
			}
		}
	}
}
