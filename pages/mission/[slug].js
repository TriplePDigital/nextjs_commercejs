import { get } from 'axios'
import { useState, useEffect } from 'react'
import { Loader } from '../../components/util'
import { MdOutlineAssignment, MdOutlineQuiz } from 'react-icons/md'
import { BsPlayFill } from 'react-icons/bs'
import getMinutes from '../../util/time'
import Content from '../../components/Course/Content'
import qs from 'qs'
import Image from 'next/image'
import { AiFillStar, AiOutlineClockCircle } from 'react-icons/ai'
import { FaBook } from 'react-icons/fa'

export default function Course({ course }) {
	const [stageContentIndex, setStageContentIndex] = useState(0)
	const [topicContentIndex, setTopicContentIndex] = useState(0)
	const mission = course[0]

	console.log(mission)

	const coverImage = mission.attributes.cover.data.attributes

	return !course && !mission ? (
		<Loader />
	) : (
		<div className="flex flex-row">
			{/* <Content
				className="w-9/12 py-5 pr-5"
				body={
					course?.stages.data[stageContentIndex]?.attributes.content[
						topicContentIndex
					]
				}
			/> */}
			<div className="w-8/12 mr-8">
				<h1 className="text-4xl leading-loose tracking-wide font-bold">
					{mission.attributes.title}
				</h1>
				<ul className="mt-2 flex">
					{mission.attributes.instructors.data.map(
						(instructor, index) => {
							const userProfile =
								instructor.attributes.avatar.data.attributes
							return (
								<div
									key={index}
									className="flex items-center mx-2 first:ml-0"
								>
									<div className="h-10 w-10 rounded-full overflow-hidden mr-2 relative">
										<Image
											src={`http://localhost:1337${userProfile.url}`}
											alt={userProfile.caption}
											width={userProfile.width}
											height={userProfile.height}
											layout="intrinsic"
											objectFit="cover"
											objectPosition="center"
											quality={25}
											placeholder="blur"
											blurDataURL={`http://localhost:1337${userProfile.formats.thumbnail.url}`}
										/>
										<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
									</div>
									<li key={index} className="">
										{instructor.attributes?.firstName},{' '}
										{instructor.attributes?.middleName
											.length > 0
											? `${instructor.attributes?.middleName.substr(
													0,
													1
											  )}. `
											: ''}
										{instructor.attributes?.lastName}
									</li>
								</div>
							)
						}
					)}
				</ul>
				<div className="flex flex-row items-center justify-between mt-6">
					<div className=" flex items-center">
						<AiFillStar className="text-yellow-500 mr-2" />
						<span className="text-lg font-semibold mr-1">
							{5}.0
						</span>
						<span className="text-gray-500">(1512 Reviews)</span>
					</div>
					<div className="text-gray-500 flex items-center">
						<FaBook className="mr-1" />
						Lessons
					</div>
					<div className="text-gray-500 flex items-center">
						<MdOutlineAssignment className="mr-1" />
						Assignments
					</div>
					<div className="text-gray-500 flex items-center">
						<AiOutlineClockCircle className="mr-1" />
						2h 10m
					</div>
				</div>
				<div className="w-full max-h-screen mt-6">
					{/* TODO: Either show cover image or preview video if available */}
					<Image
						src={`http://localhost:1337${coverImage.url}`}
						alt={coverImage.caption}
						width={coverImage.width}
						height={coverImage.height}
						layout="responsive"
						objectFit="cover"
						objectPosition="center"
						quality={100}
						placeholder="blur"
						blurDataURL={`http://localhost:1337${coverImage.formats.thumbnail.url}`}
					/>
				</div>
				<h2 className="text-xl leading-loose tracking-wide font-bold mb-1 mt-6">
					About This Course
				</h2>
				<p>{mission.attributes?.description}</p>
			</div>
			<div className="w-4/12 p-5 bg-white border-l border-gray-200"></div>
		</div>
	)
}

export async function getServerSideProps(context) {
	let res
	const query = qs.stringify(
		{
			populate: {
				stages: {
					populate: {
						videos: {
							populate: '*'
						}
					},
					sort: 'id'
				},
				instructors: {
					populate: '*'
				},
				cover: {
					populate: '*'
				},
				enrollments: {
					populate: {
						user: {
							populate: '*'
						}
					}
				}
			}
		},
		{
			encodeValuesOnly: true
		}
	)
	try {
		res = await get(
			`http://localhost:1337/api/missions?slug=${context.query.slug}&${query}`
		)
	} catch (error) {
		throw new Error(error)
	}
	return {
		props: {
			course: res.data.data
		}
	}
}
