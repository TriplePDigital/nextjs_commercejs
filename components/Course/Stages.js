/* eslint-disable no-unused-vars */
import Link from 'next/link'
import { AiOutlinePlayCircle, AiFillPlayCircle } from 'react-icons/ai'
import { MdOutlineQuiz } from 'react-icons/md'
import isVideo from '@/util/isVideo'
import { Loader } from '../util'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { duration } from 'moment'

const secondsToTime = (e) => {
	let h = Math.floor(e / 3600)
			.toString()
			.padStart(2, '0'),
		m = Math.floor((e % 3600) / 60)
			.toString()
			.padStart(2, '0'),
		s = Math.floor(e % 60)
			.toString()
			.padStart(2, '0')

	if (h === '00') {
		return `${m}:${s}`
	}

	return `${h}:${m}:${s}`
}

const getProgressForCheckpoint = (stageID, checkpointID, enrollment) => {
	const progress = enrollment.progress

	if (!progress) {
		return null
	} else {
		const res = progress.find(
			(progress) =>
				progress.content.parentStage === stageID &&
				progress.content._id === checkpointID
		)
		if (!res?.status) {
			return '0'
		} else {
			return res?.status
		}
	}
}

export default function Stages({
	enrollment,
	setStageContext,
	setCheckpointContext,
	setCurrentCheckpoint
}) {
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
							<h2 className="text-lg font-semibold leading-loose">
								{stage.title}
							</h2>
							<>
								{stage.checkpoints.map(
									(checkpoint, cntIndex) => {
										const durr = duration(
											checkpoint.type?.duration,
											'm'
										)._data
										return (
											<>
												<div
													className={`flex flex-row items-center justify-between w-full ${
														checkpoint.progress
															?.status === 100
															? 'opacity-25'
															: ''
													}`}
													key={cntIndex}
												>
													<Link
														href={
															checkpoint.instance ===
															'quiz'
																? `/quiz/${checkpoint._id}`
																: `/mission/${enrollment.course.slug}`
														}
													>
														<a
															className={`py-2 my-2 text-black rounded-lg flex items-center cursor-pointer w-2/3`}
															onClick={() => {
																if (
																	checkpoint.instance !==
																	'quiz'
																) {
																	setStageContext(
																		chIndex
																	)
																	setCheckpointContext(
																		cntIndex
																	)
																} else {
																	null
																}
															}}
														>
															<div className="text-4xl mr-4 text-ncrma-400 relative z-10">
																{isVideo(
																	checkpoint.type
																) ? (
																	<AiFillPlayCircle />
																) : (
																	<MdOutlineQuiz />
																)}
																<div className="bg-ncrma-800 w-full h-full absolute left-0 top-0 -z-10 rounded-full"></div>
															</div>
															{checkpoint.title}
														</a>
													</Link>
													<span className="text-sm text-gray-500 w-1/6">
														{`${getProgressForCheckpoint(
															stage._id,
															checkpoint._id,
															enrollment
														)}%`}
													</span>
													<span className="text-sm text-gray-500 w-1/6">
														{isVideo(
															checkpoint.type
														)
															? `${
																	durr.hours >
																	0
																		? `${durr.hours}:`
																		: ''
															  }
															  ${durr.minutes > 0 ? `${durr.minutes}:` : '00'}
															  ${durr.seconds > 0 ? durr.seconds : '00'}`
															: null}
													</span>
												</div>
											</>
										)
									}
								)}
							</>
						</div>
					)
				})}
			</ul>
		</>
	)
}
