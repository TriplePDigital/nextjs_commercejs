import { Loader } from '@/components/util'
import { notify } from '@/util/notification'
import React, { useRef, useState } from 'react'
import { BsCart3, BsListCheck } from 'react-icons/bs'
import { MdOutlineUploadFile } from 'react-icons/md'
import Upload from '../quiz/Upload'
import PropTypes from 'prop-types'
import { Accordion } from 'flowbite-react'

const CrppPage = () => {
	const inputRef = useRef()
	const [uploading, setUploading] = useState(false)
	const [file, setFile] = useState(null)
	const [step, setStep] = useState(1)

	const parseJsonFile = (e) => {
		setUploading(true)
		const fileReader = new FileReader()
		fileReader.readAsText(e.target.files[0], 'UTF-8')
		fileReader.onload = (e) => {
			try {
				setFile(JSON.parse(e.target.result))
				setUploading(false)
			} catch (error) {
				notify('warning', 'There was an error parsing your file. Please check your file using an online tool, then try again.', 'parseError')
				setUploading(false)
			}
		}
	}

	/**
	 * JSON upload form steps
	 * 1. upload file
	 * 2. verify source data
	 * 3. verify company location (Google Maps integration maybe?)
	 * 4. verify assessment data
	 * 5. verify primary contact details
	 * 6. verify risk manager data
	 * 7. verify course selections
	 * 8. review upload
	 * 9. direct to checkout page
	 */

	return (
		<section className="w-full mt-5">
			<nav className="w-full mx-auto">
				<ul className="flex md:flex-row flex-col justify-between items-center gap-3 even:border text-center">
					<li className={`p-2 flex-1 flex flex-col items-center ${step >= 1 ? 'text-blue-500' : 'text-gray-500'}`}>
						<MdOutlineUploadFile
							size={38}
							className={`${step === 1 ? '' : 'opacity-25'}`}
						/>
						<span className="text-sm">Upload CRP² Assessment</span>
					</li>
					<li
						className={`${step === 1 && 'before:block before:absolute before:left-0 before:-top-1 before:w-3 before:h-3 before:bg-blue-500 before:rounded-full'} ${
							step === 2 && 'before:block before:absolute before:left-1/2 before:-top-1 before:w-3 before:h-3 before:bg-blue-500 before:rounded-full'
						} relative flex-1 flex`}
					>
						<span className={`border-b block mt-0.5 ${step === 2 ? 'border-blue-500 w-1/2' : 'w-full'} ${step >= 3 ? 'border-blue-500 w-full' : ''}`} />
						<span className={`${step === 2 ? 'w-1/2 border-b block' : 'hidden'}`} />
					</li>
					<li className={`p-2 flex-1 flex flex-col items-center ${step >= 3 ? 'text-blue-500' : 'text-gray-500'}`}>
						<BsListCheck
							size={38}
							className={`${step === 3 ? '' : 'opacity-25'}`}
						/>
						<span className="text-sm">Verify Imported Assessment</span>
					</li>
					<li
						className={`${step === 4 && 'before:block before:absolute before:left-0 before:-top-1 before:w-3 before:h-3 before:bg-blue-500 before:rounded-full'} ${
							step === 4 && 'before:block before:absolute before:left-1/2 before:-top-1 before:w-3 before:h-3 before:bg-blue-500 before:rounded-full'
						} relative flex-1 flex`}
					>
						<span className={`border-b block mt-0.5 ${step === 4 ? 'border-blue-500 w-1/2' : 'w-full'} ${step >= 5 ? 'border-blue-500 w-full' : ''}`} />
						<span className={`${step === 4 ? 'w-1/2 border-b block' : 'hidden'}`} />
					</li>
					<li className={`p-2 flex-1 flex flex-col items-center ${step >= 5 ? 'text-blue-500' : 'text-gray-500'}`}>
						<BsCart3
							size={38}
							className={`${step === 5 ? '' : 'opacity-25'}`}
						/>
						<span className="text-sm">Upload CRP² Assessment</span>
					</li>
				</ul>
			</nav>
			<section className="w-4/5 bg-gray-100 rounded-lg shadow-lg px-4 py-8 mx-auto">
				<div className="flex gap-2 items-center">
					<div className="rounded-full border-2 border-gray-400 border-opacity-50 h-8 w-8 flex items-center justify-center">
						<span className="text-lg text-gray-400 aspect-square">{step}</span>
					</div>
					<h1 className="text-2xl font-medium">
						{step === 1 ? 'Upload your assessment results' : null}
						{step === 2 ? 'Verify your company location' : null}
						{step === 3 ? 'Verify your assessment results' : null}
						{step === 4 ? 'Verify your primary contact and risk manager' : null}
						{step === 5 ? 'Purchase course access for your employees' : null}
					</h1>
				</div>
				{step === 1 && (
					<Upload
						uploading={uploading}
						inputRef={inputRef}
						htmlFor="csv-upload"
						helpID="csv-upload-help"
						help="Upload the JSON file which you should have received after completing your CRP² assessment. In the next steps, you will have the ability to review the company information, as well as the courses that were recommended to you based on your assessment results."
						label={''}
						parseJsonFile={parseJsonFile}
						_type="json"
						processButton={
							!file ? (
								<button
									disabled={true}
									className="w-1/2 cursor-not-allowed opacity-50 bg-ncrma-300 hover:bg-ncrma-500 focus:bg-ncrma-500 focus:ring-2 rounded px-5 py-2 text-white"
									type="submit"
								>
									Upload JSON file
								</button>
							) : (
								<button
									disabled={false}
									onClick={() => setStep((prev) => prev + 1)}
									className="w-1/2 bg-ncrma-300 hover:bg-ncrma-500 focus:bg-ncrma-500 focus:ring-2 rounded px-5 py-2 text-white"
									type="submit"
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
										'Proceed'
									)}
								</button>
							)
						}
					/>
				)}
				{step === 2 && (
					<>
						<Verify metadata={file.metadata} />
						<div className="flex items-center justify-between my-2">
							<button
								className="px-5 py-3 bg-ncrma-200 text-black rounded hover:bg-ncrma-600 hover:text-white"
								onClick={() => setStep((prev) => prev - 1)}
							>
								Back
							</button>
							<button
								className="px-5 py-3 bg-ncrma-500 text-white rounded hover:bg-ncrma-800"
								onClick={() => setStep((prev) => prev + 1)}
							>
								Proceed
							</button>
						</div>
					</>
				)}
				{step === 3 && (
					<>
						<AssessmentData assessmentData={file.metadata.companyData.assessmentData} />
						<div className="flex items-center justify-between my-2">
							<button
								className="px-5 py-3 bg-ncrma-200 text-black rounded hover:bg-ncrma-600 hover:text-white"
								onClick={() => setStep((prev) => prev - 1)}
							>
								Back
							</button>
							<button
								className="px-5 py-3 bg-ncrma-500 text-white rounded hover:bg-ncrma-800"
								onClick={() => setStep((prev) => prev + 1)}
							>
								Proceed
							</button>
						</div>
					</>
				)}
				{step === 4 && (
					<>
						{/* Step 4 component goes here */}
						<ContactData
							contactData={file.metadata.companyData}
							rmContact={file.metadata.riskManagerData}
						/>
						<div className="flex items-center justify-between my-2">
							<button
								className="px-5 py-3 bg-ncrma-200 text-black rounded hover:bg-ncrma-600 hover:text-white"
								onClick={() => setStep((prev) => prev - 1)}
							>
								Back
							</button>
							<button
								className="px-5 py-3 bg-ncrma-500 text-white rounded hover:bg-ncrma-800"
								onClick={() => setStep((prev) => prev + 1)}
							>
								Proceed
							</button>
						</div>
					</>
				)}
				{step === 5 && (
					<>
						{/* Step 5 component goes here */}
						<CoursePurchase courseData={file.data} />
						<div className="flex items-center justify-between my-2">
							<button
								className="px-5 py-3 bg-ncrma-200 text-black rounded hover:bg-ncrma-600 hover:text-white"
								onClick={() => setStep((prev) => prev - 1)}
							>
								Back
							</button>
							<button
								className="px-5 py-3 bg-ncrma-500 text-white rounded hover:bg-ncrma-800"
								onClick={() => null}
							>
								Proceed
							</button>
						</div>
					</>
				)}
			</section>
		</section>
	)
}

const Verify = ({ metadata }) => {
	/**
	 *	- verify source data
	 *	- verify company location (Google Maps integration maybe?)
	 */
	return (
		<div>
			<form>
				<label
					htmlFor="source-name"
					className="flex flex-col gap-2"
				>
					Source Name
					<input
						type="text"
						id="source-name"
						defaultValue={metadata.sourceData.name}
						placeholder="Parent Company Name"
					/>
				</label>
				<label
					htmlFor="source-name"
					className="flex flex-col gap-2"
				>
					Company Name
					<input
						type="text"
						defaultValue={metadata.companyData.name}
						placeholder="Company Name"
					/>
				</label>
				<label
					htmlFor="source-name"
					className="flex flex-col gap-2"
				>
					Location
					<input
						type="text"
						defaultValue={metadata.companyData.location.city}
						placeholder="City"
					/>
					<input
						type="text"
						defaultValue={metadata.companyData.location.streetAddress1}
						placeholder="Street Address 1"
					/>
					<input
						type="text"
						defaultValue={metadata.companyData.location?.streetAddress2}
						placeholder="Street Address 2"
					/>
					<div className="flex gap-1 items-center justify-between">
						<input
							type="text"
							className="w-1/2"
							defaultValue={metadata.companyData.location.state}
							placeholder="State"
						/>
						<input
							type="text"
							className="w-1/2"
							defaultValue={metadata.companyData.location.zip}
							placeholder="Zip"
						/>
					</div>
					<input
						type="text"
						defaultValue={metadata.companyData.location.phoneNumber}
						placeholder="Phone Number"
					/>
				</label>
			</form>
		</div>
	)
}

const AssessmentData = ({ assessmentData }) => {
	return (
		<div>
			<div className="my-3">
				<h3 className="font-semibold text-lg">Assessment Results</h3>
				<p className="text-sm opacity-50 font-light">Below you can see all three parameters that define your risk readiness.</p>
				<ul className="flex mt-1">
					<li className="flex-1">
						<span className="font-medium">Defensibility: </span>
						{assessmentData.defensibility}
					</li>
					<li className="flex-1">
						<span className="font-medium">Proficiency: </span>
						{assessmentData.profiency}
					</li>
					<li className="flex-1">
						<span className="font-medium">Score: </span>
						{assessmentData.score}
					</li>
				</ul>
			</div>
			<div className="my-3">
				<h3 className="font-semibold text-lg">Facilities</h3>
				<p className="text-sm opacity-50 font-light">Here you can see all your facilities that are in need of attention based on your assessment data.</p>
				<div className="grid grid-cols-2 gap-2 mt-1">
					{assessmentData.facilities.map((facility, index) => (
						<div key={index}>
							<p className="capitalize p-5 border shadow bg-gray-50 rounded">{facility}</p>
						</div>
					))}
				</div>
			</div>
			<div className="my-3">
				<h3 className="font-semibold text-lg">Risk Types</h3>
				<p className="text-sm opacity-50 font-light">Listed below are all your risk types based on your assessment. Next to each type you can see the criticality of each risk.</p>
				<div className="grid grid-cols-2 gap-2 mt-1">
					{assessmentData.riskTypes.map((risk, index) => (
						<div
							className="capitalize p-5 border shadow bg-gray-50 rounded flex justify-between items-center"
							key={index}
						>
							<p>{risk.type}</p>
							<p>{risk.criticality}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

const ContactData = ({ contactData, rmContact }) => {
	const { primaryContactData } = contactData
	return (
		<div>
			<div className="my-3">
				<h3 className="font-semibold text-lg">Primary Contact Details</h3>
				<p className="text-sm opacity-50 font-light">Below you can see all the contact information for your company.</p>
				<ul className="flex flex-col mt-1 gap-2">
					<div className="flex gap-2">
						<label className="flex-1">
							<span className="font-medium">First Name</span>
							<input
								type="text"
								className="w-full"
								defaultValue={primaryContactData.firstName}
							/>
						</label>
						<label className="flex-1">
							<span className="font-medium">Last Name</span>
							<input
								type="text"
								className="w-full"
								defaultValue={primaryContactData.lastName}
							/>
						</label>
					</div>
					<div className="flex gap-2">
						<li className="flex-1">
							<span className="font-medium">Email</span>
							<input
								type="text"
								className="w-full"
								defaultValue={primaryContactData.email}
							/>
						</li>
						<li className="flex-1">
							<span className="font-medium">Phone Number</span>
							<input
								type="text"
								className="w-full"
								defaultValue={primaryContactData.phoneNumber}
							/>
						</li>
					</div>
				</ul>
			</div>
			<div className="my-3">
				<h3 className="font-semibold text-lg">Risk Manager&apos;s Contact Details</h3>
				<p className="text-sm opacity-50 font-light">Shown below is your company&apos;s dedicated Risk Manager&apos;s contact details.</p>
				<ul className="flex flex-col mt-1 gap-2">
					<div className="flex gap-2">
						<label className="flex-1">
							<span className="font-medium">First Name</span>
							<input
								type="text"
								className="w-full"
								defaultValue={rmContact.firstName}
							/>
						</label>
						<label className="flex-1">
							<span className="font-medium">Last Name</span>
							<input
								type="text"
								className="w-full"
								defaultValue={rmContact.lastName}
							/>
						</label>
					</div>
					<div className="flex gap-2">
						<li className="flex-1">
							<span className="font-medium">Email</span>
							<input
								type="text"
								className="w-full"
								defaultValue={rmContact.email}
							/>
						</li>
						<li className="flex-1">
							<span className="font-medium">Phone Number</span>
							<input
								type="text"
								className="w-full"
								defaultValue={rmContact.phoneNumber}
							/>
						</li>
					</div>
				</ul>
			</div>
		</div>
	)
}

const CoursePurchase = ({ courseData }) => {
	let finalPrice = 0

	Object.entries(courseData).forEach(([key, value]) => {
		if (value) {
			const currentCourseList = value.courses
			const currPrice = currentCourseList.reduce((acc, curr) => {
				return acc + curr.price
			}, 0)
			finalPrice += Number(parseFloat(currPrice).toFixed(2))
		}
	})
	return (
		<div className="my-3">
			<h3 className="font-semibold text-lg">Course Recommendations</h3>
			<p className="text-sm opacity-50 font-light">We have listed all the courses that were suggested to your employees to take. After this step, you will be redirected to the checkout page, where you can purchase the course access.</p>
			{Object.entries(courseData).map(([key, value], index) => (
				<div
					className="dark:text-gray-400 my-2"
					key={index}
				>
					<Accordion>
						<Accordion.Panel>
							<Accordion.Title>{key}</Accordion.Title>
							<Accordion.Content>
								{value.courses.map((course) => (
									<div
										key={course.id}
										className="flex justify-between items-center"
									>
										<h4 className="font-semibold">{course.name}</h4>
										<p className="text-sm opacity-50 font-light">${course.price === 0 ? '0.00' : course.price}</p>
									</div>
								))}
							</Accordion.Content>
						</Accordion.Panel>
					</Accordion>
				</div>
			))}
			<h1 className="font-bold text-black text-right text-2xl my-2">Final Price: {finalPrice}</h1>
		</div>
	)
}

Verify.propTypes = {
	metadata: PropTypes.shape({
		sourceData: PropTypes.shape({
			crppID: PropTypes.string,
			name: PropTypes.string
		}),
		companyData: PropTypes.shape({
			crppID: PropTypes.string,
			name: PropTypes.string,
			location: PropTypes.shape({
				streetAddress1: PropTypes.string,
				streetAddress2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				city: PropTypes.string,
				state: PropTypes.string,
				zip: PropTypes.number,
				phoneNumber: PropTypes.string
			}),
			assessmentData: PropTypes.shape({
				crppID: PropTypes.string,
				facilities: PropTypes.arrayOf(PropTypes.string),
				riskTypes: PropTypes.arrayOf(
					PropTypes.shape({
						type: PropTypes.string,
						criticality: PropTypes.number
					})
				),
				score: PropTypes.string,
				profiency: PropTypes.number,
				defensibility: PropTypes.number
			}),
			primaryContactData: PropTypes.shape({
				crppID: PropTypes.string,
				firstName: PropTypes.string,
				lastName: PropTypes.string,
				email: PropTypes.string,
				phoneNumber: PropTypes.string
			})
		}),
		riskManagerData: PropTypes.shape({
			crppID: PropTypes.string,
			firstName: PropTypes.string,
			lastName: PropTypes.string,
			email: PropTypes.string,
			phoneNumber: PropTypes.string
		})
	}).isRequired,
	data: PropTypes.object.isRequired
}

export default CrppPage
