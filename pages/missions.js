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
		<div className="flex flex-col w-full mt-5">
			<h1 className="text-4xl font-semibold">Recommended Courses</h1>
			<div className="flex flex-row flex-wrap mt-2">
				{myCourses[0].missions.map((course, index) => (
					<div
						key={index}
						className="w-full mx-3 first:ml-0 first:mx-0 border rounded-md shadow-md p-5 mb-6 md:w-full lg:w-1/4 lg:mb-0 lg:h-96"
						data-tip={
							course.description.length >= 100
								? `${course.description.substring(0, 250)}...`
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
								? `${course.description.substring(0, 150)}...`
								: course.description}
						</p>
						<ul>
							{course.instructors?.map((instructor, index) => (
								<li className="text-sm" key={index}>
									{instructor.name}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
			<h1 className="text-4xl font-semibold mt-5">My Courses</h1>
			<div className="flex flex-row flex-wrap mt-2">
				{courses.map((course, index) => (
					<div
						key={index}
						className="w-full mx-3 first:ml-0 first:mx-0 border rounded-md shadow-md p-5 mb-6 md:w-full lg:w-1/4 lg:mb-0 lg:h-96"
						data-tip={
							course.description.length >= 100
								? `${course.description.substring(0, 250)}...`
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
								? `${course.description.substring(0, 150)}...`
								: course.description}
						</p>
						<ul>
							{course.instructors?.map((instructor, index) => (
								<li className="text-sm" key={index}>
									{instructor.name}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
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
