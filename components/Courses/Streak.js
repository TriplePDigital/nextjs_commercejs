import { FaTrophy } from 'react-icons/fa'

function Streak({ user }) {
	return (
		<div className="w-full flex flex-row justify-between bg-gray-100 shadow-md border px-4 py-6 rounded">
			<div className="w-1/2 mr-2">
				<h1 className="text-3xl font-semibold">Welcome back {user ? user?.firstName : ''}!</h1>
				<p className="text-gray-600 font-light text-base leading-loose">You are on a {245} day learning streak. Extend your streak by completing a lessons today.</p>
			</div>
			<div className="w-1/2 flex flex-col ml-2 justify-center">
				<div className="flex flex-row w-full items-center justify-end mb-2">
					<FaTrophy
						fontSize={32}
						className="text-gray-400 mr-4"
					/>
					<h2 className="text-xl text-gray-400 w-full font-semibold">
						Complete <span className="text-black">{15}</span> more lessons to level up
					</h2>
				</div>
				<div className="relative w-full">
					<span className="absolute bg-ncrma-600 rounded-full font-bold text-white w-1/3 px-4 py-1 top-0 left-0">LEVEL {2}</span>
					<span className="block text-right bg-ncrma-400 rounded-full font-bold text-white w-full px-4 py-1 ">LEVEL {3}</span>
				</div>
			</div>
		</div>
	)
}

export default Streak
