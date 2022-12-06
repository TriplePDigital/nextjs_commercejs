import { Loader } from '../components/util'
import { ListOfCourses } from '../components/Courses'
import { useContext } from 'react'
import { UserContext } from './_app'
import { useSession } from 'next-auth/client'
import { enrollmentQuery } from '@/util/getEnrollmentByStudentID'
import { trackQuery } from '@/util/getTracks'
import useSWR from 'swr'
import getter from '@/util/getter'
import { webinarQuery } from '@/util/getWebinar'

export default function Course({}) {
	/* pulling user's context from _app */
	const { user } = useContext(UserContext)
	const [session, loading] = useSession()

	const { data: webinar, error: webinarError } = useSWR(webinarQuery, getter)

	const { data: enrollment, error: enrollmentError } = useSWR(enrollmentQuery(user?._id), getter)

	const { data: tracks, error: trackError, isValidating: isValidatingTracks } = useSWR(trackQuery, getter)

	if (!webinar || !enrollment || !tracks) return <Loader />

	if (webinarError || enrollmentError || trackError) return <div>Something went wrong</div>

	const filterTracksFromEnrollment = (tracks, enrollment) => {
		// for each track in the array of tracks get the missions array property
		// for each mission in the array of missions get the missionID property
		// for each missionID in the array of missionIDs check if it is in the array of enrollment
		// if it is in the array of enrollment then add the track to the array of filtered tracks
		// return the array of filtered tracks

		const enrolledMissions = enrollment.map((enrollment) => enrollment.course._id)

		return tracks.map((track) => {
			if (track.missions && track.missions.length > 0) {
				let missions = track.missions.map((mission) => mission._id)
				//for each mission _id in the missions array check if it is in the enrolledMissions array
				//if it is in the enrolledMissions array then remove it from the missions array

				// holds the non-enrolled mission IDs
				missions = missions.filter((mission) => !enrolledMissions.includes(mission))

				// holds all the track minus the missions that the student is enrolled in
				track.missions = missions.map((mission) => {
					return track.missions.find((missionObj) => missionObj._id === mission)
				})

				return track
			} else {
				return []
			}
		})
	}

	return isValidatingTracks ? (
		<Loader />
	) : (
		<div className="flex flex-row w-full mt-5">
			<section className="w-full">
				{/*<Streak user={user} />*/}
				{!loading && session && (
					<>
						<h1 className="text-4xl font-semibold mt-5">My Courses</h1>
						<div className="flex overflow-x-scroll pb-10">
							<div className="flex flex-nowrap mt-2">
								{enrollment?.result?.length > 0
									? enrollment.result.map((item, enrollmentIndex) => (
											<ListOfCourses
												key={enrollmentIndex}
												index={enrollmentIndex}
												course={item.course}
												progress={false}
											/>
									  ))
									: null}
							</div>
						</div>
					</>
				)}
				{filterTracksFromEnrollment(tracks?.result, enrollment?.result).map((track, i) => {
					return track?.missions && track?.missions.length > 0 ? (
						<div key={i}>
							<h1 className="text-4xl font-semibold mt-5">{track.name}</h1>
							<div className="flex overflow-x-scroll pb-10">
								<div className="flex flex-nowrap mt-2">
									{track.missions
										? track.missions.map((course, courseIndex) => (
												<ListOfCourses
													key={courseIndex}
													index={courseIndex}
													course={course}
													progress={false}
												/>
										  ))
										: null}
								</div>
							</div>
						</div>
					) : null
				})}
			</section>
			{/*<Webinar webinar={webinar.result} />*/}
		</div>
	)
}
