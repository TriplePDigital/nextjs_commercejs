import { useEffect, useRef, useState } from 'react'
import { getSession } from 'next-auth/client'
import getUserFromSession from '@/util/getUserFromSession'
import { getEnrollmentsPerUser, getLatestEnrollments } from '@/util/getEnrollments'
import { Loader } from '@/components/util'
import { BsSearch } from 'react-icons/bs'
import Papa from 'papaparse'
import { client } from '@/util/config'
import { Accordion, Modal } from 'flowbite-react'
import { calculateCourseProgress, filterEnrollment } from '@/util/progress'
import Picture from '@/components/util/Picture'

function EnrollmentReportPage({ enrollments, latestEnrollments, tabIndex }) {
	const [filteredEnrollment, setFilteredEnrollment] = useState(enrollments)
	const [filteredLatestEnrollments, setFilteredLatestEnrollments] = useState(latestEnrollments)
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSearch = (event) => {
		event.preventDefault()

		if (searchTerm.length >= 2) {
			switch (tabIndex) {
				case 0:
					setLoading(true)
					getEnrollmentsPerUser(searchTerm, true)
						.then((res) => {
							setFilteredEnrollment(res)
							setLoading(false)
						})
						.catch((err) => {
							throw new Error(err)
						})
					break
				case 1:
					setLoading(true)
					getLatestEnrollments()
						.then((res) => {
							return res.filter((obj) => {
								return Object.values(obj).some((val) => {
									if (val?.email) {
										return val.email.includes(searchTerm)
									}
								})
							})
						})
						.then((arrFiltered) => {
							setFilteredLatestEnrollments(arrFiltered)
							setLoading(false)
						})
						.catch((err) => {
							throw new Error(err)
						})
					break
				default:
					break
			}
		}
	}
	// useEffect(() => {}, [filteredEnrollment, filteredLatestEnrollments])
	return (
		<section className="w-full mt-5">
			<div className="flex justify-between mb-5">
				<form
					onSubmit={(e) => handleSearch(e)}
					className={`lg:w-1/2 w-full flex gap-5 items-center ${tabIndex === 2 ? 'invisible' : 'visible'}`}
				>
					<input
						type="text"
						defaultValue={searchTerm}
						className="border bg-gray-100 shadow rounded py-3 px-4 lg:w-2/3 w-full"
						placeholder="Search by email or name"
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<button
						type="submit"
						className="min-w-fit lg:w-1/3  h-full bg-ncrma-300 hover:bg-ncrma-500 focus:bg-ncrma-500 focus:ring-1 rounded px-5 py-2 flex gap-3 justify-center items-center"
					>
						<BsSearch size={16} />
						Search
					</button>
				</form>
			</div>
			{loading ? (
				<Loader />
			) : (
				<>
					{tabIndex === 0 && (
						<AllEnrollments
							enrollments={filteredEnrollment}
							setEnrollments={setFilteredEnrollment}
							loading={loading}
						/>
					)}
					{tabIndex === 1 && <LatestEnrollments latestEnrollments={filteredLatestEnrollments} />}
					{tabIndex === 2 && <EnrollStudents enrollments={enrollments} />}
				</>
			)}
		</section>
	)
}

function AllEnrollments({ enrollments, loading, setEnrollments }) {
	const [open, setOpen] = useState(false)
	const [expandID, setExpandID] = useState(null)

	const handleExpand = (id) => {
		if (expandID === id) {
			setExpandID(null)
			setOpen(false)
		}
		setExpandID(id)
		setOpen(!open)
	}

	// const filterDuplicateProgressReports = (arr) => {
	// 	// arr.map((obj) => {
	// 	// 	if (obj.firstName === 'Diana') {
	// 	// 		obj.enrollment.map((enrDoc) => {
	// 	// 			if (enrDoc.progress?.length > 1) {
	// 	// 				const contentIDs = enrDoc.progress.map((progress) => {
	// 	// 					return progress.content._id
	// 	// 				})
	// 	// 				console.log(contentIDs)
	// 	// 				const uniqueContentIDs = []
	// 	// 				const filteredProgress = enrDoc.progress.filter(
	// 	// 					(v, index, self) => {
	// 	// 						const isDuplicate = contentIDs.includes(
	// 	// 							v.content._id
	// 	// 						)
	// 	// 						if (!isDuplicate) {
	// 	// 							uniqueContentIDs.push(v.content._id)
	// 	// 							return true
	// 	// 						}
	// 	// 						return false
	// 	// 					}
	// 	// 				)
	// 	// 				console.log(uniqueContentIDs)
	// 	// 				console.log(filteredProgress)
	// 	// 			}
	// 	// 		})
	// 	// 	}
	// 	// })
	// }

	useEffect(() => {
		// filterDuplicateProgressReports(enrollments)
	}, [enrollments])

	return loading ? (
		<Loader />
	) : (
		<>
			<table className="w-full text-center bg-gray-50 shadow-md border px-4 py-6 rounded">
				<thead className="w-full flex bg-gray-200 font-semibold font-sans">
					<tr className="flex items-center w-full px-4 py-2">
						<th className="border-r border-gray-500 w-1/4">User</th>
						<th className="border-x border-gray-500 w-1/4">Number of course enrollments</th>
						<th className=" border-gray-500 w-1/4">Progress</th>
						<th className="border-l border-gray-500 w-1/4">Certificates</th>
					</tr>
				</thead>
				<tbody className="flex flex-col">
					{enrollments &&
						enrollments.map((user, userIndex) => {
							const { enrollment } = filterEnrollment(user)
							return (
								<tr
									key={userIndex}
									className="flex items-center py-2 px-5 border border-gray-200 text-center"
								>
									<td className="basis-1/4 items-center flex">
										<div className="h-10 w-10 rounded-full overflow-hidden mr-2 relative">
											<Picture
												avatar={user.avatar.asset}
												quality={20}
												alt={'Instructor Avatar'}
											/>
											<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
										</div>
										<div className="flex flex-col items-start">
											<span className="">
												{user.firstName} {user.lastName}
											</span>

											<span className="text-sm text-gray-500">{user.email}</span>
										</div>
									</td>
									<td className="basis-1/4">{user.count}</td>
									<td className="basis-1/4">
										<>
											<button
												className="bg-ncrma-300 rounded px-5 py-1 min-w-fit"
												onClick={() => handleExpand(userIndex)}
											>
												{userIndex === expandID && open ? 'Hide course progress' : 'Show course progress'}
											</button>
											<Modal
												show={userIndex === expandID && open}
												onClose={() => setOpen(!open)}
												size={'2xl'}
												placement="center"
											>
												<Modal.Header>
													{user.firstName} {user.lastName}
												</Modal.Header>
												<Modal.Body className="max-h-screen overflow-y-scroll">
													{enrollment.map((enrollment, index) => {
														const progressPercentage = calculateCourseProgress(enrollment)
														return enrollment?.progress && enrollment?.course ? (
															<Accordion key={index}>
																<Accordion.Panel>
																	<Accordion.Title>{enrollment.course?.title}</Accordion.Title>
																	<Accordion.Content>
																		<div className="w-full flex items-center justify-between mb-6">
																			{`${progressPercentage}%`} Completed
																			<input
																				className="h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
																				type="range"
																				value={progressPercentage}
																				max={100}
																				min={0}
																			/>
																		</div>
																		<ul className="w-full list-disc font-light text-sm">
																			{enrollment?.course?.stages.map((stage, i) => {
																				return (
																					<li
																						key={i}
																						className="ml-8"
																					>
																						<div>
																							{stage.title}
																							<ul className="w-full list-disc font-light text-sm">
																								{enrollment.progress.map((progress, ind) => {
																									return progress.content.parentStage === stage._id && progress.status !== 0 ? (
																										<li
																											key={ind}
																											className="ml-8"
																										>
																											<div className="flex justify-between items-center">
																												<span>{progress.content.title}</span>
																												<span>{`${progress.status > 100 ? '100' : Math.round(progress.status)}%`}</span>
																											</div>
																										</li>
																									) : null
																								})}
																							</ul>
																						</div>
																					</li>
																				)
																			})}
																		</ul>
																	</Accordion.Content>
																</Accordion.Panel>
															</Accordion>
														) : null
													})}
												</Modal.Body>
											</Modal>
										</>
									</td>
									<td className="basis-1/4">{user?.achievements?.length || 0}</td>
								</tr>
							)
						})}
				</tbody>
			</table>
		</>
	)
}

function LatestEnrollments({ latestEnrollments }) {
	const formatEnrollmentDate = (date) => {
		let dateObj = new Date(date)
		let month = dateObj.getMonth() + 1
		let day = dateObj.getDate()
		let year = dateObj.getFullYear()
		return `${month}/${day}/${year}`
	}

	useEffect(() => {}, [latestEnrollments])
	return (
		<>
			<table className="w-full bg-gray-50 shadow-md border px-4 py-6 rounded">
				<thead className="flex w-full bg-gray-200 font-semibold font-sans">
					<tr className="flex items-center w-full px-4 py-2">
						<span className=""></span>
						<th className="w-1/3">Student</th>
						<th className="w-1/3 border-x border-gray-500">Course</th>
						<th className="w-1/3">Track</th>
					</tr>
				</thead>
				<tbody className="flex flex-col">
					{latestEnrollments &&
						latestEnrollments.map((enrollment) => (
							<tr
								key={encodeURI(enrollment._id)}
								className="flex py-2 px-5 items-center border border-gray-200 text-center relative"
							>
								<span
									className="block w-2 h-full absolute left-0 top-0"
									style={{
										backgroundColor: `${enrollment.course.colorCode}`
									}}
								></span>
								<td className="w-1/3 px-4 py-2">
									<div className="flex gap-2 items-center justify-center">
										<div className="h-10 w-10 rounded-full overflow-hidden mr-2 relative">
											<Picture
												avatar={enrollment?.student?.avatar}
												quality={50}
												alt={'Instructor avatar'}
											/>
											<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
										</div>
										<div className="flex flex-col text-left">
											<span>{enrollment.student.firstName + ' ' + enrollment.student.lastName}</span>
											<span className="text-gray-500 font-light text-sm">{enrollment.student.email}</span>
										</div>
									</div>
								</td>
								<td className="w-1/3 px-4 py-2">
									<div className="flex flex-col">
										<div className="">{enrollment.course.title}</div>
										<div className="text-gray-500 font-light text-sm">Enrollment date: {formatEnrollmentDate(enrollment._createdAt)}</div>
									</div>
								</td>
								<td className="w-1/3 px-4 py-2">
									<div className="flex flex-col">
										<div className="">{enrollment.course.track ? enrollment.course.track.name : 'N/A'}</div>
										<div className="text-gray-500 font-light text-sm"></div>
									</div>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</>
	)
}

function EnrollStudents({ enrollments }) {
	const [uploading, setUploading] = useState(false)
	const [header, setHeader] = useState(true)
	const [courses, setCourses] = useState(null)
	const [students, setStudents] = useState(null)
	const inputRef = useRef()

	const getCourses = async () => {
		try {
			const res = await client.fetch(`*[_type == 'mission']{title,_id}`)
			setCourses(res)
		} catch (error) {
			throw new Error(error)
		}
	}

	const handleUploadCSV = () => {
		setUploading(true)

		const input = inputRef?.current
		const reader = new FileReader()
		const [file] = input.files

		reader.onloadend = ({ target }) => {
			const csv = Papa.parse(target.result, { header })

			fetch('/api/admin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					csv: csv?.data
				})
			})
				.then((res) => {
					return res.json()
				})
				.then((file) => {
					file.map((row) => {
						row['course'] = []
					})
					setStudents(file)
					setUploading(false)
					handleAlreadyEnrolledInCourse()
				})
				.catch((error) => {
					setUploading(false)
					throw new Error(error)
				})
		}

		reader.readAsText(file)
	}

	const handleAlreadyEnrolledInCourse = () => {
		// loop over the uploaded students
		// find the student in the enrollments array
		// push all course ids in the user enrollment
		// return the new students array

		setStudents((prev) => {
			const newStudents = [...prev]

			newStudents.map((user, userIndex) => {
				let index = enrollments.findIndex((enrollment) => enrollment.email.toLowerCase() === user.email.toLowerCase())
				if (index !== -1) {
					let tempCourseEnrollments = []
					enrollments[index].enrollment.map((enrDoc) => {
						tempCourseEnrollments.push(enrDoc.course._id)
					})

					newStudents[userIndex].course = tempCourseEnrollments
				}
			})
			return newStudents
		})
	}

	const handleCourseSelection = (event) => {
		setStudents((prev) => {
			const temp = prev
			if (temp[event.target.name].course.includes(event.target.value)) {
				return temp
			} else {
				temp[event.target.name].course.push(event.target.value)
				return temp
			}
		})
	}

	const handleEnrollment = async (event) => {
		try {
			const currentUser = students[event.target.value]
			const res = await client.fetch(`*[_type == 'user' && email == '${currentUser.email}']{_id}[0]`)
			//check for duplicate enrollments before processing new enrollment
			const duplicate = enrollments.find((enrollment) => enrollment._id === res._id)
			if (res) {
				if (duplicate.enrollment.length > 0) {
					let filteredEnrollments
					duplicate.enrollment.map((doc) => {
						filteredEnrollments = currentUser.course.filter((course) => course._id === doc.course._id)
					})
					console.log(filteredEnrollments)
					//link existing user to new enrollment
					filteredEnrollments.map(async (ID) => {
						return await client.create({
							_type: 'enrollment',
							student: { _ref: res._id },
							course: { _ref: ID }
						})
					})
				}
			} else {
				///create user and then enroll them

				const user = await client.create({
					_type: 'user',
					email: currentUser.email,
					firstName: currentUser.firstName,
					lastName: currentUser.lastName,
					role: currentUser.role
				})
				await currentUser.course.map(async (course) => {
					return await client.create({
						_type: 'enrollment',
						student: { _ref: user._id },
						course: { _ref: course }
					})
				})
			}
		} catch (error) {
			throw new Error(error)
		}
	}

	useEffect(() => {
		getCourses()
	}, [])

	return (
		<div className="w-full">
			<section className="flex gap-5 items-center">
				<div className="text-sm font-light w-1/4">
					<label
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
						htmlFor="csv_upload"
					>
						Upload file
					</label>
					<input
						className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
						aria-describedby="csv_upload_help"
						id="csv_upload"
						type="file"
						disabled={uploading}
						ref={inputRef}
					/>
					<div
						className="mt-1 text-sm text-gray-500 dark:text-gray-300"
						id="csv_upload_help"
					>
						Upload a CSV file with your desired students. After, you will have the ability to select which courses they will be enrolled in.
					</div>
				</div>
				<button
					onClick={handleUploadCSV}
					disabled={uploading}
					className="bg-ncrma-300 hover:bg-ncrma-500 focus:bg-ncrma-500 focus:ring-2 rounded px-5 py-2 text-white"
					type="button"
				>
					{uploading ? (
						<span className="relative max-h-14 flex gap-2 items-center text-white">
							<Loader
								size={16}
								color={'#eee'}
							/>
							Loading...
						</span>
					) : (
						'Load CSV File'
					)}
				</button>
				<label
					htmlFor=""
					className="flex items-center gap-2 text-sm text-gray-500"
				>
					<input
						type="checkbox"
						onChange={() => setHeader(!header)}
						checked={header}
					/>
					Include headers?
				</label>
			</section>
			<table className="w-full mx-auto mt-5 rounded shadow-md">
				<thead className="w-full text-center font-semibold">
					{students ? (
						<tr className="w-full bg-gray-200 items-center px-5 py-2">
							<th className="px-4 py-2 border-gray-500 border-r ">Email</th>
							<th className="px-4 py-2 border-gray-500 border-r ">First Name</th>
							<th className="px-4 py-2 border-gray-500 border-r ">Last Name</th>
							<th className="px-4 py-2 border-gray-500 border-r ">Role</th>
							<th className="px-4 py-2 border-gray-500 border-r ">Course</th>
							<th className="px-4 py-2 ">Action</th>
						</tr>
					) : null}
				</thead>
				<tbody>
					{students?.map((student, studentIndex) => (
						<tr
							key={studentIndex}
							className="border-b px-5 py-2 items-center relative"
						>
							<td className="px-4 py-2">{student.email}</td>
							<td className="px-4 py-2">{student.firstName}</td>
							<td className="px-4 py-2">{student.lastName}</td>
							<td className="px-4 py-2">{student.role}</td>
							<td className="px-4 py-2">
								<div className="text-sm flex flex-col">
									{courses ? (
										courses.map((course, courseIndex) => (
											<div
												className="flex justify-between"
												key={courseIndex}
											>
												<label
													htmlFor={`default-toggle-${studentIndex}-${courseIndex}`}
													className="relative inline-flex items-center mb-4 cursor-pointer"
												>
													<input
														type="checkbox"
														id={`default-toggle-${studentIndex}-${courseIndex}`}
														className="sr-only peer"
														name={studentIndex}
														value={course._id}
														title={course.title}
														key={courseIndex}
														onChange={(e) => handleCourseSelection(e)}
														checked={student.course.includes(course._id)}
													/>
													<div
														className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
															student.course.includes(course._id) ? 'bg-green-500' : 'peer-checked:bg-blue-600'
														}`}
													></div>
													<span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{course.title}</span>
												</label>
											</div>
										))
									) : (
										<Loader />
									)}
								</div>
							</td>
							<td className="px-4 py-2">
								<button
									value={studentIndex}
									onClick={(e) => handleEnrollment(e)}
									className="bg-ncrma-300 hover:bg-ncrma-500 focus:bg-ncrma-500 focus:ring-2 rounded px-5 py-2 text-black hover:text-white"
								>
									Enroll Student
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default EnrollmentReportPage

export async function getServerSideProps(context) {
	const { tabIndex } = context.query
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
			const enrollments = await getEnrollmentsPerUser()
			const latestEnrollments = await getLatestEnrollments()
			return {
				props: {
					enrollments,
					latestEnrollments,
					tabIndex: tabIndex ? parseInt(tabIndex) : 0
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
