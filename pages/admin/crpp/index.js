import { notify } from '@/util/notification'
import React, { useRef, useState } from 'react'
import Upload from '../quiz/Upload'

const CrppPage = () => {
	const inputRef = useRef()
	const [uploading, setUploading] = useState(false)
	const [file, setFile] = useState(null)

	const parseJsonFile = (e) => {
		const fileReader = new FileReader()
		fileReader.readAsText(e.target.files[0], 'UTF-8')
		fileReader.onload = (e) => {
			try {
				setFile(JSON.parse(e.target.result))
			} catch (error) {
				notify('warning', 'There was an error parsing your file. Please check your file using an online tool, then try again.', 'parseError')
			}
		}
	}

	const handleUploadCSV = () => {
		setUploading(true)

		const input = inputRef?.current
		const reader = new FileReader()
		const [file] = input.files

		reader.onloadend = ({ target }) => {
			const csv = Papa.parse(target.result, {
				header: false,
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
					file: csv?.data
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

	console.log(file)

	function iterateObject(obj) {
		console.log(obj)
		for (prop in obj) {
			if (typeof obj[prop] == 'object') {
				iterateObject(obj[prop])
			} else {
				return (
					<p>
						{prop}: {obj[prop]}
					</p>
				)
			}
		}
	}

	return (
		<section className="w-full mt-5">
			<Upload
				uploading={uploading}
				inputRef={inputRef}
				htmlFor="csv-upload"
				helpID="csv-upload-help"
				help="Upload a CSV file with your desired questions. After, you will have the ability to select which course and chapter to attach the quiz to as well as assign the quiz's title and the minimum score to pass."
				label="Upload CSV file"
				parseJsonFile={parseJsonFile}
				_type="json"
			/>
			{iterateObject(file)}
		</section>
	)
}

export default CrppPage
