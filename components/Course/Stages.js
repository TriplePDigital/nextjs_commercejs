import Link from 'next/link'

export default function Stages({ mission, stages, title }) {
	return (
		<>
			<ul className="w-3/12 bg-gray-100 shadow-md border px-4 py-6 mt-6 mx-2 mr-0 rounded">
				{title}

				{stages.data.map((chapter, chIndex) => {
					const { title: stageTitle, videos } = chapter.attributes
					return (
						<div
							className="border border-gray-400 rounded-xl p-5 my-4 bg-white shadow-inner"
							key={chIndex}
						>
							<h2 className="text-lg font-semibold leading-loose">
								{stageTitle}
							</h2>
							<>
								{videos.data.map((video, cntIndex) => {
									const {
										duration,
										title: contentTitle,
										order_in_course
									} = video.attributes
									return (
										<div
											className="flex flex-row items-center justify-between w-full"
											key={cntIndex}
										>
											<Link
												href={`/mission/${mission}/${stageTitle}/${order_in_course}`}
											>
												<a
													className={`py-2 px-4 my-2 text-black rounded-lg`}
												>
													{contentTitle}
												</a>
											</Link>
											<span className="text-sm text-gray-500">
												{`${duration || '0'}:00`}
											</span>
										</div>
									)
								})}
							</>
						</div>
					)
				})}
			</ul>
		</>
	)
}
