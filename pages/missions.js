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

	if (!session) {
		return router.push('/auth/login')
	}

	return loading ? (
		<Loader />
	) : (
		<div className="flex flex-row w-full mt-5">
			<section className="w-3/4">
				{/* <Streak user={user} /> */}
				<h1 className="text-4xl font-semibold mt-5">My Courses</h1>
				<div className="flex flex-row flex-wrap mt-2">
					{enrollment
						? enrollment.map((item) => (
								<ListOfCourses
									key={nanoid()}
									course={item.course}
									progress={false}
								/>
						  ))
						: null}
				</div>
				{tracks.map((track, i) => (
					<div key={i}>
						<h1 className="text-4xl font-semibold mt-5">
							{track.name}
						</h1>
						<div className="flex overflow-x-scroll pb-10">
							<div className="flex flex-nowrap mt-2">
								{track.missions
									? track.missions.map((course) => (
											<ListOfCourses
												key={nanoid()}
												course={course}
												progress={false}
											/>
									  ))
									: null}
							</div>
						</div>
					</div>
				))}
			</section>
			<Webinar webinar={webinar} />
		</div>
	)
}

export async function getServerSideProps(ctx) {
	const session = await getSession(ctx)
	if (!session) {
		return {
			redirect: {
				destination:
					'/auth/login?callbackUrl=http://localhost:3000/auth/welcome',
				permanent: false
			}
		}
	} else {
		const usr = await getUserFromSession(session?.user?.email)

		const tracks = await getTracks()

		const enrollment = await getEnrollmentByStudentID(usr._id)

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

		return {
			props: {
				tracks,
				webinar,
				enrollment
			}
		}
	}
}
