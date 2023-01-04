/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { Loader } from '../util'

export default function Questions({ data }) {
	//basic question index counter to have an idea what question the user is viewing
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	//current question object we got from the CMS
	const [currentQuestion, setCurrentQuestion] = useState()
	const [loading, setLoading] = useState(true)
	//stores the currently selected answer's key
	const [selected, setSelected] = useState()
	//stores the answer and the questions's key that corresponds to it
	const [questions, setQuestions] = useState([])

	useEffect(() => {
		if (!data) {
			setLoading(true)
		} else {
			setCurrentQuestion(data[currentQuestionIndex])
			setLoading(false)
		}
	}, [data, currentQuestionIndex])

	const checkIfQuestionsInState = (id) => {
		let flag = null
		questions.forEach((q) => {
			if (q.questionID === id) {
				flag = true
			} else {
				flag = false
			}
		})
		return flag
	}

	return !data && loading ? (
		<Loader />
	) : (
		<>
			<div>
				<p>{currentQuestion?.question}</p>
				<form
					onChange={(e) => {
						//TODO: This entire thing is a mess.
						setSelected(e.target.id)
						const questionID = e.target.name
						const answer = e.target.value
						const response = {
							questionID,
							answer
						}
						if (questions.length !== 0) {
							let flag = null
							questions.forEach((q) => {
								if (q.questionID === questionID) {
									flag = true
								} else {
									flag = false
								}
							})

							if (!flag) {
								setQuestions([...questions, response])
							} else {
								//find the entry in questions that matches our questionID and update it
								const matchingQuestion = (q) => q.questionID === questionID
								const idx = questions.findIndex(matchingQuestion)

								questions[idx].answer = answer
							}
							e.target.checked = true
						} else {
							setQuestions([...questions, response])
							e.target.checked = true
						}
					}}
				>
					{currentQuestion?.answers.map((ans) => (
						<div key={ans._key}>
							<label>
								<input
									name={currentQuestion?._id}
									type="radio"
									className="ml-6"
									value={ans.answers}
									id={ans._key}
									checked={selected === ans._key}
								/>
								{ans.answers}
							</label>
						</div>
					))}
					<button className={`${currentQuestionIndex === data?.length - 1 ? 'block' : 'hidden'}`}>Submit</button>
				</form>
				<button
					disabled={currentQuestionIndex === 0}
					className="disabled:opacity-50 bg-blue-300 px-6 py-2 rounded-lg text-white"
					onClick={() => {
						setCurrentQuestionIndex(currentQuestionIndex - 1)
						setSelected(null)
					}}
				>
					Previous
				</button>
				<button
					className="bg-blue-300 px-6 py-2 rounded-lg text-white"
					onClick={() => {
						let response = {
							answer: selected,
							questionID: currentQuestion?._id
						}
						if (questions.length !== 0) {
							//if the user has already answered the question, we update the answer
							// 1. find the question in the questions array
							// 2. update the answer
							if (questions.has(response)) {
								questions.forEach((question) => {
									if (question.questionID === response.questionID) {
										question.answer = response.answer
									}
								})
							} else {
								questions.add(response)
							}
						} else {
							questions.add(response)
						}
					}}
				>
					Save
				</button>
				<button
					disabled={currentQuestionIndex === data?.length - 1}
					className="disabled:opacity-50 bg-blue-300 px-6 py-2 rounded-lg text-white"
					onClick={() => {
						setCurrentQuestionIndex(currentQuestionIndex + 1)
						setSelected(null)
					}}
				>
					Next
				</button>
			</div>
		</>
	)
}
