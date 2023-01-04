import { getMissionBySlugQuery } from '@/util/getMissionBySlug'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Loader } from '@/components/util'
import Stages from '@/components/Course/Stages'
import { getEnrollmentByStudentIDandCourseIDQuery } from '@/util/getEnrollmentByStudentIDandCourseID'
import Content from '@/components/Course/Content'
import { TakeQuiz } from '@/components/Course/TakeQuiz'
import Landing from '@/components/Course/Landing'
import getter from '@/util/getter'
import useSWR from 'swr'
import { userContextObject } from '../../_app'

// const getLatestProgress = (stages) => {
// 	let progress = []
// 	stages.filter((stage) => {
// 		stage.checkpoints.map((checkpoint) => {
// 			progress.push(checkpoint.progress?.status || 0)
// 		})
// 	})
// 	return progress
// }

function MissionSlug() {
	// const stageProgress = getLatestProgress(mission.stages)
	// const max = Math.max(...stageProgress)
	// const indexOfMax = stageProgress.indexOf(max)
	const { user } = useContext(userContextObject)

	const router = useRouter()
	const slug = router.query.slug
	const checkpointIDQuery = router.query?.checkpointID
	const stageIDQuery = router.query?.stageID

	const { data: mission, error: missionError } = useSWR(getMissionBySlugQuery(slug), getter)

	const { data: enrollment, error: enrollmentError } = useSWR(getEnrollmentByStudentIDandCourseIDQuery(user?._id, mission?.result._id), getter)

	const [stageContext, setStageContext] = useState(0)
	const [checkpointContext, setCheckpointContext] = useState(0)
	const [currentCheckpoint, setCurrentCheckpoint] = useState(null)

	const skipToStage = (stageID) => {
		if (stageID) {
			const stageIndex = enrollment.result.course.stages.findIndex((stage) => {
				return stage._id === stageID
			})
			setStageContext(stageIndex)
			setCheckpointContext(0)
		}
	}

	const skipToCheckpoint = (checkpointID) => {
		if (checkpointID) {
			const stageIndex = enrollment.result.course.stages.map((stage, stageIndex) => {
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
	}

	useEffect(() => {
		setCurrentCheckpoint(enrollment?.result ? enrollment.result.course.stages[stageContext].checkpoints[checkpointContext] : null)
		skipToCheckpoint(checkpointIDQuery)
		skipToStage(stageIDQuery)
	}, [stageContext, checkpointContext, enrollment])

	if (!mission || !enrollment) return <Loader />

	if (missionError || enrollmentError) console.log(missionError || enrollmentError)

	return !enrollment.result ? (
		<Landing mission={mission.result} />
	) : !currentCheckpoint ? (
		<Loader />
	) : (
		<div className="flex flex-row">
			{currentCheckpoint.instance === 'video' && (
				<Content
					currentCheckpoint={currentCheckpoint}
					enrollment={enrollment.result}
					setCheckpointContext={setCheckpointContext}
					setStageContext={setStageContext}
				/>
			)}
			{currentCheckpoint.instance === 'quiz' && <TakeQuiz />}
			<Stages
				enrollment={enrollment.result}
				setCheckpointContext={setCheckpointContext}
				setStageContext={setStageContext}
				setCurrentCheckpoint={setCurrentCheckpoint}
			/>
		</div>
	)
}

export default MissionSlug
