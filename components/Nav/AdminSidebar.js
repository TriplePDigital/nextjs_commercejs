import Link from 'next/link'
import { useState } from 'react'
import { BsFillCloudUploadFill, BsGraphUp, BsPeopleFill } from 'react-icons/bs'
import { GrUserAdmin } from 'react-icons/gr'
import { MdOutlineDashboard, MdQuiz } from 'react-icons/md'
import { useRouter } from 'next/router'
import { RiTimerFlashFill } from 'react-icons/ri'
import { FaCanadianMapleLeaf } from 'react-icons/fa'

const AdminSidebar = () => {
	const [showQuizChildren, setShowQuizChildren] = useState(false)
	const [showEnrollmentChildren, setShowEnrollmentChildren] = useState(false)

	const router = useRouter()

	return (
		<aside className="h-full bg-gray-50 w-full lg:w-2/12 mt-5 rounded flex-col shadow-md border relative">
			<Link href="/admin/">
				<a className="flex items-center gap-3 hover:bg-gray-200 px-5 py-5 border-b border-gray-300 font-semibold cursor-pointer">
					<MdOutlineDashboard
						size={20}
						className="opacity-30"
					/>
					Management Portal
				</a>
			</Link>

			<a
				className="flex items-center gap-3 hover:bg-gray-200 px-5 py-5 border-b border-gray-300 font-semibold cursor-pointer"
				onClick={() => {
					setShowQuizChildren(!showQuizChildren)
					setShowEnrollmentChildren(false)
				}}
			>
				<MdQuiz
					size={20}
					className="opacity-30"
				/>
				Quizzes
			</a>
			{showQuizChildren ? (
				<ul className="text-white w-full">
					<Link
						href="/admin/quiz?tabIndex=0"
						passHref={false}
					>
						<a className={`w-full block hover:bg-gray-700 px-3 py-2 border-gray-300 cursor-pointer border-b ${router.query.tabIndex === '0' && router.pathname.includes('/admin/quiz') ? 'bg-gray-700' : 'bg-gray-800'}`}>
							<li className="flex gap-2 items-center text-sm">
								<RiTimerFlashFill className="opacity-75 text-white" />
								<span className="">Latest Quiz Attempts</span>
							</li>
						</a>
					</Link>
					<Link
						href="/admin/quiz?tabIndex=1"
						passHref={false}
					>
						<a className={`w-full block hover:bg-gray-700 px-3 py-2 border-gray-300 cursor-pointer border-b ${router.query.tabIndex === '1' && router.pathname.includes('/admin/quiz') ? 'bg-gray-700' : 'bg-gray-800'}`}>
							<li className="flex gap-2 items-center text-sm">
								<BsFillCloudUploadFill className="opacity-75 text-white" />
								<span className="">Quiz Upload Wizard</span>
							</li>
						</a>
					</Link>
				</ul>
			) : null}

			<a
				className="flex items-center gap-3 hover:bg-gray-200 px-5 py-5 border-gray-300 font-semibold cursor-pointer"
				onClick={() => {
					setShowEnrollmentChildren(!showEnrollmentChildren)
					setShowQuizChildren(false)
				}}
			>
				<GrUserAdmin
					size={20}
					className="opacity-30"
				/>
				Enrollments
			</a>
			{showEnrollmentChildren ? (
				<ul className="bg-gray-800 text-white w-full">
					<Link
						href="/admin/enrollment?tabIndex=0"
						passHref={false}
					>
						<a className={`w-full block hover:bg-gray-700 px-3 py-2 border-gray-300 cursor-pointer border-b ${router.query.tabIndex === '0' && router.pathname.includes('/admin/enrollment') ? 'bg-gray-700' : 'bg-gray-800'}`}>
							<li className="flex gap-2 items-center text-sm">
								<BsPeopleFill className="opacity-75 text-white" />
								<span className="">Enrollments Per User</span>
							</li>
						</a>
					</Link>
					<Link
						href="/admin/enrollment?tabIndex=1"
						passHref={false}
					>
						<a className={`w-full block hover:bg-gray-700 px-3 py-2 border-gray-300 cursor-pointer border-b ${router.query.tabIndex === '1' && router.pathname.includes('/admin/enrollment') ? 'bg-gray-700' : 'bg-gray-800'}`}>
							<li className="flex gap-2 items-center text-sm">
								<RiTimerFlashFill className="opacity-75 text-white" />
								<span className="">Latest Enrollments</span>
							</li>
						</a>
					</Link>
					<Link
						href="/admin/enrollment?tabIndex=2"
						passHref={false}
					>
						<a className={`w-full block hover:bg-gray-700 px-3 py-2 border-gray-300 cursor-pointer ${router.query.tabIndex === '2' && router.pathname.includes('/admin/enrollment') ? 'bg-gray-700' : 'bg-gray-800'}`}>
							<li className="flex gap-2 items-center text-sm">
								<BsFillCloudUploadFill className="opacity-75 text-white" />
								<span className="">Enrollment Upload Wizard</span>
							</li>
						</a>
					</Link>
				</ul>
			) : null}

			<Link href="/admin/reports">
				<a className="flex items-center gap-3 hover:bg-gray-200 px-5 py-5 border-t border-gray-300 font-semibold cursor-pointer">
					<BsGraphUp
						size={20}
						className="opacity-30"
					/>
					Progress
				</a>
			</Link>

			<Link href="/admin/crpp">
				<a className="flex items-center gap-3 hover:bg-gray-200 px-5 py-5 border-t border-gray-300 font-semibold cursor-pointer">
					<FaCanadianMapleLeaf
						size={20}
						className="opacity-30"
					/>
					CRP²
				</a>
			</Link>
		</aside>
	)
}

export default AdminSidebar
