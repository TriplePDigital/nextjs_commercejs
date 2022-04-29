import Link from 'next/link'
import { AiOutlinePlayCircle, AiFillPlayCircle } from 'react-icons/ai'
import { MdOutlineQuiz } from 'react-icons/md'
import isVideo from '@/util/isVideo'
import { Loader } from '../util'
import { useEffect } from 'react'

const secondsToTime = (e) => {
	let h = Math.floor(e / 3600)
			.toString()
			.padStart(2, '0'),
		m = Math.floor((e % 3600) / 60)
			.toString()
			.padStart(2, '0'),
		s = Math.floor(e % 60)
			.toString()
			.padStart(2, '0')

	if (h === '00') {
		return `${m}:${s}`
	}

	return `${h}:${m}:${s}`
}

export default function Stages({
	stages,
	title,
	setStageContext,
	setCheckpointContext
}) {
	return (
		<>
			<ul className="w-3/12 px-4 py-6 mt-6 mx-2 mr-0">
				<h1 className="font-bold text-lg">{title}</h1>

				{stages.map((stage, chIndex) => {
					// const { title: stageTitle, videos } = chapter.attributes
					return (
						<div
							className="bg-gray-100 shadow-md border rounded p-5 my-4"
							key={chIndex}
						>
							<h2 className="text-lg font-semibold leading-loose">
								{stage.title}
							</h2>
							<>
								{stage.checkpoints.map(
									(checkpoint, cntIndex) => (
										<>
											<div
												className={`flex flex-row items-center justify-between w-full ${
													checkpoint.progress
														?.status === 100
														? 'opacity-25'
														: ''
												}`}
												key={cntIndex}
											>
												<a
													className={`py-2 my-2 text-black rounded-lg flex items-center cursor-pointer`}
													onClick={() => {
														setStageContext(chIndex)
														setCheckpointContext(
															cntIndex
														)
													}}
												>
													<div className="text-4xl mr-4 text-ncrma-400 relative z-10">
														{isVideo(
															checkpoint.type
														) ? (
															<AiFillPlayCircle />
														) : (
															<MdOutlineQuiz />
														)}
														<div className="bg-ncrma-800 w-full h-full absolute left-0 top-0 -z-10 rounded-full"></div>
													</div>
													{checkpoint.title}
												</a>
												<span className="text-sm text-gray-500">
													{isVideo(checkpoint.type)
														? secondsToTime(
																checkpoint.type
																	?.duration
														  )
														: null}
												</span>
											</div>
										</>
									)
								)}
							</>
						</div>
					)
				})}
			</ul>
		</>
	)
}
