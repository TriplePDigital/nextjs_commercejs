import { FaBook, FaCoffee, FaPizzaSlice } from 'react-icons/fa'

export const TakeQuiz = () => {
	return (
		<div className="w-full mt-10">
			<div className="w-2/3 mx-auto text-center">
				<h1 className="text-3xl font-semibold">Pause for a second</h1>
				<p className="leading-loose tracking-wide">This page is for you to take a break, relax and collect your mind before heading into your quiz. Once you are ready, use the navigation on the right side to access your quiz.</p>
			</div>
			<div className="flex gap-5 mx-auto w-1/3 items-center justify-between mt-10 text-center">
				<span className="flex flex-col items-center">
					<FaCoffee
						size={100}
						className="opacity-30"
					/>
					<p>Take a 5 minute coffee break!</p>
				</span>
				<span className="flex flex-col items-center">
					<FaBook
						size={100}
						className="opacity-30"
					/>
					<p>Read your notes one last time!</p>
				</span>
				<span className="flex flex-col items-center">
					<FaPizzaSlice
						size={100}
						className="opacity-30"
					/>
					<p>Get some quick bites in!</p>
				</span>
			</div>
		</div>
	)
}
