import { useEffect, useState } from 'react'
import { getSession } from 'next-auth/client'
import getQuizAttempts from '@/util/getQuizAttempts'
import Table from './Table'
import { getEnrollmentsPerUser } from '@/util/getEnrollments'
import getUserFromSession from '@/util/getUserFromSession'
import Link from 'next/link'
import { MdOutlineDashboard, MdQuiz } from 'react-icons/md'
import { GrUserAdmin } from 'react-icons/gr'
import { BsGraphUp } from 'react-icons/bs'
import imgConstructor from '@/util/img'
import Image from 'next/image'
import { BsSearch } from 'react-icons/bs'

function Quiz({ quizAttempts }) {
	const [filteredEnrollment, setFilteredEnrollment] = useState(null)
	const [searchTerm, setSearchTerm] = useState('')

	const handleSearch = (event) => {
		event.preventDefault()

		if (searchTerm.length >= 2) {
			// do search query
		}
	}

	useEffect(() => {}, [filteredEnrollment])

	return (
		<section className="flex flex-col md:flex-row gap-5">
			<aside className="h-full bg-gray-50 w-full md:w-2/12 mt-5 rounded flex-col shadow-md border">
				<Link href="/admin/">
					<a className="flex items-center gap-3 hover:bg-gray-200 px-5 py-5 border-b border-gray-300 font-semibold cursor-pointer">
						<MdOutlineDashboard size={20} className="opacity-30" />
						Management Portal
					</a>
				</Link>

				<Link href="/admin/quiz/">
					<a className="flex items-center gap-3 hover:bg-gray-200 px-5 py-5 border-b border-gray-300 font-semibold cursor-pointer">
						<MdQuiz size={20} className="opacity-30" />
						Quizzes
					</a>
				</Link>

				<Link href="/admin/enrollment/">
					<a className="flex items-center gap-3 hover:bg-gray-200 px-5 py-5 border-gray-300 font-semibold cursor-pointer">
						<GrUserAdmin size={20} className="opacity-30" />
						Enrollments
					</a>
				</Link>

				<Link href="/admin/progress/">
					<a className="flex items-center gap-3 hover:bg-gray-200 px-5 py-5 border-t border-gray-300 font-semibold cursor-pointer">
						<BsGraphUp size={20} className="opacity-30" />
						Progress
					</a>
				</Link>
			</aside>
			<section className="w-full my-5">
				<div className="flex items-center w-full mx-auto justify-between mb-2">
					{/* <form onSubmit={(e) => handleSearch(e)} className="w-1/4">
						<input
							type="text"
							defaultValue={searchTerm}
							className="border bg-gray-100 shadow rounded py-3 px-4 w-1/2"
							placeholder="Search by email or name"
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<button type="submit" className="w-1/2">
							Search
						</button>
					</form> */}
					<form
						onSubmit={(e) => handleSearch(e)}
						className={`w-1/2 flex gap-5 items-center `}
					>
						<input
							type="text"
							defaultValue={searchTerm}
							className="border bg-gray-100 shadow rounded py-3 px-4 w-1/2"
							placeholder="Search by email or name"
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<button
							type="submit"
							className="min-w-fit w-40 h-full bg-ncrma-300 hover:bg-ncrma-500 focus:bg-ncrma-500 focus:ring-1 rounded px-5 py-2 flex gap-3 justify-center items-center"
						>
							<BsSearch size={16} />
							Search
						</button>
					</form>
				</div>
				<div className="w-full mx-auto">
					{/* <Table
						quizAttempts={quizAttempts}
						enrollments={filteredEnrollment}
						selection={selection}
					/> */}
					<AllQuizAttempts quizAttempts={quizAttempts} />
				</div>
			</section>
		</section>
	)
}

function AllQuizAttempts({ quizAttempts }) {
	return (
		<>
			<table className="w-full bg-gray-50 shadow-md border px-4 py-6 rounded">
				<thead className="bg-gray-200 text-gray-500 font-light font-sans">
					<tr className="flex px-4 py-2">
						<th className="flex basis-1/5">Quiz</th>
						<th className="flex basis-1/5">Course</th>
						<th className="flex basis-1/5">Student</th>
						<th className="flex basis-1/5">Score</th>
						<th className="flex basis-1/5">Action</th>
					</tr>
				</thead>
				<tbody>
					{quizAttempts.map((attempt) => (
						<tr
							key={encodeURI(attempt._id)}
							className="flex py-2 border border-gray-200 px-4"
						>
							<td className="flex basis-1/5 items-center">
								{attempt.checkpoint?.quiz?.title}
							</td>
							<td className="flex basis-1/5 items-center">
								{attempt.checkpoint?.stage.mission?.title}
							</td>
							<td className="flex basis-1/5 items-center">
								<div className="h-10 w-10 rounded-full overflow-hidden mr-2 relative">
									<Image
										{...imgConstructor(
											attempt.user.avatar.asset,
											{
												fit: 'fill'
											}
										)}
										alt="Instructor Avatar"
										layout="fill"
										quality={50}
									/>
									<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>{' '}
								</div>
								{attempt.user.firstName +
									' ' +
									attempt.user.lastName}
							</td>
							<td className="flex basis-1/5 items-center">
								{attempt.score}%
							</td>
							<td className="flex basis-1/5 items-center">
								<button className="bg-ncrma-300 rounded px-5 py-1 min-w-fit">
									Do something
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
}

export async function getServerSideProps(context) {
	const session = await getSession(context)
	if (!session) {
		return {
			redirect: {
				destination: '/auth/login',
				permanent: false
			}
		}
	} else {
		const user = await getUserFromSession(session.user.email)
		if (user.role === 'riskManager' || user.role === 'admin') {
			const quizAttempts = await getQuizAttempts()
			return {
				props: {
					quizAttempts
				}
			}
		} else {
			return {
				redirect: {
					destination: '/',
					permanent: false
				}
			}
		}
	}
}

export default Quiz
