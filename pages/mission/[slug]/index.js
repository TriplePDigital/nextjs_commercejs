/* eslint-disable no-unused-vars */
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
import getUserFromSession from '@/util/getUserFromSession'
import getEnrollmentByStudentIDandCourseID from '@/util/getEnrollmentByStudentIDandCourseID'
import { MdOutlineAssignment } from 'react-icons/md'
import { AiFillStar, AiOutlineClockCircle } from 'react-icons/ai'
import { FaBook } from 'react-icons/fa'
import { BsTagsFill } from 'react-icons/bs'
import { RiBook2Line, RiDoubleQuotesL } from 'react-icons/ri'
import ReactMarkdown from 'react-markdown'
import mdConfig from '@/util/md'
import Link from 'next/link'

// const getLatestProgress = (stages) => {
// 	let progress = []
// 	stages.filter((stage) => {
// 		stage.checkpoints.map((checkpoint) => {
// 			progress.push(checkpoint.progress?.status || 0)
// 		})
// 	})
// 	return progress
// }

/**
 * Gets a single progress document that references a specific checkpoint and user
 * @param object the checkpoint ID that we want to get the reference to
 * @param object the user's ID that we want to get the reference to
 * @returns an progress document if one exists, otherwise null
 */
const getCheckpointProgress = async (checkpointID, enrollmentID) => {
	try {
		return await client.fetch(
			`*[_type == "progress" && references($checkpointID) && references($enrollmentID)]{...}[0]`,
			{ checkpointID: checkpointID, enrollmentID: enrollmentID }
		)
	} catch (error) {
		throw new Error(error)
	}
}

function MissionSlug({ session, mission, user, enrollment }) {
	// const stageProgress = getLatestProgress(mission.stages)
	// const max = Math.max(...stageProgress)
	// const indexOfMax = stageProgress.indexOf(max)

	const videoRef = useRef(null)

	const [loading, setLoading] = useState(false)
	const [stageContext, setStageContext] = useState(0)
	const [checkpointContext, setCheckpointContext] = useState(0)
	const [currentCheckpoint, setCurrentCheckpoint] = useState(
		enrollment
			? enrollment.course.stages[stageContext].checkpoints[
					checkpointContext
			  ]
			: null
	)

	useEffect(() => {
		setCurrentCheckpoint(
			enrollment
				? enrollment.course.stages[stageContext].checkpoints[
						checkpointContext
				  ]
				: null
		)

		setLoading(false)
		return () => {}
	}, [stageContext, checkpointContext, videoRef, enrollment])

	const router = useRouter()

	if (!session) {
		router.push('/auth/login')
	}

	const getCurrentProgress = async () => {
		return Math.floor(
			((await videoRef.current.getCurrentTime()) /
				(await videoRef.current.getDuration())) *
				100
		)
	}

	const createProgress = async (checkpoint) => {
		let currProgress = await getCurrentProgress()
		const checkpointProgress = await getCheckpointProgress(
			checkpoint._id,
			enrollment._id
		)
		console.log(checkpointProgress)
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
			console.warn(
				'There was no existing activity documents for the current user given the current checkpoint: ',
				res
			)
		} else {
			console.warn(
				'There was already an existing document for the current checkpoint.'
			)
		}
	}

	const updateProgress = async (checkpoint) => {
		let currProgress = await getCurrentProgress()
		if (currProgress >= 85) {
			const checkpointProgress = await getCheckpointProgress(
				checkpoint._id,
				enrollment._id
			)
			if (currProgress > checkpointProgress.status) {
				try {
					let res = await client
						.patch(checkpointProgress._id)
						.set({ status: currProgress })
						.commit()
					console.warn('Updated the users activity: ', res)
				} catch (error) {
					throw new Error(error)
				}
			}
		}
	}
	return loading ? (
		<Loader />
	) : enrollment ? (
		<div className="flex flex-row">
			<div className="w-9/12 bg-gray-100 shadow-md border px-4 py-6 mt-6 mx-2 ml-0 rounded">
				<>
					<div className={`aspect-video h-auto w-full`}>
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
							onEnded={() => updateProgress(currentCheckpoint)}
							onProgress={() => updateProgress(currentCheckpoint)}
							onStart={() => createProgress(currentCheckpoint)}
							ref={videoRef}
						/>
					</div>
					<div className="flex items-center my-6">
						<Link
							href={`/user/instructor/${currentCheckpoint.type?.instructor._id}`}
							passHref
						>
							<div className="flex items-center mx-4 first:ml-0">
								<div className="h-10 w-10 rounded-full overflow-hidden mr-2 relative">
									{currentCheckpoint.type?.instructor ? (
										<>
											<Image
												{...imgConstructor(
													currentCheckpoint.type
														?.instructor.avatar,
													{
														fit: 'fill'
													}
												)}
												alt="Instructor Avatar"
												layout="fill"
												quality={50}
											/>
											<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
										</>
									) : null}
								</div>
								<span className="font-semibold leading-loose text-lg">
									{currentCheckpoint.type?.instructor.name}
								</span>
							</div>
						</Link>
					</div>
					<div>
						<div className="font-semibold text-lg">
							{currentCheckpoint.type?.title}
						</div>
						<div className="font-light text-gray-500">
							{currentCheckpoint.type?.body}
						</div>
					</div>
					<div className="flex flex-col">
						<div className="flex justify-between items-center bg-gray-200 rounded text-center mb-5">
							<span className="px-6 py-4 border-r-2 border-gray-300 w-full">
								Supporting Files
							</span>
							<span className="px-6 py-4 border-r-2 border-gray-300 w-full">
								Discussion
							</span>
							<span className="px-6 py-4 border-r-2 border-gray-300 w-full">
								Reviews
							</span>
							<span className="px-6 py-4 w-full">
								More from{' '}
								{currentCheckpoint.type?.instructor.name}
							</span>
						</div>
					</div>
				</>
			</div>
			<Stages
				enrollment={enrollment}
				setCheckpointContext={setCheckpointContext}
				setStageContext={setStageContext}
				setCurrentCheckpoint={setCurrentCheckpoint}
			/>
		</div>
	) : (
		<div className="flex mx-auto w-full">
			<div className="w-8/12 mr-8">
				<h1 className="text-4xl leading-loose tracking-wide font-bold">
					{mission.title}
				</h1>
				<h2 className="text-lg leading-loose tracking-wide font-medium text-gray-600">
					{mission.blurb}
				</h2>
				<ul className="mt-2 flex">
					{/* TODO: This is where we are going to create the course accordion */}
				</ul>
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
				<h2 className="text-xl leading-loose tracking-wide font-bold mb-1 mt-6">
					About The Instructors
				</h2>
				<div className="flex flex-row items-center justify-between mt-6">
					{mission.instructors.map((instructor, index) => {
						console.log(instructor)
						return (
							<div key={index} className="flex flex-col">
								<div className="flex items-center gap-4">
									<div className="relative w-14 h-14 rounded-full overflow-hidden">
										<Image
											{...imgConstructor(
												instructor.avatar,
												{
													fit: 'fill'
												}
											)}
											placeholder="blur"
											alt="the instructors avatar image in the shape of a circle"
										/>
										<div className="rounded-full absolute top-0 left-0 h-full w-full bg-ncrma-500 opacity-40"></div>
									</div>
									<div className="flex flex-col gap-1 text-sm text-gray-700">
										<span className="block font-medium">
											{instructor.name}
										</span>
										<span className="block underline lowercase">
											{instructor.email}
										</span>
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
				<h2 className="text-xl leading-loose tracking-wide font-bold mb-1 mt-6">
					About This Course
				</h2>
				<ReactMarkdown components={mdConfig}>
					{mission?.description}
				</ReactMarkdown>
			</div>
			<div className="w-4/12 p-5 bg-white border-l border-gray-200 flex flex-col gap-3">
				{/* TODO: Add ability to give feedback on courses before tackling this... */}
				{/* <div className=" flex items-center">
					<AiFillStar className="text-yellow-500 mr-2" />
					<span className="text-lg font-semibold mr-1">{5}.0</span>
					<span className="text-gray-500">(1512 Reviews)</span>
				</div> */}
				<div className="text-gray-500 flex items-center gap-4">
					<RiBook2Line className="mr-1" />
					<div className="flex flex-col">
						<span className="font-medium">Lessons</span>
						<ol className="list-decimal">
							{mission.stages.map((stage, index) => {
								return (
									<li
										key={index}
										className="text-sm text-gray-800 ml-6"
									>
										{stage.title}
									</li>
								)
							})}
						</ol>
					</div>
				</div>
				<div className="text-gray-500 flex items-center gap-4">
					<MdOutlineAssignment className="mr-1" />
					<div className="flex flex-col">
						<span className="font-medium">Chapters</span>
						<ol className="list-decimal">
							{mission.stages.map((stage) => {
								return stage.checkpoints.map(
									(checkpoint, j) => {
										return (
											<li
												key={j}
												className="text-sm text-gray-800 ml-6"
											>
												{checkpoint.title}
											</li>
										)
									}
								)
							})}
						</ol>
					</div>
				</div>
				<div className="text-gray-500 flex items-center gap-4">
					<AiOutlineClockCircle className="mr-1" />
					2h 10m
				</div>
				<div className="text-gray-500 flex items-center gap-4">
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
				</div>
			</div>
		</div>
	)
}

export default MissionSlug

export async function getServerSideProps(ctx) {
	const session = await getSession(ctx)
	const user = await getUserFromSession(session?.user?.email)
	const mission = await getMissionBySlug(ctx.params.slug)
	try {
		const enrollment = await getEnrollmentByStudentIDandCourseID(
			user._id,
			mission._id
		)
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
