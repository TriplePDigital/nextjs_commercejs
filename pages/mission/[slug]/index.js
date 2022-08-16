/* eslint-disable no-unused-vars */
import { getSession, options } from 'next-auth/client'
import getMissionBySlug from '@/util/getMissionBySlug'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Loader } from '@/components/util'
import Image from 'next/image'
import imgConstructor from '@/util/img'
import Stages from '@/components/Course/Stages'
import getUserFromSession from '@/util/getUserFromSession'
import getEnrollmentByStudentIDandCourseID from '@/util/getEnrollmentByStudentIDandCourseID'
import { MdOutlineAssignment } from 'react-icons/md'
import { AiFillStar, AiOutlineClockCircle } from 'react-icons/ai'
import { RiBook2Line } from 'react-icons/ri'
import ReactMarkdown from 'react-markdown'
import mdConfig from '@/util/md'
import Content from '@/components/Course/Content'
import moment from 'moment'

// const getLatestProgress = (stages) => {
// 	let progress = []
// 	stages.filter((stage) => {
// 		stage.checkpoints.map((checkpoint) => {
// 			progress.push(checkpoint.progress?.status || 0)
// 		})
// 	})
// 	return progress
// }

function MissionSlug({ session, mission, user, enrollment }) {
	// const stageProgress = getLatestProgress(mission.stages)
	// const max = Math.max(...stageProgress)
	// const indexOfMax = stageProgress.indexOf(max)

	const [loading, setLoading] = useState(false)
	const [stageContext, setStageContext] = useState(0)
	const [checkpointContext, setCheckpointContext] = useState(0)
	const [currentCheckpoint, setCurrentCheckpoint] = useState(enrollment ? enrollment.course.stages[stageContext].checkpoints[checkpointContext] : null)

	const [numberOfCheckpoints, setNumberOfCheckpoints] = useState(0)
	const [courseDuration, setCourseDuration] = useState(0)

	const router = useRouter()
	const checkpointIDQuery = router.query?.checkpointID
	const stageIDQuery = router.query?.stageID

	useEffect(() => {
		setLoading(true)
		setCurrentCheckpoint(enrollment ? enrollment.course.stages[stageContext].checkpoints[checkpointContext] : null)
		skipToCheckpoint(checkpointIDQuery)
		skipToStage(stageIDQuery)
		countNumberOfCheckpoints(mission.stages)
		countCourseDuration(mission.stages)
		return () =>
			function cleanup() {
				return
			}
	}, [stageContext, checkpointContext, enrollment])

	const skipToStage = (stageID) => {
		if (stageID) {
			const stageIndex = enrollment.course.stages.findIndex((stage) => {
				return stage._id === stageID
			})
			setStageContext(stageIndex)
			setCheckpointContext(0)
		}
		setLoading(false)
	}

	const skipToCheckpoint = (checkpointID) => {
		if (checkpointID) {
			const stageIndex = enrollment.course.stages.map((stage, stageIndex) => {
				const checkpointIndex = stage.checkpoints.find((checkpoint) => {
					return checkpoint._id === checkpointID
				})
				const checkpointQueryIndex = stage.checkpoints.findIndex((check) => check._id === checkpointID)
				return { checkpointIndex, stageIndex, checkpointQueryIndex }
			})
			const chosenStage = stageIndex.find((stage) => {
				return stage.checkpointIndex !== undefined
			})
			setStageContext(chosenStage.stageIndex)
			setCheckpointContext(chosenStage.checkpointQueryIndex)
		}
		setLoading(false)
	}

	const countNumberOfCheckpoints = (stages) => {
		let count = 0
		stages.map((stage) => {
			stage.checkpoints.map(() => {
				count++
			})
		})
		setNumberOfCheckpoints(count)
	}

	const countCourseDuration = (stages) => {
		let count = 0
		stages.map((stage) => {
			stage.checkpoints.map((checkpoint) => {
				count += checkpoint.type.duration
			})
		})
		setCourseDuration(moment.utc(count * 1000).format('HH:mm:ss'))
	}

	return loading ? (
		<Loader />
	) : enrollment ? (
		<div className="flex flex-row">
			<Content
				currentCheckpoint={currentCheckpoint}
				enrollment={enrollment}
				setCheckpointContext={setCheckpointContext}
				setStageContext={setStageContext}
			/>
			<Stages
				enrollment={enrollment}
				setCheckpointContext={setCheckpointContext}
				setStageContext={setStageContext}
				setCurrentCheckpoint={setCurrentCheckpoint}
			/>
		</div>
	) : (
		<div className="flex mx-auto w-full my-3">
			<div className="w-8/12 mr-8">
				<h1 className="text-4xl tracking-wide font-bold">{mission.title}</h1>
				<h2 className="text-lg font-medium text-gray-600">{mission.blurb}</h2>
				<div className="flex justify-between items-center">
					<div className=" flex items-center">
						<AiFillStar className="text-yellow-500 mr-2" />
						<span className="text-lg font-semibold mr-1">{5}.0</span>
						<span className="text-gray-500">(1512 Reviews)</span>
					</div>
					<div className="text-gray-500 flex items-center gap-1">
						<RiBook2Line className="" />
						<span className="font-medium">Lessons</span>
						{mission.stages?.length}
					</div>
					<div className="text-gray-500 flex items-center gap-1">
						<MdOutlineAssignment />
						<span className="font-medium">Chapters</span>
						{numberOfCheckpoints}
					</div>
					<div className="text-gray-500 flex items-center gap-1">
						<AiOutlineClockCircle />
						{courseDuration}
					</div>
				</div>
				<div className="relative h-full w-full mt-6">
					{/* TODO: Either show cover image or preview video if available */}
					<Image
						{...imgConstructor(mission.coverImage, {
							fit: 'fill'
						})}
						alt={mission.title}
						objectFit="cover"
						objectPosition="center"
						quality={50}
					/>
				</div>
				<h2 className="text-xl leading-loose tracking-wide font-bold mb-1 mt-6">About The Instructors</h2>
				<div className="flex flex-row items-center justify-between mt-6">
					{mission.instructors.map((instructor, index) => {
						return (
							<div
								key={index}
								className="flex flex-col"
							>
								<div className="flex items-center gap-4">
									<div className="relative w-14 h-14 rounded-full overflow-hidden">
										<Image
											{...imgConstructor(instructor.avatar, {
												fit: 'fill'
											})}
											placeholder="blur"
											alt="the instructors avatar image in the shape of a circle"
										/>
										<div className="rounded-full absolute top-0 left-0 h-full w-full bg-ncrma-500 opacity-40"></div>
									</div>
									<div className="flex flex-col gap-1 text-sm text-gray-700">
										<span className="block font-medium">{instructor.name}</span>
										<span className="block underline lowercase">{instructor.email}</span>
									</div>
								</div>
								<ReactMarkdown
									components={mdConfig}
									className="my-2"
								>
									{instructor.bio}
								</ReactMarkdown>
							</div>
						)
					})}
				</div>
				<h2 className="text-xl leading-loose tracking-wide font-bold mb-1 mt-6">About This Course</h2>
				<ReactMarkdown components={mdConfig}>{mission?.description}</ReactMarkdown>
				<ul className="mt-2 flex">{/* TODO: This is where we are going to create the course accordion */}</ul>
			</div>
			<div className="w-4/12 p-5 bg-white border-l border-gray-200 flex flex-col gap-3">
				{/* TODO: Add ability to give feedback on courses before tackling this... */}
				{/* <div className="text-gray-500 flex items-center gap-4">
					<BsTagsFill className="mr-1" />
					<div className="gap-2 flex">
						{mission.categories.map((category, index) => {
							return (
								<span
									key={index}
									className="px-4 py-1 rounded-full bg-ncrma-600 hover:bg-ncrma-800 hover:shadow cursor-pointer block text-sm text-white"
								>
									{category}
								</span>
							)
						})}
					</div>
				</div> */}
				<button className="bg-ncrma-400 hover:bg-ncrma-600 text-white uppercase font-medium rounded w-1/2 mx-auto px-4 py-3">Coming Soon!</button>
			</div>
		</div>
	)
}

export default MissionSlug

export async function getServerSideProps(ctx) {
	const session = await getSession(ctx)
	if (!session) {
		return {
			redirect: {
				destination: `/auth/login?callbackUrl=${process.env.NEXT_PUBLIC_CALLBACK_BASE_URL}welcome`,
				permanent: false
			}
		}
	}
	const user = await getUserFromSession(session?.user?.email)
	const mission = await getMissionBySlug(ctx.params.slug)
	try {
		const enrollment = await getEnrollmentByStudentIDandCourseID(user._id, mission._id)
		return {
			props: {
				session,
				mission,
				user,
				enrollment
			}
		}
	} catch (error) {
		return {
			props: {
				session,
				mission,
				user,
				enrollment: null
			}
		}
	}
}
