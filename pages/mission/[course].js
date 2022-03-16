import axios from 'axios'
import { useState } from 'react'
import { Loader } from '../../components/util'
import { MdOutlineQuiz } from 'react-icons/md'
import { BsPlayFill } from 'react-icons/bs'
import getMinutes from '../../util/time'
import Content from '../../components/Course/Content'

export default function Course({ course }) {
	const [stageContentIndex, setStageContentIndex] = useState(0)
	const [topicContentIndex, setTopicContentIndex] = useState(0)

	return !course.stages ? (
		<Loader />
	) : (
		<div className="flex flex-row">
			<Content
				className="w-9/12 py-5 pr-5"
				body={
					course?.stages[stageContentIndex]?.content[
						topicContentIndex
					]
				}
			/>
			<div className="w-3/12 p-5 bg-white border-l border-gray-200">
				<h1 className="text-2xl leading-loose tracking-wide font-semibold mb-1">
					{course.title}
				</h1>
				{course.stages.map((stage, index) => (
					<ul key={index} className="mb-5">
						<div className="border border-gray-400 rounded-xl p-5 bg-white shadow-inner">
							<h2 className="text-lg font-semibold leading-loose">
								{stage.title}
							</h2>
							{stage.content.map((topic, i) => (
								<div
									className="flex flex-row items-center justify-between w-full"
									key={i}
								>
									{topic._type === 'video' ? (
										<BsPlayFill
											size={35}
											className="pl-1 text-center text-blue-500 bg-blue-200 rounded-full aspect-square"
										/>
									) : (
										<MdOutlineQuiz
											size={35}
											className="p-1.5 text-center text-blue-500 bg-blue-200 rounded-full aspect-square"
										/>
									)}
									<button
										className="py-2 px-4 my-2 text-black rounded-lg"
										onClick={() => {
											setStageContentIndex(index)
											setTopicContentIndex(i)
										}}
									>
										{topic.title}
									</button>
									<span className="text-sm text-gray-500 ">
										{topic._type === 'video'
											? getMinutes(
													topic?.vimeoVideo
														?.oEmbedData?.duration
											  )
											: '10:00'}
									</span>
								</div>
							))}
						</div>
					</ul>
				))}
			</div>
		</div>
	)
}

export async function getServerSideProps(pageContext) {
	const pageSlug = await pageContext.query.course
	if (!pageSlug) {
		return {
			notFound: true
		}
	} else {
		const query = encodeURIComponent(
			`*[_type == 'mission' && slug.current == '${pageSlug}']{
                title,
                slug,
                stages[]->{
                    ...,
                    content[]->{
                    ...,
                    instructor->{
                        ...,
                        stages[]->,
                        avatar{
                            asset ->
                        }
                    },
                    questions[]->
                    }
                }
            }`
		)

		const url = `https://tfh7h5l0.api.sanity.io/v1/data/query/production?query=${query}`

		const res = await axios.get(url)

		const course = res.data.result[0]

		if (!course) {
			return {
				notFound: true
			}
		} else {
			return {
				props: {
					course
				}
			}
		}
	}
}
