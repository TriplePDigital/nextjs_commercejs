import axios from 'axios'
import Link from 'next/link'
import { Loader } from '../components/util'
import imgConstructor from '../util/img'
import Image from 'next/image'
import ReactTooltip from 'react-tooltip'
import { useEffect } from 'react'
import { fetcher } from '../util/fetcher'

export default function Course({ courses, myCourses }) {
	console.log(myCourses)
	return !courses ? (
		<Loader />
	) : (
		<div className="flex flex-row w-full mt-5">
			<section className="w-3/4">
				<div className="w-full flex flex-row justify-between bg-gray-100 shadow-md border px-4 py-2 rounded">
					<div className="w-1/2 mr-2">
						<h1 className="text-3xl font-semibold">
							Welcome back {'Student Name'}!
						</h1>
						<p className="text-gray-600 text-base leading-loose tracking-wide">
							You are on a {245} day learning streak. Extend your
							streak by completing a lessons today.
						</p>
					</div>
					<div className="w-1/2 flex flex-col ml-2 justify-center">
						<div className="flex flex-row w-full items-center justify-end mb-2">
							<span className="bg-black h-8 w-8 mr-2"></span>
							<h2 className="text-xl text-gray-400 w-full font-semibold">
								Complete{' '}
								<span className="text-black">{15}</span> more
								lessons to level up
							</h2>
						</div>
						<div className="relative w-full">
							<span className="absolute bg-teal-600 rounded-full font-bold text-white w-1/3 px-2 py-1 top-0 left-0">
								LEVEL {2}
							</span>
							<span className="block text-right bg-teal-300 rounded-full font-bold text-white w-full px-2 py-1">
								LEVEL {3}
							</span>
						</div>
					</div>
				</div>
				<h1 className="text-4xl font-semibold mt-5">My Courses</h1>
				<div className="flex flex-row flex-wrap mt-2">
					{courses.map((course, index) => (
						<div
							key={index}
							className="w-full mx-3 first:ml-0 first:mx-0 border rounded-md shadow-md mb-6 md:w-full lg:w-1/4 lg:mb-0 lg:h-96"
							data-tip={
								course.description.length >= 100
									? `${course.description.substring(
											0,
											250
									  )}...`
									: course.description
							}
						>
							<ReactTooltip
								place="right"
								type="dark"
								effect="solid"
								className="w-1/4 rounded-sm border border-gray-50 shadow-xl"
								arrowColor="black"
								backgroundColor="black"
								textColor="white"
							/>
							<div className="relative h-44 w-full">
								<Image
									{...imgConstructor(course.coverImage.asset)}
									layout="fill"
									objectFit="cover"
									quality={100}
									alt={course.blurb}
									placeholder="blur"
								/>
								<div className="bg-red-500 opacity-75 absolute left-0 top-0 h-full w-full"></div>
							</div>
							<div className="p-3">
								<h1 className="font-semibold text-xl">
									<Link
										passHref
										href={`mission/${course.slug.current}`}
									>
										<a className="text-black font-bold text-xl">
											{course.title}
										</a>
									</Link>
								</h1>
								<div className="w-full bg-teal-300 rounded-full h-full my-3">
									<div
										className="bg-teal-600 rounded-full px-4 text-white"
										style={{ width: `67%` }}
									>
										{' '}
										{67}%
									</div>
								</div>
								<div className="flex flex-col my-4">
									<div className="flex justify-between">
										<p className="text-gray-600">
											Enrolled:
										</p>
										<span className="font-semibold">
											{14}
										</span>
									</div>
								</div>
								<ul>
									{course.instructors?.map(
										(instructor, index) => (
											<li
												className="text-base text-gray-600 underline"
												key={index}
											>
												{instructor.name}
											</li>
										)
									)}
								</ul>
							</div>
						</div>
					))}
				</div>
				<h1 className="text-4xl font-semibold mt-5">
					Recommended Courses
				</h1>
				<div className="flex flex-row flex-wrap mt-2">
					{myCourses[0].missions.map((course, index) => (
						<div
							key={index}
							className="w-full mx-3 first:ml-0 first:mx-0 border rounded-md shadow-md p-5 mb-6 md:w-full lg:w-1/4 lg:mb-0 lg:h-96"
							data-tip={
								course.description.length >= 100
									? `${course.description.substring(
											0,
											250
									  )}...`
									: course.description
							}
						>
							<ReactTooltip
								place="right"
								type="dark"
								effect="solid"
								className="w-1/4 rounded-sm border border-gray-50 shadow-xl"
								arrowColor="black"
								backgroundColor="black"
								textColor="white"
							/>
							<div className="relative h-44 w-full">
								<Image
									{...imgConstructor(course.coverImage.asset)}
									layout="fill"
									objectFit="cover"
									quality={100}
									alt={course.blurb}
									placeholder="blur"
								/>
							</div>
							<h1 className="font-semibold text-xl">
								<Link
									passHref
									href={`mission/${course.slug.current}`}
								>
									<a className="underline text-blue-700">
										{course.title}
									</a>
								</Link>
							</h1>
							<p className="my-3 text-sm text-gray-500">
								{course.description.length >= 100
									? `${course.description.substring(
											0,
											150
									  )}...`
									: course.description}
							</p>
							<ul>
								{course.instructors?.map(
									(instructor, index) => (
										<li className="text-sm" key={index}>
											{instructor.name}
										</li>
									)
								)}
							</ul>
						</div>
					))}
				</div>
			</section>
			<aside className="w-1/4 bg-gray-100 px-4 py-6 ml-4 shadow-md border rounded min-h-screen">
				<h1 className="text-2xl mb-4 font-semibold">
					{'Risk Management: Insurance Webinar'}
				</h1>
				<p className="text-gray-600 tracking-wide mb-2">
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Itaque quidem in ad repellendus. Saepe, accusantium veniam
					porro exercitationem impedit commodi, deleniti sapiente
					repellendus quas quasi quos corrupti, labore assumenda
					neque!
				</p>
				<div className="flex flex-row justify-between items-center">
					<div className="flex flex-row items-center">
						<span className="bg-gray-300 h-6 w-6 mr-2"></span>
						<div className="flex flex-col">
							<p>{'December 17'}</p>
							<p className="text-gray-500">Date</p>
						</div>
					</div>
					<div className="flex flex-row items-center">
						<span className="bg-gray-300 h-6 w-6 mr-2"></span>
						<div className="flex flex-col">
							<p>{'9:00AM-1:00PM'}</p>
							<p className="text-gray-500">Time</p>
						</div>
					</div>
				</div>
				<h2 className="text-xl mt-5 mb-2 font-semibold">
					Presenters & Instructors
				</h2>
				<div className="py-4 flex flex-row relative mb-5">
					<img
						src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80"
						alt=""
						className="w-12 h-12 aspect-square rounded-full mr-2 overflow-hidden z-50"
					/>
					<img
						src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80"
						alt=""
						className="w-12 h-12 aspect-square rounded-full mr-2 overflow-hidden absolute left-8 z-40"
					/>
					<img
						src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80"
						alt=""
						className="w-12 h-12 aspect-square rounded-full mr-2 overflow-hidden absolute left-16 z-30"
					/>
					<img
						src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80"
						alt=""
						className="w-12 h-12 aspect-square rounded-full mr-2 overflow-hidden absolute left-24 z-20"
					/>
					<img
						src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80"
						alt=""
						className="w-12 h-12 aspect-square rounded-full mr-2 overflow-hidden absolute left-32 z-10"
					/>
					<span className="bg-teal-500 absolute left-40 rounded-full h-12 w-12 flex items-center justify-center font-black">
						...
					</span>
				</div>
				<h2 className="text-xl mb-2 font-semibold">Agenda</h2>
				<div className="bg-teal-500 px-6 py-8 my-3 rounded flex flex-row justify-between uppercase font-semibold">
					<p className="text-gray-700">9:00AM</p>
					<p>Introductions</p>
				</div>
				<div className="bg-teal-500 px-6 py-8 my-3 rounded flex flex-row justify-between uppercase font-semibold">
					<p className="text-gray-700">11:00AM</p>
					<p>Insurance Premium</p>
				</div>
				<div className="flex flex-row w-full justify-between mt-5">
					<button className="border-2 border-transparent bg-teal-500 text-white px-8 py-3 rounded mr-2 uppercase leading-loose tracking-wide font-semibold">
						Attend
					</button>
					<button className="border-2 border-teal-500 text-black px-8 py-3 rounded ml-2 uppercase leading-loose tracking-wide font-semibold">
						Purchase
					</button>
				</div>
			</aside>
		</div>
	)
}

export async function getServerSideProps() {
	const myCourses = await fetcher(`
    *[_type == 'explorer']{
        ...,
        achievements[] -> {
            ...
        },
        missions[] -> {
            ...,
            coverImage{
            asset ->
            },
            instructors[]-> {name}
        }
    }`)

	const course = await fetcher(`*[_type == 'mission']{
                ...,
                coverImage{
                    asset->
                },
                instructors[]-> {name},
                stages[]->{title, slug}
        }`)

	// const query = encodeURIComponent(

	// )

	// const url = `https://tfh7h5l0.api.sanity.io/v1/data/query/production?query=${query}`

	// const res = await axios.get(url)

	// const course = res.data.result

	if (!course) {
		return {
			notFound: true
		}
	} else {
		return {
			props: {
				courses: course,
				myCourses: myCourses
			}
		}
	}
}
