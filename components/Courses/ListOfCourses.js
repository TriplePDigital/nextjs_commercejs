import imgConstructor from '../../util/img'
import Image from 'next/image'
import Link from 'next/link'
import { ReactTooltip } from 'react-tooltip'
import Loader from '../util/Loader'
import { FaUserGraduate } from 'react-icons/fa'

export default function ListOfCourses({ course, key }) {
	const { attributes } = course
	console.log(attributes)
	return !course ? (
		<Loader />
	) : (
		<>
			<div
				key={key}
				className="xl:w-1/4 lg:w-1/3 md:w-1/2 w-full first:ml-0 first:mr-0 lg:first:ml-0 lg:first:mx-0 lg:mx-3 mx-0 border rounded-md shadow-md lg:mb-0 mb-6 h-min"
				// data-tip={
				// 	attributes?.description.length >= 100
				// 		? `${attributes?.description.substring(0, 250)}...`
				// 		: attributes?.description
				// }
			>
				{/* TODO: figure out if we need tooltip over the courses or not. might need to get a different tooltip lib */}
				{/* <ReactTooltip
					place="right"
					type="dark"
					effect="solid"
					className="w-1/4 rounded-sm border border-gray-50 shadow-xl"
					arrowColor="black"
					backgroundColor="black"
					textColor="white"
				/> */}
				<div className="relative h-44 w-full">
					<Image
						src={`http://localhost:1337${attributes?.cover.data.attributes.url}`}
						layout="fill"
						objectFit="cover"
						objectPosition="center"
						quality={100}
						alt={attributes?.cover.data.attributes.caption}
						placeholder="blur"
						blurDataURL={`http://localhost:1337${attributes?.cover.data.attributes.formats.thumbnail.url}`}
					/>
					<div className="bg-red-500 opacity-75 absolute left-0 top-0 h-full w-full"></div>
				</div>
				<div className="p-3">
					{/* course title */}
					<h1 className="font-semibold text-xl">
						<Link passHref href={`/mission/${attributes?.slug}`}>
							<a className="text-black font-bold text-xl">
								{attributes?.title}
							</a>
						</Link>
					</h1>

					{/* progress bar */}
					<div className="w-full bg-ncrma-300 rounded-full h-full my-3">
						<div
							className="bg-ncrma-600 rounded-full px-4 text-white"
							style={{ width: `67%` }}
						>
							{' '}
							{67}%
						</div>
					</div>

					{/* enrollment line */}
					<div className="flex my-4">
						<div className="flex items-center">
							<FaUserGraduate className="mr-2 text-gray-300" />
							<p className="text-gray-600">Enrolled:</p>
						</div>
						<span className="font-semibold ml-2">
							{attributes.enrollments.data.length}
						</span>
					</div>

					{/* instructors being mapped out */}
					<ul>
						{attributes?.instructors.data.map(
							(instructor, index) => (
								<li
									className="text-base text-gray-600 underline"
									key={index}
								>
									{instructor.attributes.firstName},{' '}
									{instructor.attributes.middleName || ''},{' '}
									{instructor.attributes.lastName}
								</li>
							)
						)}
					</ul>
				</div>
			</div>
		</>
	)
}
