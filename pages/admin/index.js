import { getSession } from 'next-auth/client'
import getUserFromSession from '@/util/getUserFromSession'
import { getMostPopularCourses } from '@/util/getEnrollments'
import imgConstructor from '@/util/img'
import Image from 'next/image'
import AdminSidebar from '@/components/Nav/AdminSidebar'

function MemberManagementPage({ courses }) {
	return (
		<section className="flex flex-col md:flex-row gap-5">
			<AdminSidebar />
			<section className="w-full">
				<table className="w-full mx-auto mt-5 rounded shadow-md">
					<thead className="flex w-full text-center font-semibold">
						<tr className="w-full bg-gray-200 flex items-center px-5 py-2">
							<th className="border-gray-500 w-1/4">Course</th>
							<th className="border-l border-gray-500 w-1/4">
								Number of Students Enrolled
							</th>
							<th className="border-l border-r border-gray-500 w-1/4">
								Instructor
							</th>
							<th className="border-gray-500 border-l-0 w-1/4">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="flex flex-col">
						{courses.map((course) => (
							<tr
								key={course._id}
								className="border-b px-5 py-2 flex items-center relative"
							>
								<span
									className="block w-2 h-full absolute left-0 top-0"
									style={{
										backgroundColor: `${course.colorCode}`
									}}
								></span>
								<td className="w-1/4">{course.title}</td>
								<td className="w-1/4 text-center">
									{course.memberCount}
								</td>
								<td className="w-1/4">
									{course.instructors.map(
										(instructor, index) => (
											<div
												key={index}
												className="flex items-center justify-start gap-2"
											>
												<div className="h-10 w-10 rounded-full overflow-hidden relative">
													<Image
														{...imgConstructor(
															instructor?.avatar,
															{
																fit: 'fill'
															}
														)}
														alt="Instructor Avatar"
														layout="fill"
														quality={50}
													/>
													<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
												</div>
												<div className="flex flex-col">
													<span className="">
														{instructor.name}
													</span>
													<span className="text-gray-500 text-sm font-light">
														{instructor.email}
													</span>
												</div>
											</div>
										)
									)}
								</td>
								<td className="w-1/4 text-center">
									<button className="bg-ncrma-300 text-white font-semibold py-2 px-4 rounded hover:bg-ncrma-500 hover:text-white focus:text-white focus:bg-ncrma-500 focus:ring-2">
										View
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</section>
	)
}

export default MemberManagementPage

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
			const courses = await getMostPopularCourses()
			return {
				props: {
					courses
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
