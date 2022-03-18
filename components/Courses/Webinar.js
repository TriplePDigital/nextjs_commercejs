import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai'
import { BsThreeDots } from 'react-icons/bs'
import Agenda from '../util/Agenda'

export default function Webinar() {
	return (
		<>
			<aside className="w-1/4 bg-gray-100 px-4 py-6 ml-4 shadow-md border rounded min-h-screen">
				<h1 className="text-2xl mb-4 font-semibold">
					{'Risk Management: Insurance Webinar'}
				</h1>
				<p className="text-gray-600 tracking-wide mb-2">
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Itaque quidem in ad repellendus. Saepe, accusantium veniam
					porro exercitationem impedit commodi, deleniti sapiente
					repellendus quas quasi quos corrupti, labore assumenda
					neque!
				</p>
				<div className="flex flex-row justify-between items-center">
					<div className="flex flex-row items-center">
						<AiOutlineCalendar
							fontSize={24}
							className="text-gray-400 mr-2"
						/>
						<div className="flex flex-col">
							<p>{'December 17'}</p>
							<p className="text-gray-500">Date</p>
						</div>
					</div>
					<div className="flex flex-row items-center">
						<AiOutlineClockCircle
							fontSize={24}
							className="text-gray-400 mr-2"
						/>
						<div className="flex flex-col">
							<p>{'9:00AM-1:00PM'}</p>
							<p className="text-gray-500">Time</p>
						</div>
					</div>
				</div>
				<h2 className="text-xl mt-5 mb-2 font-semibold">
					Presenters & Instructors
				</h2>
				<div className="py-4 flex flex-row relative mb-5">
					<div
						className="w-12 h-12 bg-no-repeat bg-cover bg-center rounded-full aspect-square relative"
						style={{
							backgroundImage: `url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80)`
						}}
					>
						<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
					</div>
					<div
						className="w-12 h-12 bg-no-repeat bg-cover bg-center rounded-full aspect-square relative -ml-4"
						style={{
							backgroundImage: `url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80)`
						}}
					>
						<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
					</div>
					<div
						className="w-12 h-12 bg-no-repeat bg-cover bg-center rounded-full aspect-square relative -ml-4"
						style={{
							backgroundImage: `url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80)`
						}}
					>
						<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
					</div>
					<div
						className="w-12 h-12 bg-no-repeat bg-cover bg-center rounded-full aspect-square relative -ml-4"
						style={{
							backgroundImage: `url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80)`
						}}
					>
						<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
					</div>
					{/* TODO: figure out a way to put the "more" dots under the other profile pics */}
					<div className="w-12 h-12 bg-no-repeat bg-cover bg-center rounded-full aspect-square relative -ml-4 flex items-center justify-center cursor-pointer">
						<BsThreeDots style={{ zIndex: '1' }} />
						<span
							className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300"
							style={{ zIndex: '0' }}
						></span>
					</div>
				</div>
				<h2 className="text-xl mb-2 font-semibold">Agenda</h2>
				<Agenda time="9:00AM" title="Introductions" />
				<Agenda time="11:00AM" title="Insurance Premium" />
				<div className="flex xl:flex-row flex-col w-full justify-between mt-5">
					<button className="border-2 border-transparent bg-ncrma-500 text-white px-8 py-3 rounded xl:mr-2 mx-0 my-1  uppercase leading-loose tracking-wide font-semibold">
						Attend
					</button>
					<button className="border-2 border-ncrma-500 text-black px-8 py-3 rounded xl:ml-2 mx-0 my-1 uppercase leading-loose tracking-wide font-semibold">
						Purchase
					</button>
				</div>
			</aside>
		</>
	)
}
