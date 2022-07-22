/* eslint-disable no-unused-vars */
import imgConstructor from '../../util/img'
import Image from 'next/image'
import Link from 'next/link'
import { ReactTooltip } from 'react-tooltip'
import Loader from '../util/Loader'
import { FaUserGraduate } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'

export default function ListOfCourses({ course, index, progress }) {
	return !course ? (
		<Loader />
	) : (
		<div className="inline-block px-3">
			<Link
				href={`${
					course.numberOfStages > 0
						? `/mission/${course.slug.current}`
						: '/missions'
				}`}
				passHref={true}
			>
				<span
					className="cursor-pointer"
					onClick={() =>
						course.numberOfStages > 0
							? null
							: alert(
									'This course is still in the making by one of our associates. Please check back later for an update.'
							  )
					}
				>
					<div
						// className="xl:w-1/4 lg:w-1/3 md:w-1/2 w-full first:ml-0 first:mr-0 lg:first:ml-0 lg:first:mx-0 lg:mx-3 mx-0 border rounded-md shadow-md lg:mb-0 mb-6 h-min"
						className="w-72 h-fit xl:max-w-xl lg:max-w-lg md:max-w-md max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"
					>
						{/* TODO: figure out if we need tooltip over the courses or not. might need to get a different tooltip lib */}
						{course.numberOfStages > 0 ? (
							<Link
								passHref={true}
								href={`/mission/${course?.slug.current}`}
							>
								<span className="text-black font-bold text-xl">
									<div className="relative h-44 w-full">
										<Image
											{...imgConstructor(
												course.coverImage,
												{
													fit: 'fill'
												}
											)}
											layout="fill"
											quality={50}
											alt={course.blurb}
										/>
										<div
											className="opacity-75 absolute left-0 top-0 h-full w-full"
											style={{
												backgroundColor: `${course.colorCode}`
											}}
										></div>
									</div>
								</span>
							</Link>
						) : (
							<a className="text-black font-bold text-xl cursor-pointer">
								<div className="relative h-44 w-full">
									<Image
										{...imgConstructor(course.coverImage, {
											fit: 'fill'
										})}
										layout="fill"
										quality={50}
										alt={course.blurb}
									/>
									<div
										className="opacity-75 absolute left-0 top-0 h-full w-full"
										style={{
											backgroundColor: `${course.colorCode}`
										}}
									></div>
								</div>
							</a>
						)}
						<div className="p-3">
							{/* course title */}
							<h1 className="font-semibold text-xl">
								{course.numberOfStages > 0 ? (
									<Link
										passHref={true}
										href={`/mission/${course?.slug.current}`}
									>
										<span className="text-black font-bold text-xl">
											{course?.title}
										</span>
									</Link>
								) : (
									<div
										className="text-black font-bold text-xl cursor-pointer"
										onClick={() =>
											alert(
												'This course is still in the making by one of our associates. Please check back later for an update.'
											)
										}
									>
										{course?.title}
									</div>
								)}
							</h1>

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
								{course?.instructors.map(
									(instructor, instructorIndex) => (
										<li
											key={instructorIndex}
											className="relative"
										>
											{instructor.name}
										</li>
									)
								)}
							</ul>
						</div>
					</div>
				</span>
			</Link>
		</div>
	)
}
