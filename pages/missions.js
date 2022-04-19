import { Loader } from '../components/util'
import { fetcher } from '@/util/fetcher'
import { FaTrophy } from 'react-icons/fa'
import { ListOfCourses, Webinar } from '../components/Courses'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../pages/_app'
import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { getToken } from 'next-auth/jwt'

export default function Course({ webinar, plan, tracks }) {
	/* pulling user's context from _app */
	const { user } = useContext(UserContext)
	const [session, loading] = useSession()
	const [missions, setMissions] = useState(null)
	const [stages, setStages] = useState(null)
	const router = useRouter()

	console.log(plan)

	useEffect(() => {
		// setMissions(plan.activities.filter((i) => i.mission))
		// setStages(plan.activities.filter((i) => i.stage))
	}, [plan.activities])

	if (!session) {
		return router.push('/auth/login')
	}

	return loading ? (
		<Loader />
	) : (
		<div className="flex flex-row w-full mt-5">
			<section className="w-3/4">
				<div className="w-full flex flex-row justify-between bg-gray-100 shadow-md border px-4 py-6 rounded">
					<div className="w-1/2 mr-2">
						<h1 className="text-3xl font-semibold">
							Welcome back {user?.name || ''}!
						</h1>
						<p className="text-gray-600 font-light text-base leading-loose">
							You are on a {245} day learning streak. Extend your
							streak by completing a lessons today.
						</p>
					</div>
					<div className="w-1/2 flex flex-col ml-2 justify-center">
						<div className="flex flex-row w-full items-center justify-end mb-2">
							<FaTrophy
								fontSize={32}
								className="text-gray-400 mr-4"
							/>
							<h2 className="text-xl text-gray-400 w-full font-semibold">
								Complete{' '}
								<span className="text-black">{15}</span> more
								lessons to level up
							</h2>
						</div>
						<div className="relative w-full">
							<span className="absolute bg-ncrma-600 rounded-full font-bold text-white w-1/3 px-4 py-1 top-0 left-0">
								LEVEL {2}
							</span>
							<span className="block text-right bg-ncrma-400 rounded-full font-bold text-white w-full px-4 py-1 ">
								LEVEL {3}
							</span>
						</div>
					</div>
				</div>
				<h1 className="text-4xl font-semibold mt-5">My Courses</h1>
				<div className="flex flex-row flex-wrap mt-2">
					{/*{missions*/}
					{/*	? missions.map((course, index) => (*/}
					{/*			<ListOfCourses*/}
					{/*				key={index}*/}
					{/*				course={course.mission}*/}
					{/*				progress={course.progress}*/}
					{/*			/>*/}
					{/*	  ))*/}
					{/*	: null}*/}
				</div>
				{tracks.map((track, i) => (
					<div key={i}>
						<h1 className="text-4xl font-semibold mt-5">
							{track.Name}
						</h1>
						<div className="flex flex-row flex-wrap mt-2">
							{track.missions
								? track.missions.map((course, index) => (
										<ListOfCourses
											key={index}
											course={course}
											progress={false}
										/>
								  ))
								: null}
						</div>
					</div>
				))}
			</section>
			<Webinar webinar={webinar} />
		</div>
	)
}

export async function getServerSideProps(ctx) {
	const token = await getToken({
		req: ctx.req,
		secret: process.env.JWT_SECRET
	})
	const session = await getSession(ctx)
	console.log({token, session})
	// const token = await getToken({ req: ctx.request, secret: process.env.JWT_SECRET })
	// console.log("JSON Web Token", token)
	const tracks = await fetcher(`
    *[_type == 'track']{
...,
  missions[] -> {..., instructors[]->,coverImage{
    asset->
  }},
  achievement ->{
    title,
    slug
  }
}`)

	const plan = await fetcher(`
			*[_type == "plan" && user._ref in *[_type=="user" && email=="${session?.user?.email}"]._id ]{
\t\t\t...,
\t\t\t user ->,
\t\t\t missions[] -> {
\t\t\t\t...,
\t\t\t\t coverImage {
\t\t\t\t\t...,
\t\t\t\t\t asset ->
\t\t\t\t},
\t\t\t\t instructors[] ->
\t\t\t},
\t\t\t progress -> {
\t\t\t\t...,
        completedCheckpoints[] ->,
\t\t\t\tinProgress [] {
          ...,
\t\t\t\t  mission -> {
            ...,
\t\t\t\t    slug{
\t\t\t\t        current
\t\t\t\t    }
\t\t\t\t  },
          stage ->,
          checkpoint ->,
\t\t\t\t  progress
\t\t\t\t}
\t\t\t}
\t\t}[0]
`)

	//TODO: fetch the latest webinar only and all the rest in a different query for either this page or the MMP
	const webinar =
		await fetcher(`*[_type == 'webinar' ] | order(releaseDateDesc){
  ...,
  presenters[]->{
    ...,
    avatar {
    ...,
    asset ->
  }
  },
}[0]`)

	if (!plan) {
		return {
			notFound: true
		}
	} else {
		return {
			props: {
				tracks,
				webinar,
				plan: plan
				// missions: missions.data.data,
				// profile: profile.data.data
			}
		}
	}
}
