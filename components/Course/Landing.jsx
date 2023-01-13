import React, { useContext } from 'react'
import { AiFillStar, AiOutlineClockCircle } from 'react-icons/ai'
import { RiBook2Line } from 'react-icons/ri'
import { MdOutlineAssignment } from 'react-icons/md'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import mdConfig from '@/util/md'
import { cartContextObject } from '../../pages/_app'
import checkout from '@/util/checkout'
import Link from 'next/link'
import { useNextSanityImage } from 'next-sanity-image'
import { client } from '@/util/config'
import Picture from '@/components/util/Picture'
import moment from 'moment/moment'

const countNumberOfCheckpoints = (stages) => {
	let count = 0
	stages.map((stage) => {
		stage.checkpoints.map(() => {
			count++
		})
	})
	return count
}

const countCourseDuration = (stages) => {
	let count = 0
	stages.map((stage) => {
		stage.checkpoints.map((checkpoint) => {
			count += checkpoint.type.duration
		})
	})
	return moment.utc(count * 1000).format('HH:mm:ss')
}

const Landing = ({ mission }) => {
	const ctx = useContext(cartContextObject)

	const numberOfCheckpoints = countNumberOfCheckpoints(mission.stages)

	const courseDuration = countCourseDuration(mission.stages)

	const addToCart = (item) => {
		ctx.addProductToCart({ item, quantity: 1 })
	}

	const imageProps = useNextSanityImage(client, mission?.coverImage)

	return (
		<div className="flex mx-auto w-full my-3">
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
						{numberOfCheckpoints}
					</div>
					<div className="text-gray-500 flex items-center gap-1">
						<MdOutlineAssignment />
						<span className="font-medium">Chapters</span>
						{mission.stages?.length}
					</div>
					<div className="text-gray-500 flex items-center gap-1">
						<AiOutlineClockCircle />
						{courseDuration}
					</div>
				</div>
				<div className="relative h-full w-full mt-6">
					{/* TODO: Either show cover image or preview video if available */}
					<Image
						src={imageProps.src}
						loader={imageProps.loader}
						blurDataURL={imageProps.blurDataURL}
						placeholder="blur"
						layout="fill"
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
										<Picture
											avatar={instructor.avatar}
											alt={'the instructors avatar image in' + ' the shape of a circle'}
											quality={50}
										/>
										<div className="rounded-full absolute top-0 left-0 h-full w-full bg-ncrma-500 opacity-40"></div>
									</div>
									<div className="flex flex-col gap-1 text-sm text-gray-700">
										<Link
											passHref={true}
											href={`/user/instructor/${instructor._id}`}
										>
											<a>
												<span className="block font-medium hover:underline">{instructor.name}</span>
											</a>
										</Link>
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
				{!mission.sku ? (
					<>
						<div className="flex flex-col gap-2">
							{mission.activePromo ? (
								<Link href={`/promo/${mission.activePromo.slug}`}>
									<a className="text-center bg-transparent border-2 border-ncrma-400 hover:bg-ncrma-400 text-back hover:text-white uppercase font-medium rounded w-1/2 mx-auto px-4 py-3">View Promotional Offer</a>
								</Link>
							) : (
								<p>We apologize, but at this time you aren&apos;t allowed to purchase this product. Please contact an administrator if you believe this is a mistake.</p>
							)}
						</div>
					</>
				) : (
					<>
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
					</>
				)}
			</div>
		</div>
	)
}

export default Landing
