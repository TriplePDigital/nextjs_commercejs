// import axios from 'axios'
// import ReactPlayer from 'react-player/vimeo'
// import { useState, useEffect } from 'react'
// import Loader from 'react-spinners/BarLoader'
// import imageUrlBuilder from '@sanity/image-url'
// import Image from 'next/image'
// import Markdown from 'markdown-to-jsx'
// import { AiOutlinePlayCircle } from 'react-icons/ai'
// import { MdOutlineQuiz } from 'react-icons/md'

// export default function Lesson({ data, title }) {
// 	const [stageContentIndex, setStageContentIndex] = useState(0)
// 	const [stageContentType, setStageContentType] = useState('')

// 	useEffect(() => {
// 		if (data[stageContentIndex]._type === 'video') {
// 			setStageContentType('video')
// 		} else if (data[stageContentIndex]._type === 'checkpoint') {
// 			setStageContentType('checkpoint')
// 		}
// 	}, [data, stageContentIndex])

// 	return !data ? (
// 		<Loader />
// 	) : (
// 		<div className="flex flex-row">
// 			<Content
// 				className="w-9/12 py-5 pr-5"
// 				data={data[stageContentIndex]}
// 				variant={stageContentType}
// 				img={
// 					data[stageContentIndex].instructor &&
// 					data[stageContentIndex]?.instructor.avatar.asset
// 				}
// 			/>
// 			<ul className="w-3/12 p-5 bg-white border-l border-gray-200">
// 				<div className="border border-gray-400 rounded-xl p-5 bg-white shadow-inner">
// 					<h2 className="text-lg font-semibold leading-loose">
// 						{title}
// 					</h2>
// 					{data.map((stage, index) => (
// 						<div
// 							className="flex flex-row items-center justify-between w-full"
// 							key={index}
// 						>
// 							{stage._type === 'video' ? (
// 								<AiOutlinePlayCircle
// 									size={35}
// 									className="text-blue-400"
// 								/>
// 							) : (
// 								<MdOutlineQuiz size={35} />
// 							)}
// 							<button
// 								className="py-2 px-4 my-2 text-black rounded-lg"
// 								onClick={() => {
// 									setStageContentIndex(index)
// 								}}
// 							>
// 								{stage.title}
// 							</button>
// 							<span className="text-sm text-gray-500">10:00</span>
// 						</div>
// 					))}
// 				</div>
// 			</ul>
// 		</div>
// 	)
// }

// const getCourseData = async (query) => {
// 	const url = `${process.env.NEXT_PUBLIC_SANITY_URL}query=${query}`

// 	const res = await axios.get(url)

// 	const course = res.data.result[0]

// 	return course
// }

// export async function getServerSideProps(pageContext) {
// 	const pageSlug = await pageContext.query.lesson
// 	if (!pageSlug) {
// 		return {
// 			notFound: true
// 		}
// 	} else {
// 		const query = encodeURIComponent(`
//             *[_type == 'stage' && slug.current == "${pageSlug}"]{
//                 ...,
//                 content[]->{
//                     ...,
//                     instructor->{
//                     ...,
//                     avatar{
//                         asset->
//                     },
//                     stages[]->
//                     },
//                     questions[]->
//                 }
//             }
//         `)

// 		const course = await getCourseData(query)

// 		if (!course) {
// 			return {
// 				notFound: true
// 			}
// 		} else {
// 			const { content, title } = course
// 			return {
// 				props: {
// 					data: content,
// 					title
// 				}
// 			}
// 		}
// 	}
}
