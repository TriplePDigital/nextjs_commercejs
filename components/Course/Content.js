import { useContext, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player/vimeo'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/util/config'
import { MdReplay } from 'react-icons/md'
import { AiFillCaretRight } from 'react-icons/ai'
import ReactMarkdown from 'react-markdown'
import mdConfig from '@/util/md'
import { useRouter } from 'next/router'
import { Loader } from '../util'
import { useNextSanityImage } from 'next-sanity-image'
import { UserContext } from '../../pages/_app'

// TODO: https://cdn.dribbble.com/users/1008889/screenshots/17247195/media/e8e6ae59a1569f0b3370c1c2d4a29ba0.png

/**
 * Gets a single progress document that references a specific checkpoint and user
 * @returns an progress document if one exists, otherwise null
 * @param checkpointID
 * @param enrollmentID
 */
const getCheckpointProgress = async (checkpointID, enrollmentID) => {
	try {
		return await client.fetch(`*[_type == "progress" && references($checkpointID) && references($enrollmentID)]{...}[0]`, { checkpointID: checkpointID, enrollmentID: enrollmentID })
	} catch (error) {
		throw new Error(error)
	}
}

export default function Content({ currentCheckpoint, enrollment, setCheckpointContext, setStageContext }) {
	const { user } = useContext(UserContext)
	const videoRef = useRef(null)
	const [videoEnded, setVideoEnded] = useState(false)
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	const slug = router.query.slug
	const imageProps = useNextSanityImage(client, currentCheckpoint.type?.instructor.avatar)

	const getCurrentProgress = async () => {
		return Math.floor(((await videoRef.current.getCurrentTime()) / videoRef.current.getDuration()) * 100)
	}

	const createProgress = async (checkpoint) => {
		let currProgress = await getCurrentProgress()
		const checkpointProgress = await getCheckpointProgress(checkpoint._id, enrollment._id)
		if (!checkpointProgress) {
			const res = await client.create({
				_type: 'progress',
				content: {
					_type: 'reference',
					_ref: checkpoint._id
				},
				enrollment: {
					_type: 'reference',
					_ref: enrollment._id
				},
				status: currProgress
			})
			console.warn('There was no existing activity documents for the current user given the current checkpoint: ', res)
		} else {
			console.warn('There was already an existing document for the current checkpoint.')
		}
	}

	const updateProgress = async (checkpoint) => {
		let currProgress = await getCurrentProgress()
		if (currProgress === 50 || currProgress === 95) {
			const checkpointProgress = await getCheckpointProgress(checkpoint._id, enrollment._id)
			if (currProgress > checkpointProgress.status) {
				try {
					let res = await client
						.patch(checkpointProgress._id)
						.set({ status: currProgress === 95 ? 100 : currProgress })
						.commit()
					console.warn('Updated the users activity: ', res)
				} catch (error) {
					throw new Error(error)
				}
			}
		}
	}

	const findNextVideo = () => {
		const MAX_STAGE = enrollment.course.stages.length - 1
		const stageIndex = enrollment.course.stages.findIndex((stage) => stage._id === currentCheckpoint.currentStage)
		const MAX_CHECKPOINT = enrollment.course.stages[stageIndex].checkpoints.length - 1
		const checkpointIndex = enrollment.course.stages[stageIndex]?.checkpoints.findIndex((checkpoint) => checkpoint._id === currentCheckpoint._id)
		let obj
		if (checkpointIndex === enrollment.course.stages[stageIndex].checkpoints.length - 1 && stageIndex < MAX_STAGE) {
			obj = {
				stageIndex: stageIndex + 1,
				checkpointIndex: 0
			}
		} else if (
			(enrollment.course.stages[stageIndex]?.checkpoints.length > 1 && enrollment.course.stages[stageIndex]?.checkpoints[checkpointIndex + 1].instance === 'quiz') ||
			(enrollment.course.stages[stageIndex + 1]?.checkpoints.length === 1 && enrollment.course.stages[stageIndex + 1]?.checkpoints[0].instance === 'quiz')
		) {
			obj = {
				stageIndex: 'quiz',
				checkpointIndex: 'quiz',
				checkpointID: enrollment.course.stages[stageIndex]?.checkpoints[checkpointIndex + 1]._id
			}
		} else if (stageIndex === MAX_STAGE && checkpointIndex === MAX_CHECKPOINT) {
			obj = {
				stageIndex: null,
				checkpointIndex: null
			}
		}
		return obj
	}

	useEffect(() => {
		if (currentCheckpoint.instance === 'quiz') {
			router.push(`/quiz/${currentCheckpoint._id}`, undefined, { shallow: true }).then(() => {
				setLoading(false)
			})
		}
		if (currentCheckpoint.instance === 'video' && currentCheckpoint.type?.vimeoVideo) {
			setLoading(false)
		}
	}, [currentCheckpoint, router])

	return loading ? (
		<Loader />
	) : (
		<div className="w-9/12 bg-gray-100 shadow-md border px-4 py-6 mt-6 mx-2 ml-0 rounded">
			<>
				<div className={`aspect-video h-auto w-full relative`}>
					{videoEnded ? (
						<div className="h-full">
							<div className="w-full h-full flex justify-evenly items-center">
								<button
									className="z-10 rounded-lg uppercase bg-orange-200 px-6 py-2 font-medium text-gray-500 text-2xl flex items-center justify-center gap-2"
									onClick={() => {
										setVideoEnded(false)
									}}
								>
									<MdReplay
										className="opacity-50"
										size={28}
									/>
									Replay Video
								</button>

								{findNextVideo().stageIndex !== null && findNextVideo().checkpointIndex !== null ? (
									<button
										className="z-10 rounded-lg uppercase bg-orange-400 px-6 py-2 font-semibold text-white text-2xl flex items-center justify-center gap-2"
										onClick={() => {
											const next = findNextVideo()
											if (next.checkpointIndex === null || next.stageIndex === null) {
												return
											}
											if (next.stageIndex === 'quiz' && next.checkpointIndex === 'quiz') {
												router.push(`/quiz/${next.checkpointID}`)
											} else {
												setCheckpointContext(next.checkpointIndex)
												setStageContext(next.stageIndex)
												setVideoEnded(false)
											}
										}}
									>
										Next Lesson
										<AiFillCaretRight
											className="opacity-50"
											size={28}
										/>
									</button>
								) : (
									<Link href={`/user/student/${user?._id}/achievements/${slug}`}>
										<a className="z-10 rounded-lg uppercase bg-orange-400 px-6 py-2 font-semibold text-white text-2xl flex items-center justify-center gap-2">
											Finish Course
											<AiFillCaretRight
												className="opacity-50"
												size={28}
											/>
										</a>
									</Link>
								)}
							</div>
							<div className="-z-[1]">
								<Image
									src={currentCheckpoint.type?.vimeoVideo.oEmbedData.thumbnail_url}
									alt="Video has ended and the thumbnail of the video is shown"
									layout="fill"
								/>
							</div>
							<div className="bg-ncrma-400 opacity-75 absolute top-0 left-0 w-full h-full -z-0"></div>
						</div>
					) : (
						<ReactPlayer
							url={currentCheckpoint.type?.vimeoVideo.url}
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
							onEnded={() => {
								updateProgress(currentCheckpoint).then(() => setVideoEnded(true))
							}}
							onProgress={() => updateProgress(currentCheckpoint)}
							onStart={() => createProgress(currentCheckpoint)}
							ref={videoRef}
						/>
					)}
				</div>
				<div className="flex items-center my-6">
					<Link
						href={`/user/instructor/${currentCheckpoint.type?.instructor._id}`}
						passHref={false}
					>
						<a>
							<div className="flex items-center mx-4 first:ml-0 cursor-pointer">
								<div className="h-10 w-10 rounded-full overflow-hidden mr-2 relative">
									{currentCheckpoint.type?.instructor && (
										<>
											<Image
												src={imageProps.src}
												loader={imageProps.loader}
												blurDataURL={imageProps.blurDataURL}
												layout="fill"
												objectFit="cover"
												objectPosition="center"
												alt="Instructor Avatar"
												quality={50}
											/>
											<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
										</>
									)}
								</div>
								<div className="flex-col flex gap-0 justify-center">
									<span className="font-semibold tracking-wide text-lg underline cursor-pointer hover:text-gray-600">{currentCheckpoint.type?.instructor.name}</span>
									<span className="text-sm text-gray-400">{currentCheckpoint.type?.instructor.email}</span>
								</div>
							</div>
						</a>
					</Link>
				</div>
				<div>
					<div className="font-light text-gray-500">
						<ReactMarkdown
							components={mdConfig}
							className="my-2"
						>
							{currentCheckpoint.type?.body}
						</ReactMarkdown>
					</div>
				</div>
				<div className="flex flex-col">
					<div className="flex justify-between items-center bg-gray-200 rounded text-center mb-5">
						<span className="px-6 py-4 border-r-2 border-gray-300 w-full">Supporting Files</span>
						<span className="px-6 py-4 border-r-2 border-gray-300 w-full">Discussion</span>
						<span className="px-6 py-4 border-r-2 border-gray-300 w-full">Reviews</span>
						<span className="px-6 py-4 w-full">More from {currentCheckpoint.type?.instructor.name}</span>
					</div>
				</div>
			</>
		</div>
	)
}
