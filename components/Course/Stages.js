/* eslint-disable no-unused-vars */
import Link from 'next/link'
import { AiOutlinePlayCircle, AiFillPlayCircle, AiFillCheckCircle } from 'react-icons/ai'
import { MdOutlineQuiz } from 'react-icons/md'
import isVideo from '@/util/isVideo'
import moment from 'moment'

const getProgressForCheckpoint = (stageID, checkpointID, enrollment) => {
	const progress = enrollment.progress

	if (!progress) {
		return null
	} else {
		const res = progress.find((progress) => progress.content.parentStage === stageID && progress.content._id === checkpointID)
		if (!res?.status) {
			return '0'
		} else {
			return Number.parseFloat(res.status).toFixed(2)
		}
	}
}

const findQuizResult = (quizAttempts, quizID) => {
	if (!quizAttempts) {
		return null
	} else {
		const res = quizAttempts.find((attempt) => attempt.quizID === quizID)
		if (res) {
			return res.score
		}
	}
}

export default function Stages({ enrollment, setStageContext, setCheckpointContext, setCurrentCheckpoint }) {
	return (
		<>
			<ul className="w-3/12 px-4 py-6 mt-6 mx-2 mr-0">
				<h1 className="font-bold text-lg">{enrollment.course.title}</h1>

				{enrollment.course.stages.map((stage, chIndex) => {
					return (
						<div
							className="bg-gray-100 shadow-md border rounded p-5 my-4"
							key={chIndex}
						>
							<h2 className="text-lg font-semibold leading-loose">{stage.title}</h2>
							<>
								{stage.checkpoints.map((checkpoint, cntIndex) => {
									return (
										<>
											<div
												className={`flex flex-row items-center justify-between w-full ${getProgressForCheckpoint(stage._id, checkpoint._id, enrollment) === 100 ? 'opacity-25 line-through' : ''}`}
												key={cntIndex}
											>
												<Link href={checkpoint.instance === 'quiz' ? `/quiz/${checkpoint._id}` : `/mission/${enrollment.course.slug}`}>
													<a
														className={`py-2 my-2 text-black rounded-lg flex items-center cursor-pointer w-2/3`}
														onClick={() => {
															if (checkpoint.instance !== 'quiz') {
																setStageContext(chIndex)
																setCheckpointContext(cntIndex)
															} else {
																null
															}
														}}
													>
														<div className="text-4xl mr-4 text-ncrma-400 relative z-10">
															{getProgressForCheckpoint(stage._id, checkpoint._id, enrollment) === 100 ? <AiFillCheckCircle /> : isVideo(checkpoint.type) ? <AiFillPlayCircle /> : <MdOutlineQuiz />}
															<div className="bg-ncrma-800 w-full h-full absolute left-0 top-0 -z-10 rounded-full"></div>
														</div>
														{checkpoint.title}
													</a>
												</Link>
												<span className="text-sm text-gray-500 w-1/6">{`${getProgressForCheckpoint(stage._id, checkpoint._id, enrollment)}%`}</span>
												<span className="text-sm text-gray-500 w-1/6">{isVideo(checkpoint.type) ? `${moment.utc(checkpoint.type?.duration * 1000).format('HH:mm:ss')}` : null}</span>
											</div>
										</>
									)
								})}
							</>
						</div>
					)
				})}
			</ul>
		</>
	)
}
