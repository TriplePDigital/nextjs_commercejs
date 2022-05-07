import { getSession, options } from 'next-auth/client'
import getMissionBySlug from '@/util/getMissionBySlug'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'
import { Loader } from '@/components/util'
import Image from 'next/image'
import imgConstructor, { configuredSanityClient as client } from '@/util/img'
import Stages from '@/components/Course/Stages'
import isVideo from '@/util/isVideo'

const getLatestProgress = (stages) => {
	let progress = []
	stages.filter((stage) => {
		stage.checkpoints.map((checkpoint) => {
			progress.push(checkpoint.progress?.status || 0)
		})
	})
	return progress
}

/**
 * Gets the user's profile document based on email address from Sanity
 * @param string the email address that the query is executed against
 * @returns user's profile document
 */
const getUserProfile = async (email) => {
	try {
		const user = await client.fetch(
			`*[_type == 'user' && email == '${email}']{_id}[0]`
		)

		return user
	} catch (error) {
		throw new Error(error)
	}
}

/**
 * Gets a single activity document that references a specific checkpoint and user
 * @param object the checkpoint document that we want to get the reference to
 * @param object the user's profile document that we want to get the reference to
 * @returns an activity document if one exists, otherwise null
 */
const getCheckpointProgress = async (checkpoint, user) => {
	try {
		const activity = await client.fetch(
			`*[_type == "activity" && references($checkpointID) && references($userID)]{...}[0]`,
			{ checkpointID: checkpoint._id, userID: user._id }
		)

		return activity
	} catch (error) {
		throw new Error(error)
	}
}

function MissionSlug({ session, mission }) {
	const stageProgress = getLatestProgress(mission.stages)
	const max = Math.max(...stageProgress)
	const indexOfMax = stageProgress.indexOf(max)

	const videoRef = useRef(null)

	const [loading, setLoading] = useState(false)
	const [timerOffset, setTimerOffset] = useState(0)
	const [previousTimer, setPreviousTimer] = useState(0)
	const [stageContext, setStageContext] = useState(0)
	const [checkpointContext, setCheckpointContext] = useState(indexOfMax)
	const [currentCheckpoint, setCurrentCheckpoint] = useState(
		mission.stages[stageContext].checkpoints[checkpointContext]
	)
	const [intervalID, setIntervalID] = useState(null)

	useEffect(() => {
		setCurrentCheckpoint(
			mission.stages[stageContext].checkpoints[checkpointContext]
		)

		setLoading(false)
	}, [stageContext, checkpointContext])

	const router = useRouter()

	if (!session) {
		router.push('/auth/login')
	}

	const updateProgress = async (checkpoint) => {
		let currProgress = Math.floor(
			((await videoRef.current.getCurrentTime()) /
				(await videoRef.current.getDuration())) *
				100
		)
		if (timerOffset === 10) {
			setPreviousTimer(timerOffset)
		}
		if (timerOffset - previousTimer === 0) {
			setTimerOffset(0)
			const usrID = await getUserProfile(session.user.email)
			const checkpointProgress = await getCheckpointProgress(
				checkpoint,
				usrID
			)
			let res
			if (!checkpointProgress) {
				res = await client.create({
					_type: 'activity',
					content: {
						_type: 'reference',
						_ref: checkpoint._id
					},
					user: {
						_type: 'reference',
						_ref: usrID._id
					},
					progress: currProgress
				})
				console.warn(
					'There was no existing activity documents for the current user given the current checkpoint: ',
					res
				)
			} else {
				if (
					checkpointProgress.progress < currProgress &&
					currProgress - checkpointProgress.progress > 10
				) {
					try {
						let id = setInterval(async () => {
							res = await client
								.patch(checkpointProgress._id)
								.set({ progress: currProgress })
								.commit()

							console.warn('Updated the users activity: ', res)
						}, 10000)
						setIntervalID(id)
					} catch (error) {
						throw new Error(error)
					}
				}
			}
		}
		setTimerOffset(timerOffset++)
	}

	const setCheckpointComplete = async (checkpoint) => {
		try {
			// let existingDoc = await client.fetch(
			// 	`*[_type == "activity" && references($id)]{...}[0]`,
			// 	{ id: checkpoint._id }
			// )
			// if (existingDoc) {
			// 	let res = await client
			// 		.patch(existingDoc._id)
			// 		.set({ progress: { status: 100 } })
			// 		.commit()
			// 	console.log(res)
			// }
		} catch (error) {
			throw new Error(error)
		}
	}

	return loading ? (
		<Loader />
	) : (
		<div className="flex flex-row">
			<div className="w-9/12 bg-gray-100 shadow-md border px-4 py-6 mt-6 mx-2 ml-0 rounded">
				<>
					<div className={`aspect-video h-auto w-full`}>
						<ReactPlayer
							url={currentCheckpoint.type?.url}
							config={{
								vimeo: {
									playerOptions: {
										byline: false,
										pip: true,
										title: false,
										controls: true,
										fallback: null
									}
								}
							}}
							width="100%"
							height="100%"
							onProgress={() => updateProgress(currentCheckpoint)}
							onEnded={setCheckpointComplete(currentCheckpoint)}
							onPause={clearInterval(intervalID)}
							onSeek={clearInterval(intervalID)}
							ref={videoRef}
						/>
					</div>
					<div className="flex items-center my-6">
						<a className="flex items-center mx-4 first:ml-0">
							<div className="h-10 w-10 rounded-full overflow-hidden mr-2 relative">
								{currentCheckpoint.type?.instructor ? (
									<>
										<Image
											{...imgConstructor(
												currentCheckpoint.type
													?.instructor.avatar.asset,
												{
													fit: 'fill'
												}
											)}
											alt="Instructor Avatar"
											layout="fill"
											quality={50}
										/>
										<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>{' '}
									</>
								) : null}
							</div>
							<span className="font-semibold leading-loose text-lg">
								{currentCheckpoint.type?.instructor.name}
							</span>
						</a>
					</div>
					<div className="flex flex-row">
						{currentCheckpoint.type?.body}
					</div>
				</>
			</div>
			<Stages
				mission={mission}
				stages={mission.stages}
				title={mission.title}
				setCheckpointContext={setCheckpointContext}
				setStageContext={setStageContext}
				setCurrentCheckpoint={setCurrentCheckpoint}
			/>
		</div>
	)
}

export default MissionSlug

export async function getServerSideProps(ctx) {
	const session = await getSession(ctx)
	const mission = await getMissionBySlug(ctx.params.slug)

	return {
		props: {
			session,
			mission
		}
	}
}
