/* eslint-disable no-unused-vars */
import Image from 'next/image'
import Link from 'next/link'
import Loader from '../util/Loader'
import { FaUserGraduate } from 'react-icons/fa'
import { useNextSanityImage } from 'next-sanity-image'
import { client } from '@/util/config'
import { calculateCourseProgress, filterEnrollment } from '@/util/progress'

export default function ListOfCourses({ course, index, progress, enrollment }) {
	const imageProps = useNextSanityImage(client, course?.coverImage)

	// console.log(
	// 	enrollment
	// 		? filterEnrollment({
	// 				user: {
	// 					enrollment
	// 				}
	// 		  })
	// 		: null
	// )
	// console.log(
	// 	enrollment
	// 		? {
	// 				percentage: calculateCourseProgress(enrollment),
	// 				name: course.title,
	// 				enrollment
	// 		  }
	// 		: null
	// )

	return !course ? (
		<Loader />
	) : (
		<div className="inline-block px-3">
			<Link
				href={course.fallbackURL ? course.fallbackURL : `/mission/${course.slug.current}`}
				passHref={false}
			>
				<a className="w-72 h-fit xl:max-w-xl lg:max-w-lg md:max-w-md max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out block">
					<span className="text-black font-bold text-xl">
						<div className="relative h-44 w-full">
							<Image
								src={imageProps.src}
								loader={imageProps.loader}
								blurDataURL={imageProps.blurDataURL}
								placeholder="blur"
								layout="fill"
								objectFit="cover"
								objectPosition="center"
								quality={20}
								alt={course.blurb}
								loading={'lazy'}
							/>
							<div
								className="opacity-75 absolute left-0 top-0 h-full w-full"
								style={{
									backgroundColor: `${course.colorCode}`
								}}
							></div>
						</div>
					</span>
					<div className="p-3">
						{/* course title */}
						<h1 className="font-semibold text-xl">
							<span className="text-black font-bold text-xl">{course?.title}</span>
						</h1>

						{/* enrollment line */}
						<div className="flex my-4">
							<div className="flex items-center">
								<FaUserGraduate className="mr-2 text-gray-300" />
								<p className="text-gray-600">Enrolled:</p>
							</div>
							<span className="font-semibold ml-2">{course?.enrollCount}</span>
						</div>

						{/* instructors being mapped out */}
						<ul>
							{course?.instructors.map((instructor, instructorIndex) => (
								<li
									key={instructorIndex}
									className="relative"
								>
									{instructor.name}
								</li>
							))}
						</ul>
					</div>
				</a>
			</Link>
		</div>
	)
}
