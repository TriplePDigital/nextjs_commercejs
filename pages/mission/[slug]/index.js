import { getSession } from 'next-auth/client'
import getMissionBySlug from '@/util/getMissionBySlug'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'
import { Loader } from '@/components/util'
import Image from 'next/image'
import imgConstructor from '@/util/img'
import Stages from '@/components/Course/Stages'
import Quiz from '@/components/Lesson/Quiz'
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

function MissionSlug({ session, mission }) {
	const stageProgress = getLatestProgress(mission.stages)
	const max = Math.max(...stageProgress)
	const indexOfMax = stageProgress.indexOf(max)

	const videoRef = useRef(null)

	const [loading, setLoading] = useState(false)
	const [stageContext, setStageContext] = useState(0)
	const [checkpointContext, setCheckpointContext] = useState(indexOfMax)
	const [currentCheckpoint, setCurrentCheckpoint] = useState(
		mission.stages[stageContext].checkpoints[checkpointContext]
	)
	const [currentIntervalID, setCurrentIntervalID] = useState(null)

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
		let id = setInterval(
			console.log(
				Math.floor(
					((await videoRef.current.getCurrentTime()) /
						(await videoRef.current.getDuration())) *
						100
				)
			),
			10000
		)
		setCurrentIntervalID(id)
	}

	return loading ? (
		<Loader />
	) : (
		<div className="flex flex-row">
			<div className="w-9/12 bg-gray-100 shadow-md border px-4 py-6 mt-6 mx-2 ml-0 rounded">
				{isVideo(currentCheckpoint.type) ? (
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
								onProgress={() => {
									updateProgress(currentCheckpoint)
								}}
								onPause={clearInterval(currentIntervalID)}
								onSeek={clearInterval(currentIntervalID)}
								onEnded={clearInterval(currentIntervalID)}
								ref={videoRef}
							/>
						</div>
						<div className="flex items-center my-6">
							<a className="flex items-center mx-4 first:ml-0">
								<div className="h-10 w-10 rounded-full overflow-hidden mr-2 relative">
									<Image
										{...imgConstructor(
											currentCheckpoint.type?.instructor
												.avatar.asset
										)}
										alt="Instructor Avatar"
										layout="fill"
										objectFit="cover"
										objectPosition="center"
										quality={50}
										placeholder="blur"
									/>
									<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
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
				) : (
					<Quiz />
				)}
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
