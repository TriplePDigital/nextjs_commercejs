/* eslint-disable no-unused-vars */
import { useState } from 'react'
import ReactPlayer from 'react-player/vimeo'
import Image from 'next/image'
import { Question, Bio } from '../Lesson'
import Link from 'next/link'
import imgConstructor from '../../util/img'

export default function Content({ body, className }) {
	const imgProps = imgConstructor(body?.instructor?.avatar?.asset)

	return body._type === 'video' ? (
		<div className={className}>
			<ReactPlayer
				url={body?.vimeoVideo?.url}
				config={{
					vimeo: {
						playerOptions: {
							byline: false,
							pip: true,
							title: false,
							controls: true
						}
					}
				}}
			/>
			<div className="flex flex-row items-center mt-5">
				{imgProps && (
					<div className="w-14 h-14 rounded-full overflow-hidden">
						<Image
							{...imgProps}
							layout="intrinsic"
							placeholder="blur"
							alt='the instructors avatar image in the shape of a circle'
						/>
					</div>
				)}
				<p className="ml-3">
					<span className="text-gray-500">Author:</span>{' '}
					<span className="font-semibold leading-loose">
						{body?.instructor?.name}
					</span>
				</p>
			</div>
			<h1 className="text-2xl leading-loose tracking-wide font-bold">
				{body.title}
			</h1>
			<Bio data={body?.instructor?.bio ?? ''} />
			<h1 className="text-2xl">Other stages by this instructor</h1>
			{body?.instructor?.stages.map((stage, index) => (
				<Link href="" key={index}>
					<a className="underline text-blue-700">{stage.title}</a>
				</Link>
			))}
		</div>
	) : (
		<div className={className}>
			<p>{body.title}</p>
			{body.minimumScore}
			<Question data={body.questions} />
		</div>
	)
}
