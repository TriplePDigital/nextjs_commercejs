import React, { useContext } from 'react'
import Script from 'next/script'
import { AiFillStar, AiOutlineClockCircle } from 'react-icons/ai'
import { RiBook2Line } from 'react-icons/ri'
import { MdOutlineAssignment } from 'react-icons/md'
import Image from 'next/image'
import imgConstructor from '@/util/img'
import ReactMarkdown from 'react-markdown'
import mdConfig from '@/util/md'
import { cartContextObject } from '../../pages/_app'
import checkout from '@/util/checkout'

const Landing = ({ mission, numberOfCheckpoints, courseDuration }) => {
	const ctx = useContext(cartContextObject)

	const addToCart = (item) => {
		ctx.addProductToCart({ item, quantity: 1 })
	}

	return (
		<div className="flex mx-auto w-full my-3">
			<Script
				src="https://secure.nmi.com/token/CollectCheckout.js"
				data-checkout-key="checkout_public_pP7wBv6nWYqF275UnGzRV77k9H8KwacA"
			/>
			<div className="w-8/12 mr-8">
				<h1 className="text-4xl tracking-wide font-bold">{mission.title}</h1>
				<h2 className="text-lg font-medium text-gray-600">{mission.blurb}</h2>
				<div className="flex justify-between items-center">
					<div className=" flex items-center">
						<AiFillStar className="text-yellow-500 mr-2" />
						<span className="text-lg font-semibold mr-1">{5}.0</span>
						<span className="text-gray-500">(1512 Reviews)</span>
					</div>
					<div className="text-gray-500 flex items-center gap-1">
						<RiBook2Line className="" />
						<span className="font-medium">Lessons</span>
						{mission.stages?.length}
					</div>
					<div className="text-gray-500 flex items-center gap-1">
						<MdOutlineAssignment />
						<span className="font-medium">Chapters</span>
						{numberOfCheckpoints}
					</div>
					<div className="text-gray-500 flex items-center gap-1">
						<AiOutlineClockCircle />
						{courseDuration}
					</div>
				</div>
				<div className="relative h-full w-full mt-6">
					{/* TODO: Either show cover image or preview video if available */}
					<Image
						{...imgConstructor(mission.coverImage, {
							fit: 'fill'
						})}
						alt={mission.title}
						objectFit="cover"
						objectPosition="center"
						quality={50}
					/>
				</div>
				<h2 className="text-xl leading-loose tracking-wide font-bold mb-1 mt-6">About The Instructors</h2>
				<div className="flex flex-row items-start justify-between mt-6">
					{mission.instructors.map((instructor, index) => {
						return (
							<div
								key={index}
								className="flex flex-col"
							>
								<div className="flex items-center gap-4 flex-1">
									<div className="relative w-14 h-14 rounded-full overflow-hidden">
										<Image
											{...imgConstructor(instructor.avatar, {
												fit: 'fill'
											})}
											placeholder="blur"
											alt="the instructors avatar image in the shape of a circle"
										/>
										<div className="rounded-full absolute top-0 left-0 h-full w-full bg-ncrma-500 opacity-40"></div>
									</div>
									<div className="flex flex-col gap-1 text-sm text-gray-700">
										<span className="block font-medium">{instructor.name}</span>
										<span className="block underline lowercase">{instructor.email}</span>
									</div>
								</div>
								<ReactMarkdown
									components={mdConfig}
									className="my-2"
								>
									{instructor.bio}
								</ReactMarkdown>
							</div>
						)
					})}
				</div>
				<h2 className="text-xl leading-loose tracking-wide font-bold mb-1 mt-6">About This Course</h2>
				<ReactMarkdown components={mdConfig}>{mission?.description}</ReactMarkdown>
				<ul className="mt-2 flex">{/* TODO: This is where we are going to create the course accordion */}</ul>
			</div>
			<div className="w-4/12 p-5 bg-white border-l border-gray-200 flex flex-col gap-3">
				{/* TODO: Add ability to give feedback on courses before tackling this... */}
				{/* <div className="text-gray-500 flex items-center gap-4">
					<BsTagsFill className="mr-1" />
					<div className="gap-2 flex">
						{mission.categories.map((category, index) => {
							return (
								<span
									key={index}
									className="px-4 py-1 rounded-full bg-ncrma-600 hover:bg-ncrma-800 hover:shadow cursor-pointer block text-sm text-white"
								>
									{category}
								</span>
							)
						})}
					</div>
				</div> */}
				<button
					className="bg-ncrma-400 hover:bg-ncrma-600 text-white uppercase font-medium rounded w-1/2 mx-auto px-4 py-3"
					onClick={() => addToCart(mission._id)}
				>
					Add to Cart
				</button>
				<button
					className="bg-transparent border-2 border-ncrma-400 hover:bg-ncrma-400 text-back hover:text-white uppercase font-medium rounded w-1/2 mx-auto px-4 py-3"
					onClick={() => {
						checkout([
							{
								sku: mission.sku,
								quantity: 1
							}
						])
					}}
				>
					One Click Checkout
				</button>
			</div>
		</div>
	)
}

export default Landing
