import Link from 'next/link'
import React from 'react'
import { BsGraphUp } from 'react-icons/bs'
import { GrUserAdmin } from 'react-icons/gr'
import { MdOutlineDashboard, MdQuiz } from 'react-icons/md'

const AdminSidebar = () => {
	return (
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
	)
}

export default AdminSidebar
