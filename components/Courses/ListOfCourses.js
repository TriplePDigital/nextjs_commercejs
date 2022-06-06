import imgConstructor from '../../util/img'
import Image from 'next/image'
import Link from 'next/link'
import { ReactTooltip } from 'react-tooltip'
import Loader from '../util/Loader'
import { FaUserGraduate } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'

export default function ListOfCourses({ course, key, progress }) {
	return !course ? (
		<Loader />
	) : (
		<div className="inline-block px-3">
			<div
				key={nanoid()}
				// className="xl:w-1/4 lg:w-1/3 md:w-1/2 w-full first:ml-0 first:mr-0 lg:first:ml-0 lg:first:mx-0 lg:mx-3 mx-0 border rounded-md shadow-md lg:mb-0 mb-6 h-min"
				className="w-72 h-fit xl:max-w-xl lg:max-w-lg md:max-w-md max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"
			>
				{/* TODO: figure out if we need tooltip over the courses or not. might need to get a different tooltip lib */}
				<div className="relative h-44 w-full">
					<Image
						{...imgConstructor(course.coverImage.asset, {
							fit: 'fill'
						})}
						layout="fill"
						quality={100}
						alt={course.blurb}
					/>
					<div
						className="opacity-75 absolute left-0 top-0 h-full w-full"
						style={{ backgroundColor: `${course.colorCode}` }}
					></div>
				</div>
				<div className="p-3">
					{/* course title */}
					<h1 className="font-semibold text-xl">
						<Link
							passHref
							href={`/mission/${course?.slug.current}`}
						>
							<a className="text-black font-bold text-xl">
								{course?.title}
							</a>
						</Link>
					</h1>

					{/* progress bar */}
					{progress ? (
						<div className="w-full bg-ncrma-300 rounded-full h-full my-3">
							<div
								className="bg-ncrma-600 rounded-full px-4 text-white"
								style={{
									width: `${progress}%`
								}}
							>
								{' '}
								{progress}%
							</div>
						</div>
					) : null}

					{/* enrollment line */}
					<div className="flex my-4">
						<div className="flex items-center">
							<FaUserGraduate className="mr-2 text-gray-300" />
							<p className="text-gray-600">Enrolled:</p>
						</div>
						<span className="font-semibold ml-2">
							{course?.enrollCount}
						</span>
					</div>

					{/* instructors being mapped out */}
					<ul>
						{course?.instructors.map((instructor) => {
							return (
								<Link
									href={`user/instructor/${instructor._id}`}
									key={nanoid()}
									passHref={true}
								>
									<a className="text-base text-gray-600 underline block">
										{instructor.name}
									</a>
								</Link>
							)
						})}
					</ul>
				</div>
			</div>
		</div>
	)
}
