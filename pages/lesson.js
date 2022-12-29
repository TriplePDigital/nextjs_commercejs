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

export default function Lesson({ data, content, chapters }) {
	const [stageIndex, setstageIndex] = useState(0)
	const [contentIndex, setContentIndex] = useState(0)
	const [stageContentType, setStageContentType] = useState('')

	const mission = data.attributes
	const { stages } = mission
	const currentStage = stages?.data[stageIndex]?.attributes
	const currentContent = content[contentIndex].attributes

	return !data ? (
		<Loader />
	) : (
		<div className="flex flex-row">
			{/* <Content
				className="w-9/12 py-5 pr-5"
				data={data[stageIndex]}
				variant={stageContentType}
				img={
					data[stageIndex].instructor &&
					data[stageIndex]?.instructor.avatar.asset
				}
			/> */}
			<div className="w-9/12 bg-gray-100 shadow-md border px-4 py-6 mt-6 mx-2 ml-0 rounded">
				<ReactPlayer
					url={currentContent.video_url}
					config={{
						vimeo: {
							playerOptions: {
								byline: false,
								pip: true,
								title: false,
								controls: true
							}
						}
						// playerOptions: {
						// 	controls: true
						// }
					}}
				/>
				{currentContent.stage.data.attributes.instructors.data.map((instructor, instructorIndex) => (
					<li key={instructorIndex}>{instructor.attributes.firstName}</li>
				))}
				{/* <pre className="">
					{JSON.stringify(currentContent, null, '\t')}
				</pre> */}
				<p className="leading-loose tracking-wide">{currentContent.description}</p>
			</div>
			<ul className="w-3/12 bg-gray-100 shadow-md border px-4 py-6 mt-6 mx-2 mr-0 rounded">
				{mission.title}

				{chapters.map((chapter, chIndex) => {
					const { title, videos } = chapter.attributes
					return (
						<div
							className="border border-gray-400 rounded-xl p-5 bg-white shadow-inner"
							key={chIndex}
						>
							<h2 className="text-lg font-semibold leading-loose">{title}</h2>
							<>
								{videos.data.map((video, cntIndex) => {
									const { duration, title } = video.attributes
									return (
										<div
											className="flex flex-row items-center justify-between w-full"
											key={cntIndex}
										>
											<button
												className={`py-2 px-4 my-2 text-black rounded-lg ${contentIndex === video.order_in_course && 'font-bold'}`}
												onClick={() => {
													setstageIndex(cntIndex)
												}}
											>
												{title}
											</button>
											<span className="text-sm text-gray-500">{`${duration || '0'}:00`}</span>
										</div>
									)
								})}
							</>
						</div>
					)
				})}
			</ul>
		</div>
	)
}

const getCourseData = async (query) => {
	const url = `${process.env.NEXT_PUBLIC_SANITY_URL}query=${query}`
	const res = await get(url)
	const course = res.data.result[0]
	return course
}

export async function getServerSideProps(pageContext) {
	const pageSlug = await pageContext.query.lesson
	if (!pageSlug) {
		return {
			notFound: true
		}
	} else {
		const query = qs.stringify(
			{
				sort: 'order_in_course',
				populate: {
					stage: {
						populate: '*',
						sort: 'order_in_course'
					}
				}
			},
			{
				encodeValuesOnly: true
			}
		)
		const q = qs.stringify(
			{
				slug: pageSlug,
				populate: {
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

		const qr = qs.stringify(
			{
				populate: {
					videos: {
						populate: '*',
						sort: 'order_in_course'
					}
				},
				sort: 'order_in_course'
			},
			{
				encodeValuesOnly: true
			}
		)

		const res = await get(`http://localhost:1337/api/missions?${q}`)

		const contentResults = await get(`http://localhost:1337/api/videos?${query}`)

		const chapterResults = await get(`http://localhost:1337/api/stages?${qr}`)

		const course = res.data.data[0]

		if (!course) {
			return {
				notFound: true
			}
		} else {
			return {
				props: {
					data: course,
					content: contentResults.data.data,
					chapters: chapterResults.data.data
				}
			}
		}
	}
}
