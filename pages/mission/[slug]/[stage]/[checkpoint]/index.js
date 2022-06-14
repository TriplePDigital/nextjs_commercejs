/* eslint-disable no-unused-vars */
// **** https://cdn.dribbble.com/users/1008889/screenshots/17247195/media/e8e6ae59a1569f0b3370c1c2d4a29ba0.png
import { get } from 'axios'
import ReactPlayer from 'react-player/vimeo'
import { useState, useEffect } from 'react'
import Loader from 'react-spinners/BarLoader'
import imageUrlBuilder from '@sanity/image-url'
import Image from 'next/image'
import Markdown from 'markdown-to-jsx'
import { AiOutlinePlayCircle } from 'react-icons/ai'
import { MdOutlineQuiz } from 'react-icons/md'
import qs from 'qs'
import Stages from '../../../../../components/Course/Stages'

export default function Lesson({
	stages,
	checkpoint,
	checkpointIndex,
	pageSlug,
	mission
}) {
	const currentContent = checkpoint?.data[checkpointIndex - 1]?.attributes
	const currentStage = stages.data[checkpointIndex - 1].attributes
	const currentMission = mission[0].attributes

	return !stages ? (
		<Loader />
	) : (
		<div className="flex flex-row">
			<div className="w-9/12 bg-gray-100 shadow-md border px-4 py-6 mt-6 mx-2 ml-0 rounded">
				<ReactPlayer
					url={currentContent?.video_url}
					config={{
						vimeo: {
							playerOptions: {
								byline: false,
								pip: true,
								title: false,
								controls: true,
								fallback: null,
								width: '1000px',
								height: '1000px'
							}
						}
					}}
				/>
				<div className="flex items-center my-6">
					{currentStage.instructors &&
						currentStage?.instructors.data.map(
							(instructor, index) => {
								const user = instructor.attributes
								const userPic = user.avatar.data.attributes
								return (
									<a
										key={index}
										className="flex items-center mx-4 first:ml-0"
									>
										<div className="h-10 w-10 rounded-full overflow-hidden mr-2 relative">
											<Image
												src={`http://localhost:1337${userPic.url}`}
												alt={userPic.caption}
												height={userPic.height}
												width={userPic.width}
												layout="intrinsic"
											/>
											<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
										</div>
										<span className="font-semibold leading-loose text-lg">
											{createFullName(user)}
										</span>
									</a>
								)
							}
						)}
				</div>
			</div>
			<Stages
				stages={stages}
				mission={pageSlug}
				title={currentMission.title}
			/>
		</div>
	)
}

function createFullName(instructor) {
	return `${instructor?.firstName}${
		instructor?.middleName.length > 0
			? ` ${instructor?.middleName.substr(0, 1)}, `
			: ', '
	} ${instructor?.lastName}`
}

async function getStages(pageSlug) {
	const chapterQuery = qs.stringify(
		{
			populate: {
				videos: {
					populate: '*',
					sort: 'order_in_course'
				},
				mission: {
					slug: pageSlug
				},
				instructors: {
					populate: '*'
				}
			},
			sort: 'order_in_course'
		},
		{
			encodeValuesOnly: true
		}
	)

	const chapters = await get(
		`http://localhost:1337/api/stages?${chapterQuery}`
	)

	return chapters
}

async function getContent(slug, videoIndex) {
	const query = qs.stringify(
		{
			sort: 'order_in_course',
			order_in_course: videoIndex,
			populate: {
				stage: {
					populate: '*',
					title: slug,
					sort: 'order_in_course'
				}
			}
		},
		{
			encodeValuesOnly: true
		}
	)

	const res = await get(`http://localhost:1337/api/videos?${query}`)

	return res
}

async function getMission(pageSlug) {
	const query = qs.stringify(
		{
			slug: pageSlug,
			populate: '*'
		},
		{
			encodeValuesOnly: true
		}
	)

	const res = await get(`http://localhost:1337/api/missions?${query}`)

	return res
}

export async function getServerSideProps(ctx) {
	const pageSlug = await ctx.params.slug
	const stage = await ctx.params.stage
	const checkpointIndex = await ctx.params.checkpoint

	const chapters = await getStages(pageSlug)

	const checkpoint = await getContent(stage, checkpointIndex)

	const mission = await getMission(pageSlug)

	if (!pageSlug) {
		return {
			notFound: true
		}
	} else {
		return {
			props: {
				pageSlug,
				mission: mission.data.data,
				stages: chapters.data,
				checkpoint: checkpoint.data,
				checkpointIndex
			}
		}
	}
}
