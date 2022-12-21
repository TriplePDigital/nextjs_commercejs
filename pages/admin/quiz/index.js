import { useEffect, useRef, useState } from 'react'
import { getSession } from 'next-auth/client'
import getQuizAttempts from '@/util/getQuizAttempts'
import getUserFromSession from '@/util/getUserFromSession'
import moment from 'moment'
import { Loader } from '@/components/util'
import { client } from '@/util/config'
import Papa from 'papaparse'
import Upload from './Upload'
import { nanoid } from 'nanoid'
import { BsCaretUpFill, BsCheck } from 'react-icons/bs'
import Link from 'next/link'
import { notify } from '@/util/notification'
import Picture from '@/components/util/Picture'

function Quiz({ quizAttempts, tabIndex }) {
	return (
		<section className="flex flex-col md:flex-row gap-5 w-full">
			<section className="w-full my-5">
				<div className="w-full mx-auto">
					{tabIndex === 0 && <AllQuizAttempts quizAttempts={quizAttempts} />}
					{tabIndex === 1 && <UploadQuiz />}
				</div>
			</section>
		</section>
	)
}

function UploadQuiz() {
	const [uploading, setUploading] = useState(false)
	const [questions, setQuestions] = useState(null)
	const [loading, setLoading] = useState(false)
	const [quizSchemaQuestions, setQuizSchemaQuestions] = useState([])

	const [courses, setCourses] = useState(null)
	const [chapters, setChapters] = useState(null)
	const [toggleQuestion, setToggleQuestion] = useState(false)
	const [uploadingQuestions, setUploadingQuestions] = useState(false)

	const [selectedCourseID, setSelectedCourseID] = useState(null)
	const [selectedStageID, setSelectedStageID] = useState(null)
	const [quiz, setQuiz] = useState({
		minimumScore: 0,
		title: ''
	})

	const [step, setStep] = useState(1)
	const [showAllQuestions, setShowAllQuestions] = useState(false)

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
				header: true,
				transformHeader: function (h) {
					return h.toLocaleLowerCase().replace(' ', '').trim()
				},
				transform: function (v, f) {
					let intValues
					if (f === 'correctoption') {
						intValues = v.split(',').map((v) => parseInt(v))
					}
					return f === 'correctoption' ? intValues : v.trim()
				}
			})

			fetch('/api/admin/upload', {
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
					setStep(2)
				})
				.catch((error) => {
					setUploading(false)
					throw new Error(error)
				})
		}

		reader.readAsText(file)
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

	const getCourseName = () => {
		const course = courses.filter((course) => {
			return course._id === selectedCourseID
		})[0]
		return course.title
	}

	const getChapterName = () => {
		const chapter = chapters.filter((chapter) => {
			return chapter._id === selectedStageID
		})[0]
		return chapter.title
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
					answers: questions[questionID][`option${index}`] === '' || questions[questionID][`option${index}`] === undefined ? null : questions[questionID][`option${index}`].toString().trim(),
					correct: questions[questionID].correctoption.includes(index) ? true : false,
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
			setUploadingQuestions(true)
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
				} catch (error) {
					throw new Error(error)
				}
			})
			setUploadingQuestions(false)
		} catch (error) {
			throw new Error(error)
		}
	}

	const handleQuizUpload = async (event) => {
		event.preventDefault()
		setLoading(true)
		try {
			const quizDoc = await client.create({
				_type: 'quiz',
				title: quiz.title,
				minimumScore: Number(quiz.minimumScore),
				stage: {
					_ref: selectedStageID,
					_type: 'reference'
				},
				questions: quizSchemaQuestions
			})
			await client.create({
				_type: 'checkpoint',
				title: quiz.title,
				instance: 'quiz',
				order: Number(findCheckpointPosition(selectedStageID)) + 1,
				slug: {
					_type: 'slug',
					current: `${quiz.title.toLowerCase().replace(/ /g, '-')}-${getCourseName().toLowerCase().replace(/ /g, '-')}`
				},
				type: {
					_ref: quizDoc._id,
					_type: 'reference'
				},
				stage: {
					_ref: selectedStageID,
					_type: 'reference'
				}
			})
			setLoading(false)
			setStep(5)
		} catch (error) {
			throw new Error(error)
		}
	}

	const findCheckpointPosition = (stageID) => {
		const stage = chapters.filter((stage) => {
			return stage._id === stageID
		})[0]
		return stage.checkpoints.length
	}

	const quizOptions = Array(10).fill(undefined)

	return loading ? (
		<Loader />
	) : (
		<div className="w-full flex flex-col items-center justify-center">
			{step === 1 && (
				<section className="w-1/2 bg-gray-100 rounded-lg shadow-lg px-4 py-8 mx-auto">
					<div className="flex gap-2 items-center">
						<div className="rounded-full border-2 border-gray-400 border-opacity-50 h-8 w-8 flex items-center justify-center">
							<span className="text-lg text-gray-400 aspect-square">{step}</span>
						</div>
						<h1 className="text-2xl font-medium">Upload your CSV file</h1>
					</div>
					{uploading ? (
						<Loader />
					) : (
						<Upload
							uploading={uploading}
							inputRef={inputRef}
							htmlFor="csv-upload"
							helpID="csv-upload-help"
							help="Upload a CSV file with your desired questions. After, you will have the ability to select which course and chapter to attach the quiz to as well as assign the quiz's title and the minimum score to pass."
							_type="csv"
							// parseJsonFile={handleUploadCSV}
							processButton={
								<button
									onClick={handleUploadCSV}
									disabled={uploading}
									className="w-1/2 bg-ncrma-300 hover:bg-ncrma-500 focus:bg-ncrma-500 focus:ring-2 rounded px-5 py-2 text-white"
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
										'Upload CSV file'
									)}
								</button>
							}
						/>
					)}
				</section>
			)}
			{step === 2 ? (
				<section className="w-1/2 bg-gray-100 rounded-lg shadow-lg px-4 py-8 mx-auto">
					<div className="flex gap-2 items-center">
						<div className="rounded-full border-2 border-gray-400 border-opacity-50 h-8 w-8 flex items-center justify-center">
							<span className="text-lg text-gray-400 aspect-square">{step}</span>
						</div>
						<h1 className="text-2xl font-medium">Select the course and chapter you want to add the quiz to</h1>
					</div>
					<section className="flex flex-col gap-1 my-5 w-full px-2 md:px-10 mx-auto">
						<select
							className="w-full rounded-lg border-gray-300"
							name="course"
							onChange={handleCourseChange}
							value={selectedCourseID}
						>
							<option value="">Select a Course</option>
							{courses?.map((course, courseIndex) => {
								return (
									<option
										key={courseIndex}
										value={course._id}
									>
										{course.title}
									</option>
								)
							})}
						</select>
						{selectedCourseID && chapters ? (
							<select
								name="stage"
								onChange={handleStgeChange}
								className="w-full rounded-lg border-gray-300"
								value={selectedStageID}
							>
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
						<div className="flex justify-between w-full">
							<button
								className="px-4 py-3 w-1/3 bg-ncrma-200 rounded text-white hover:bg-ncrma-400"
								onClick={() => setStep(step - 1)}
								type="button"
							>
								Back
							</button>
							<button
								className={`px-4 py-3 w-1/3 bg-orange-400 uppercase font-bold tracking-wide leading-loose rounded text-white ${
									!selectedCourseID || !selectedStageID ? 'opacity-25 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:bg-orange-600'
								}`}
								onClick={() => setStep(3)}
								disabled={!selectedCourseID || !selectedStageID ? true : false}
							>
								Save Settings
							</button>
						</div>
					</section>
				</section>
			) : null}
			{step === 3 ? (
				<>
					<section className="flex flex-col gap-2 w-1/2 bg-gray-100 rounded-lg shadow-lg px-4 py-8 mx-auto">
						<div className="flex gap-2 items-center">
							<div className="rounded-full border-2 border-gray-400 border-opacity-50 h-8 w-8 flex items-center justify-center">
								<span className="text-lg text-gray-400 aspect-square">{step}</span>
							</div>
							<div className="flex flex-col">
								<h1 className="text-2xl font-medium">Finalize your quiz and it&apos;s settings</h1>
								<h2 className="text-sm font-light text-gray-600">You also have the ability to look over all your questions by clicking the button below.</h2>
							</div>
						</div>
						<div className="flex justify-between">
							<form className="flex flex-col items-center justify-center w-full gap-2 px-2 md:px-10">
								<input
									type="text"
									placeholder="Quiz title"
									className="w-full rounded-lg border-gray-300 "
									value={quiz.title}
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
									className="w-1/3 rounded-lg border-gray-300"
									value={quiz.minimumScore}
									onChange={(e) => {
										setQuiz((prevState) => {
											if (e.target.value > 100) {
												notify('error', 'Minimum score must be less than or equal to 100!', 'min-score-error')
												return {
													title: prevState.title,
													minimumScore: 100
												}
											}
											return {
												...prevState,
												minimumScore: e.target.value
											}
										})
									}}
								/>
								<a
									href="#"
									className="my-2 w-1/3 underline text-sm text-center rounded text-black text-opacity-70 hover:text-opacity-100 hover:border-gray-400"
									onClick={() => setShowAllQuestions(!showAllQuestions)}
									type="button"
								>
									{showAllQuestions ? 'Hide Questions' : 'Show Questions'}
								</a>
								<div className="flex justify-between w-full">
									<button
										className="px-4 py-3 w-1/3 bg-ncrma-200 rounded text-white hover:bg-ncrma-400"
										onClick={() => setStep(step - 1)}
										type="button"
									>
										Back
									</button>
									<button
										className={`px-4 py-3 w-1/3 bg-orange-400 uppercase font-bold tracking-wide leading-loose rounded text-white ${
											!quiz.minimumScore || !quiz.title ? 'opacity-25 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:bg-orange-600'
										}`}
										onClick={() => setStep(4)}
										disabled={!quiz.minimumScore || !quiz.title ? true : false}
									>
										Save Settings
									</button>
								</div>
							</form>
						</div>
					</section>
					<section className="mt-5 flex flex-col gap-2 w-full">
						<>
							{showAllQuestions
								? questions.map((question, questionIndex) => (
										<div
											className="flex w-full bg-gray-100 rounded px-4 py-4"
											key={questionIndex}
										>
											<div className="flex flex-col gap-2 w-full">
												<div className="flex justify-between items-center">
													<span>{question.question}</span>
													<span>{question.weight} points</span>
												</div>
												<button
													className="bg-ncrma-300 hover:bg-ncrma-500 focus:bg-ncrma-500 focus:ring-2 rounded px-5 py-2 text-white inline-block w-fit"
													onClick={() => setToggleQuestion(!toggleQuestion)}
												>
													Show Answers
												</button>
												{toggleQuestion ? (
													<ul className="list-disc ml-6">
														{quizOptions.map((option, questionKey) => {
															const currentOption = question[`option${questionKey + 1}`]
															return currentOption !== '' ? (
																<li
																	key={questionKey}
																	className={`${question.correctoption.includes(questionKey + 1) ? 'text-red-500' : ''}`}
																>
																	{currentOption}
																</li>
															) : null
														})}
													</ul>
												) : null}
											</div>
										</div>
								  ))
								: null}
							{showAllQuestions ? (
								<button
									className="fixed right-2 bottom-10 h-12 w-12 flex items-center rounded-full aspect-square  bg-blue-500 justify-center cursor-pointer focus:ring-2"
									onClick={() => {
										window.scrollTo(0, 0)
									}}
								>
									<BsCaretUpFill />
								</button>
							) : null}
						</>
					</section>
				</>
			) : null}
			{step === 4 ? (
				<section className="w-1/2 bg-gray-100 rounded-lg shadow-lg px-4 py-8 mx-auto">
					<div className="flex gap-2 items-center">
						<div className="rounded-full border-2 border-gray-400 border-opacity-50 h-8 w-8 flex items-center justify-center">
							<span className="text-lg text-gray-400 aspect-square">{step}</span>
						</div>
						<h1 className="text-2xl font-medium">Review your quiz</h1>
					</div>
					<div className="flex flex-col px-2 mt-5 md:px-10">
						<p className="font-medium ">
							<span className="text-gray-400 font-light text-sm">Course:</span> {getCourseName()}
						</p>
						<p className="font-medium ">
							<span className="text-gray-400 font-light text-sm">Chapter:</span> {getChapterName()}
						</p>
						<p className="font-medium ">
							<span className="text-gray-400 font-light text-sm">Quiz title: </span>
							{quiz.title}
						</p>
						<p className="font-medium ">
							<span className="text-gray-400 font-light text-sm">Minimum score to pass: </span>
							{quiz.minimumScore}
						</p>
						<p className="font-medium ">
							<span className="text-gray-400 font-light text-sm">Number of questions: </span>
							{questions.length}
						</p>
					</div>
					<div className="flex flex-col items-center justify-center gap-2">
						{uploadingQuestions ? (
							<Loader />
						) : (
							<>
								{quizSchemaQuestions.length > 0 ? (
									<div className="flex items-center justify-center gap-2 w-3/4 rounded-lg px-5 py-2 my-3 bg-green-100">
										<BsCheck
											size={32}
											className="text-green-800 opacity-50"
										/>
										<h3 className="font-medium text-green-800">Your quiz questions passed verification!</h3>
									</div>
								) : (
									<div className="flex justify-between w-full mt-2 md:px-10">
										<button
											className="px-4 py-3 w-1/3 bg-ncrma-200 rounded text-white hover:bg-ncrma-400"
											onClick={() => setStep(step - 1)}
											type="button"
										>
											Back
										</button>
										<button
											className="px-4 py-3 w-1/3 bg-ncrma-400 rounded text-white hover:bg-ncrma-600"
											onClick={createQuestions}
											type="submit"
										>
											Finalize Questions
										</button>
									</div>
								)}
							</>
						)}
						{quizSchemaQuestions.length > 0 ? (
							<button
								className="px-4 py-3 bg-orange-400 rounded text-white hover:bg-orange-600 uppercase font-bold tracking-wide leading-loose"
								onClick={handleQuizUpload}
								type="submit"
							>
								Upload quiz
							</button>
						) : null}
					</div>
				</section>
			) : null}
			{step === 5 ? (
				<section className="w-1/2 bg-gray-100 rounded-lg shadow-lg px-4 py-8 mx-auto">
					<span className="flex items-center justify-center mx-auto bg-green-100 h-44 w-44 rounded-full shadow-lg">
						<BsCheck
							size={200}
							className="text-green-400"
						/>
					</span>
					<div className="flex flex-col text-center items-center justify-center my-5">
						<h1 className="text-2xl font-bold">You have successfully uploaded your quiz!</h1>
						<h2 className="font-light text-sm">Users are now able to take quiz if they are enrolled in the course you assigned it to.</h2>
					</div>
					<Link
						href="/missions"
						passHref={false}
					>
						<a className="block w-1/3 mx-auto text-center px-4 py-3 bg-ncrma-400 rounded text-white hover:bg-ncrma-600">Go to my courses</a>
					</Link>
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
						<th className="border-x border-gray-500 w-1/4">Student</th>
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
									<span className="font-medium">{attempt.checkpoint?.quiz?.title}</span>
									<span className="text-sm text-gray-400">{attempt.checkpoint?.stage?.mission?.title}</span>
								</div>
							</td>
							<td className="w-1/4">{moment(attempt._createdAt).format('h:mm:ss A - MM/DD/YYYY')}</td>
							<td className="w-1/4">
								<div className="flex items-center justify-center">
									<div className="h-10 w-10 rounded-full overflow-hidden mr-2 relative">
										<Picture
											avatar={attempt.user.avatar.asset}
											quality={50}
											alt={'Instructor avatar'}
										/>
										<span className="absolute top-0 left-0 rounded-full h-full w-full bg-ncrma-300 opacity-50"></span>
									</div>
									<div className="flex flex-col items-start">
										<span className="">{attempt.user.firstName + ' ' + attempt.user.lastName}</span>
										<span className="text-sm underline text-gray-700">
											<a href={`mailto:${attempt.user.email}`}>{attempt.user.email}</a>
										</span>
									</div>
								</div>
							</td>
							<td className="w-1/4">
								<div className="flex flex-col gap-0">
									<span>{Math.floor(attempt.score)}%</span>
									<span className="text-sm text-gray-400">Minimum Score to Pass: {attempt.checkpoint.quiz.minimumScore}%</span>
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
			const quizAttempts = await getQuizAttempts()
			return {
				props: {
					quizAttempts,
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

export default Quiz
