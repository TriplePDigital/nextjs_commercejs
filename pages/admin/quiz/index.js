import { useEffect, useRef, useState } from 'react'
import { getSession } from 'next-auth/client'
import getQuizAttempts from '@/util/getQuizAttempts'
import getUserFromSession from '@/util/getUserFromSession'
import imgConstructor from '@/util/img'
import Image from 'next/image'
import moment from 'moment'
import { Loader } from '@/components/util'
import { configuredSanityClient as client } from '@/util/img'
import Papa from 'papaparse'
import Upload from './Upload'
import AdminSidebar from '@/components/Nav/AdminSidebar'
import { nanoid } from 'nanoid'

function Quiz({ quizAttempts }) {
	const [tabIndex, setTabIndex] = useState(1)

	return (
		<section className="flex flex-col md:flex-row gap-5">
			<AdminSidebar />
			<section className="w-full my-5">
				<div className="flex items-center w-full mx-auto justify-between mb-2">
					<div className="flex gap-3">
						<button
							className={`bg-ncrma-300 hover:bg-ncrma-500 text-white font-semibold rounded py-2 px-5`}
							onClick={() => setTabIndex(0)}
						>
							Latest Quiz Attempts
						</button>
						<button
							className={`bg-ncrma-300 hover:bg-ncrma-500 text-white font-semibold rounded py-2 px-5`}
							onClick={() => setTabIndex(1)}
						>
							Upload Quiz
						</button>
					</div>
				</div>
				<div className="w-full mx-auto">
					{tabIndex === 0 && (
						<AllQuizAttempts quizAttempts={quizAttempts} />
					)}
					{tabIndex === 1 && <UploadQuiz />}
				</div>
			</section>
		</section>
	)
}

function UploadQuiz() {
	const [uploading, setUploading] = useState(false)
	const [header, setHeader] = useState(true)
	const [questions, setQuestions] = useState(null)
	const [loading, setLoading] = useState(false)
	const [quizSchemaQuestions, setQuizSchemaQuestions] = useState([])

	const [courses, setCourses] = useState(null)
	const [toggleCourseID, setToggleCourseID] = useState(false)
	const [toggleChapterID, setToggleChapterID] = useState(false)
	const [chapters, setChapters] = useState(null)
	const [checkpoints, setCheckpoints] = useState(null)
	const [selectedPosition, setSelectedPosition] = useState(null)
	const [toggleQuestion, setToggleQuestion] = useState(false)

	const [selectedCourse, setSelectedCourse] = useState(null)
	const [selectedCourseID, setSelectedCourseID] = useState(null)
	const [selectedStage, setSelectedStage] = useState(null)
	const [selectedStageID, setSelectedStageID] = useState(null)
	const [quiz, setQuiz] = useState({})

	const inputRef = useRef()

	const getCourses = async () => {
		try {
			setLoading(true)
			const res = await client.fetch(`*[_type == "mission"]{
												title,
												_id,
												"stages": *[_type == "stage" && references(^._id)]{
													order,
													title,
													_id,
													"checkpoints": *[_type == "checkpoint" && references(^._id)]{
													order,
													_id,
													title,
													instance
													} | order(order asc)
												} | order(order asc)
											}`)
			return res
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
			const csv = Papa.parse(target.result, {
				header,
				transformHeader: function (h) {
					return h.toLocaleLowerCase().replace(' ', '').trim()
				},
				transform: function (v, f) {
					return f === 'correctoption' ? parseFloat(v) : v.trim()
				}
			})

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
					setQuestions(file)
					setUploading(false)
				})
				.catch((error) => {
					setUploading(false)
					throw new Error(error)
				})
		}

		reader.readAsText(file)
	}

	const findCourse = () => {
		return courses.filter((course) => {
			return course._id === toggleCourseID
		})[0]
	}

	const findChapter = () => {
		const selectedCourse = findCourse()
		selectedCourse.stages.filter((stage) => {
			console.log(stage)
			return stage._id === toggleChapterID
		})[0]
	}

	const getChapters = async (courseID) => {
		try {
			const course = await courses.filter((course) => {
				return course._id === courseID
			})[0]
			return course
		} catch (error) {
			throw new Error(error)
		}
	}

	useEffect(() => {
		getCourses()
			.then((res) => {
				setCourses(res)
				setLoading(false)
			})
			.catch((err) => {
				throw new Error(err)
			})

		return () => {
			return false
		}
	}, [])

	const handleCourseChange = (event) => {
		setSelectedCourseID(() => {
			getChapters(event.target.value)
				.then((res) => {
					setChapters(() => res.stages)
				})
				.catch((err) => {
					throw new Error(err)
				})

			return event.target.value
		})
	}

	const handleStgeChange = (event) => {
		setSelectedStageID(event.target.value)
	}

	const createSchemaFromQuestions = (questionID) => {
		const schemaArray = []

		try {
			for (let index = 1; index <= 10; index++) {
				let schema = {
					answers:
						questions[questionID][`option${index}`] === ''
							? null
							: questions[questionID][`option${index}`]
									.toString()
									.trim(),
					correct:
						questions[questionID].correctoption === index
							? true
							: false,
					_key: nanoid(),
					_type: 'answer'
				}
				if (schema.answers === null) {
					continue
				} else {
					schemaArray.push(schema)
				}
			}

			return schemaArray
		} catch (error) {
			throw new Error(error)
		}
	}

	const createQuestions = (event) => {
		event.preventDefault()
		try {
			setLoading(true)

			questions.forEach(async (question, questionIndex) => {
				try {
					const answers = createSchemaFromQuestions(questionIndex)

					const questionsCreate = await client.create({
						_key: nanoid(),
						_type: 'question',
						title: question['question'],
						answers: answers
					})

					setQuizSchemaQuestions((prevState) => {
						return [
							...prevState,
							{
								_key: nanoid(),
								_type: 'reference',
								_ref: questionsCreate._id
							}
						]
					})
					return
				} catch (error) {
					throw new Error(error)
				}
			})

			setLoading(false)
		} catch (error) {
			throw new Error(error)
		}
	}

	const handleQuizUpload = async (event) => {
		event.preventDefault()
		setLoading(true)
		try {
			await client.create({
				_type: 'quiz',
				title: quiz.title,
				minimumScore: Number(quiz.minimumScore),
				stage: {
					_ref: selectedStageID,
					_type: 'reference'
				},
				questions: quizSchemaQuestions
			})
			setLoading(false)
		} catch (error) {
			throw new Error(error)
		}
	}

	return loading ? (
		<Loader />
	) : (
		<div className="w-full">
			<Upload
				uploading={uploading}
				inputRef={inputRef}
				handleUploadCSV={handleUploadCSV}
				header={header}
				setHeader={setHeader}
			/>
			{questions ? (
				<section className="flex gap-1 my-5">
					<select
						name="course"
						onChange={handleCourseChange}
						value={selectedCourse}
					>
						<option value="">Select a Course</option>
						{courses?.map((course, courseIndex) => {
							return (
								<option key={courseIndex} value={course._id}>
									{course.title}
								</option>
							)
						})}
					</select>
					{selectedCourseID && chapters ? (
						<select name="stage" onChange={handleStgeChange}>
							<option value="">Select a Chapter</option>
							{chapters.map((chapter, chapterIndex) => {
								return (
									<option
										key={chapterIndex}
										value={chapter._id}
									>
										{chapter.title}
									</option>
								)
							})}
						</select>
					) : null}
				</section>
			) : null}
			{questions ? (
				<section className="flex flex-col gap-2">
					<div className="flex justify-between">
						<span>{courses.title}</span>
						<span></span>
						<form action="">
							<input
								type="text"
								placeholder="Quiz title"
								className=""
								onChange={(e) => {
									setQuiz((prevState) => {
										return {
											...prevState,
											title: e.target.value
										}
									})
								}}
								required
							/>
							<input
								type="number"
								placeholder="Minimum Score"
								min={0}
								max={100}
								maxLength={3}
								minLength={1}
								required
								className=""
								onChange={(e) => {
									setQuiz((prevState) => {
										return {
											...prevState,
											minimumScore: e.target.value
										}
									})
								}}
							/>
							{selectedStageID && questions ? (
								<button
									className="px-4 py-3 bg-ncrma-400 rounded text-white hover:bg-ncrma-600"
									onClick={createQuestions}
									type="submit"
								>
									Finalize Questions
								</button>
							) : null}
							{selectedStageID && questions ? (
								<button
									className="px-4 py-3 bg-ncrma-400 rounded text-white hover:bg-ncrma-600"
									onClick={handleQuizUpload}
									type="submit"
								>
									Upload quiz
								</button>
							) : null}
						</form>
					</div>
					{questions.map((questions, questionIndex) => (
						<div
							className="flex w-full bg-gray-100 rounded px-4 py-4"
							key={questionIndex}
						>
							<div className="flex flex-col gap-2 w-full">
								<div className="flex justify-between items-center">
									<span>{questions.question}</span>
									<span>{questions.weight} points</span>
								</div>
								<button
									className="bg-ncrma-300 hover:bg-ncrma-500 focus:bg-ncrma-500 focus:ring-2 rounded px-5 py-2 text-white inline-block w-fit"
									onClick={() =>
										setToggleQuestion(!toggleQuestion)
									}
								>
									Show Questions
								</button>
								{toggleQuestion ? (
									<ul className="list-disc ml-6">
										{questions.option1 ? (
											<li
												className={`${
													questions.correctoption ===
													1
														? 'text-red-500'
														: ''
												}`}
											>
												{questions.option1}
											</li>
										) : null}
										{questions.option2 ? (
											<li
												className={`${
													questions.correctoption ===
													2
														? 'text-red-500'
														: ''
												}`}
											>
												{questions.option2}
											</li>
										) : null}
										{questions.option3 ? (
											<li
												className={`${
													questions.correctoption ===
													3
														? 'text-red-500'
														: ''
												}`}
											>
												{questions.option3}
											</li>
										) : null}
										{questions.option4 ? (
											<li
												className={`${
													questions.correctoption ===
													4
														? 'text-red-500'
														: ''
												}`}
											>
												{questions.option4}
											</li>
										) : null}
										{questions.option5 ? (
											<li
												className={`${
													questions.correctoption ===
													5
														? 'text-red-500'
														: ''
												}`}
											>
												{questions.option5}
											</li>
										) : null}
										{questions.option6 ? (
											<li
												className={`${
													questions.correctoption ===
													6
														? 'text-red-500'
														: ''
												}`}
											>
												{questions.option6}
											</li>
										) : null}
										{questions.option7 ? (
											<li
												className={`${
													questions.correctoption ===
													7
														? 'text-red-500'
														: ''
												}`}
											>
												{questions.option7}
											</li>
										) : null}
										{questions.option8 ? (
											<li
												className={`${
													questions.correctoption ===
													8
														? 'text-red-500'
														: ''
												}`}
											>
												{questions.option8}
											</li>
										) : null}
										{questions.option9 ? (
											<li
												className={`${
													questions.correctoption ===
													9
														? 'text-red-500'
														: ''
												}`}
											>
												{questions.option9}
											</li>
										) : null}
										{questions.option10 ? (
											<li
												className={`${
													questions.correctoption ===
													10
														? 'text-red-500'
														: ''
												}`}
											>
												{questions.option10}
											</li>
										) : null}
									</ul>
								) : null}
							</div>
						</div>
					))}
				</section>
			) : null}
		</div>
	)
}

function AllQuizAttempts({ quizAttempts }) {
	return (
		<>
			<table className="w-full bg-gray-50 shadow-md border px-4 py-6 rounded">
				<thead className="flex w-full bg-gray-200 font-semibold font-sans">
					<tr className="flex items-center w-full px-4 py-2">
						<th className="border-r border-gray-500 w-1/4">Quiz</th>
						<th className="w-1/4">Completed</th>
						<th className="border-x border-gray-500 w-1/4">
							Student
						</th>
						<th className="w-1/4">Score</th>
						{/* <th className="border-l border-gray-500 w-1/5">
							Action
						</th> */}
					</tr>
				</thead>
				<tbody className="flex flex-col">
					{quizAttempts.map((attempt) => (
						<tr
							key={encodeURI(attempt._id)}
							className="flex py-2 px-5 items-center border border-gray-200 text-center"
						>
							<td className="w-1/4">
								<div className="flex flex-col gap-0">
									<span className="font-medium">
										{attempt.checkpoint?.quiz?.title}
									</span>
									<span className="text-sm text-gray-400">
										{
											attempt.checkpoint?.stage.mission
												?.title
										}
									</span>
								</div>
							</td>
							<td className="w-1/4">
								{moment(attempt._createdAt).format(
									'h:mm:ss A - MM/DD/YYYY'
								)}
							</td>
							<td className="w-1/4">
								<div className="flex items-center justify-center">
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
										<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
									</div>
									<div className="flex flex-col items-start">
										<span className="">
											{attempt.user.firstName +
												' ' +
												attempt.user.lastName}
										</span>
										<span className="text-sm underline text-gray-700">
											<a
												href={`mailto:${attempt.user.email}`}
											>
												{attempt.user.email}
											</a>
										</span>
									</div>
								</div>
							</td>
							<td className="w-1/4">
								<div className="flex flex-col gap-0">
									<span>{Math.floor(attempt.score)}%</span>
									<span className="text-sm text-gray-400">
										Minimum Score to Pass:{' '}
										{attempt.checkpoint.quiz.minimumScore}%
									</span>
								</div>
							</td>
							{/* <td className="w-1/5">
								<button className="bg-ncrma-300 rounded px-5 py-1 min-w-fit">
									Do something
								</button>
							</td> */}
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
