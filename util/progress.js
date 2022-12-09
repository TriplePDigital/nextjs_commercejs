export const filterEnrollment = (user) => {
	//take array of enrollments
	//map over enrollments
	//if progress array in enrollment is not empty
	//map over progress array
	//if progress.content._id is not in uniqueContentIDs array
	//push progress.content._id to uniqueContentIDs array
	//else
	//remove progress from progress array
	//if progress array is empty
	//set progress to empty array
	//else
	//set progress to progress array in user state using useState

	const uniqueContentIDs = []
	const filteredProgress = user.enrollment.map((enrDoc) => {
		if (enrDoc.progress?.length >= 1) {
			return enrDoc.progress.filter((progress) => {
				if (!uniqueContentIDs.includes(progress.content._id)) {
					uniqueContentIDs.push(progress.content._id)
					return true
				}
				return false
			})
		}
		return enrDoc.progress
	})

	return {
		...user,
		enrollment: user.enrollment.map((enrDoc) => {
			return {
				...enrDoc,
				progress: filteredProgress[user.enrollment.indexOf(enrDoc)]
			}
		})
	}
}

export const calculateCourseProgress = (enrollment) => {
	let maxPoints = 0
	let earnedPoints = 0

	enrollment.course?.stages.map((stage) => {
		let point = stage.checkpointCount * 100
		maxPoints = maxPoints + point
	})

	enrollment?.progress?.length &&
		enrollment.progress.map((progress) => {
			earnedPoints += progress.status
		})

	return Math.round((earnedPoints / maxPoints) * 100)
}
