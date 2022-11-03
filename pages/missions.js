/* eslint-disable no-unused-vars */
import { Loader } from '../components/util'
import { fetcher } from '@/util/fetcher'
import { FaTrophy } from 'react-icons/fa'
import { ListOfCourses, Webinar } from '../components/Courses'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../pages/_app'
import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import Streak from '@/components/Courses/Streak'
import { nanoid } from 'nanoid'
import getEnrollmentByStudentID from '@/util/getEnrollmentByStudentID'
import getTracks from '@/util/getTracks'
import getUserFromSession from '@/util/getUserFromSession'

export default function Course({ webinar, tracks, enrollment }) {
	/* pulling user's context from _app */
	const { user } = useContext(UserContext)
	const [session, loading] = useSession()
	const router = useRouter()

	// if (!session) {
	// 	return router.push('/auth/login')
	// }

	return loading ? (
		<Loader />
	) : (
		<div className="flex flex-row w-full mt-5">
			<section className="w-full">
				{/* <Streak user={user} /> */}
				{session && (
					<>
						<h1 className="text-4xl font-semibold mt-5">My Courses</h1>
						<div className="flex overflow-x-scroll pb-10">
							<div className="flex flex-nowrap mt-2">
								{enrollment?.length > 0
									? enrollment.map((item, enrollmentIndex) => (
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
				{tracks.map((track, i) => {
					return track.numCourses !== 0 ? (
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
			{/* <Webinar webinar={webinar} /> */}
		</div>
	)
}

export async function getServerSideProps(ctx) {
	const session = await getSession(ctx)
	const webinar = await fetcher(`
			*[_type == 'webinar' ] | order(releaseDateDesc){
				...,
				presenters[]->{
					...,
					avatar {
						...,
						asset ->
					}
				},
			}[0]`)
	const tracks = await getTracks()
	if (session) {
		const usr = await getUserFromSession(session?.user?.email)

		const enrollment = await getEnrollmentByStudentID(usr?._id)

		return {
			props: {
				tracks,
				webinar,
				enrollment: enrollment?.length > 0 ? enrollment : []
			}
		}
	} else {
		return {
			props: {
				tracks,
				webinar,
				enrollment: []
			}
		}
	}
}
