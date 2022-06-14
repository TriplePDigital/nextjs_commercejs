/* eslint-disable no-unused-vars */
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai'
import { BsThreeDots } from 'react-icons/bs'
import Agenda from '../util/Agenda'
import { fetcher } from '@/util/fetcher'
import Link from 'next/link'

export default function Webinar({ webinar }) {
	function getHour(datetime) {
		let temp = new Date(datetime)
		let hour = temp.getHours()
		let minutes = temp.getMinutes().toString()
		let timeZone = temp.getTimezoneOffset() / 60
		if (hour >= 12) {
			return `${hour > 12 ? hour - 12 : hour}:${
				minutes === '0' ? '00' : minutes
			} PM (GMT${timeZone > 0 ? `-${timeZone}` : timeZone})`
		} else {
			return `${hour}:${minutes === '0' ? '00' : minutes} AM GMT${
				timeZone > 0 ? `-${timeZone}` : timeZone
			}`
		}
	}
	function getDate(datetime) {
		let temp = new Date(datetime)
		let day = temp.getDate().toString()
		let month = (temp.getMonth() + 1).toString()
		let year = temp.getFullYear().toString()
		return `${month?.length === 1 ? `0${month}` : month}/${
			day?.length === 1 ? `0${day}` : day
		}/${year}`
	}
	return (
		<>
			<aside className="w-1/4 bg-gray-100 px-4 py-6 ml-4 shadow-md border rounded h-full">
				<h1 className="text-2xl mb-4 font-semibold">{webinar.title}</h1>
				<p className="text-gray-600 tracking-wide mb-2">
					{webinar.description}
				</p>
				<div className="flex flex-row justify-between items-center">
					<div className="flex flex-row items-center">
						<AiOutlineCalendar
							fontSize={24}
							className="text-gray-400 mr-2"
						/>
						<div className="flex flex-col">
							<p>{getDate(webinar.startingAt)}</p>
							<p className="text-gray-500">Date</p>
						</div>
					</div>
					<div className="flex flex-row items-center">
						<AiOutlineClockCircle
							fontSize={24}
							className="text-gray-400 mr-2"
						/>
						<div className="flex flex-col">
							<p>
								{/* {webinar.startingAt.slice(11, 16)} -{' '}
								{webinar.endingAt.slice(11, 16)} */}
								{getHour(webinar.startingAt)}
							</p>
							<p className="text-gray-500">Time</p>
						</div>
					</div>
				</div>
				<h2 className="text-xl mt-5 mb-2 font-semibold">
					Presenters & Instructors
				</h2>
				<div className="py-4 flex flex-row relative mb-5">
					{webinar.presenters.map((presenter, i) => (
						<div
							className="w-12 h-12 bg-no-repeat bg-cover bg-center rounded-full aspect-square relative -ml-4 first:ml-0"
							style={{
								backgroundImage: `url(${presenter.avatar.asset.url})`
							}}
							key={i}
						>
							<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
						</div>
					))}

					{/* TODO: figure out a way to put the "more" dots under the other profile pics */}
					{webinar.presenters.length > 5 ? (
						<div className="w-12 h-12 bg-no-repeat bg-cover bg-center rounded-full aspect-square relative -ml-4 flex items-center justify-center cursor-pointer">
							<BsThreeDots style={{ zIndex: '1' }} />
							<span
								className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300"
								style={{ zIndex: '0' }}
							></span>
						</div>
					) : null}
				</div>
				<h2 className="text-xl mb-2 font-semibold">Agenda</h2>
				{webinar.agenda.map((agendaEntry, j) => (
					<Agenda
						key={j}
						time={agendaEntry.startTime
							.slice(11, 16)
							.replaceAll('-', ' ')}
						title={agendaEntry.title}
					/>
				))}

				<div className="flex xl:flex-row flex-col w-full justify-between mt-5">
					<Link passHref href={webinar.joinLink}>
						<a
							target="_blank"
							className="border-2 border-transparent bg-ncrma-500 text-white px-8 py-3 rounded xl:mr-2 mx-0 my-1  uppercase leading-loose tracking-wide font-semibold text-center"
						>
							{' '}
							Attend
						</a>
					</Link>
					<Link passHref href={webinar.purchaseLink}>
						<a
							target="_blank"
							className="border-2 border-ncrma-500 text-black px-8 py-3 rounded xl:ml-2 mx-0 my-1 uppercase leading-loose tracking-wide font-semibold text-center"
						>
							{' '}
							Purchase
						</a>
					</Link>
				</div>
			</aside>
		</>
	)
}

// export async function getStaticProps(ctx) {
// 	const webinar = await fetcher(`*[_type == 'webinar' ]{
// 	...,
// 	presenters[]->
// 	}`)
// 	console.log(webinar)
// 	if (!webinar) {
// 		return {
// 			notFound: true
// 		}
// 	} else {
// 		return {
// 			props: {
// 				webinar
// 			}
// 		}
// 	}
// }
