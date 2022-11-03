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
import { TakeQuiz } from '@/components/Course/TakeQuiz'
import Script from 'next/script'
import Landing from '@/components/Course/Landing'

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

	const [loading, setLoading] = useState(true)
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
			{currentCheckpoint.instance === 'video' && (
				<Content
					currentCheckpoint={currentCheckpoint}
					enrollment={enrollment}
					setCheckpointContext={setCheckpointContext}
					setStageContext={setStageContext}
				/>
			)}
			{currentCheckpoint.instance === 'quiz' && <TakeQuiz />}
			<Stages
				enrollment={enrollment}
				setCheckpointContext={setCheckpointContext}
				setStageContext={setStageContext}
				setCurrentCheckpoint={setCurrentCheckpoint}
			/>
		</div>
	) : (
		<Landing
			mission={mission}
			courseDuration={courseDuration}
			numberOfCheckpoints={numberOfCheckpoints}
		/>
	)
}

export default MissionSlug

export async function getServerSideProps(ctx) {
	const session = await getSession(ctx)
	// if (!session) {
	// 	return {
	// 		redirect: {
	// 			destination: `/auth/login?callbackUrl=${process.env.NEXT_PUBLIC_CALLBACK_BASE_URL}welcome`,
	// 			permanent: false
	// 		}
	// 	}
	// }
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
