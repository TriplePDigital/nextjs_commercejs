import React, { useEffect, useRef, useState } from 'react'
import { Table } from 'flowbite-react'
import { getSession } from 'next-auth/client'
import { fetcher } from '@/util/fetcher'
import getUserFromSession from '@/util/getUserFromSession'
import ProficiencyMatrix from '@/components/util/ProficiencyMatrix'
import moment from 'moment'
import { BsBuilding } from 'react-icons/bs'
import { RiskManagementProfile } from '../../user/student/[id]'

const ReportingPage = ({ data, companyData }) => {
	const [riskMangers, setRiskMangers] = useState(data)
	const [expanded, setExpanded] = useState(null)
	const [selectedCompany, setSelectedCompany] = useState([])
	const [selectedFacility, setSelectedFacility] = useState(null)

	const [sortByCompany, setSortByCompany] = useState(null)
	const [sortByFacility, setSortByFacility] = useState(null)

	const userRef = useRef(null)

	const filterRiskManagers = (companyID) => {
		if (selectedCompany?.length > 0) {
			selectedCompany.forEach((company) => {
				return data.filter((rm, index, self) => {
					return rm.parentCompany._id === company._id
				})
			})
		} else {
			return data.filter((rm, index, self) => {
				return rm.parentCompany._id === companyID
			})
		}
	}

	const filterRiskManagersByName = (query) => {
		return data.filter((rm, index, self) => {
			const name = `${rm.firstName} ${rm.lastName}`
			return name.toLowerCase().includes(query) || rm.email.toLowerCase().includes(query)
		})
	}

	const filterDuplicateProgressDocuments = (enrollments) => {
		return enrollments.map((enrollment) => {
			return enrollment.progress.filter((pd, index, self) => {
				return self.findIndex((pd2) => (pd2.content._ref === pd.content._ref) === index)
			})
		})
	}

	const findMaxScoreInCourse = (course) => {
		// map over all the chapters in the course
		// find all the checkpoints in the chapter
		// aggregate the max scores for each checkpoint
		// return the max score for the chapter
		// return the max score for the course

		const maxScores = course.chapters.map((chapter) => {
			return chapter.checkpoints
				.map((checkpoint) => {
					return checkpoint.maxScore
				})
				.reduce((a, b) => {
					return a + b
				})
				.toFixed(2)
		})
	}

	useEffect(() => {}, [])

	return (
		<section className="w-2/3">
			<h1>Risk Manager Reports</h1>
			<div className="overflow-x-auto relative shadow-md sm:rounded-lg">
				<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th
								scope="col"
								className="py-3 px-6"
							>
								Name
							</th>
							<th
								scope="col"
								className="py-3 px-6"
							>
								Email
							</th>
							<th
								scope="col"
								className="py-3 px-6"
							>
								Enrollments
							</th>
							<th
								scope="col"
								className="py-3 px-6"
							>
								Company
							</th>
							<th
								scope="col"
								className="py-3 px-6"
							>
								Expand
							</th>
						</tr>
					</thead>
					<tbody>
						{riskMangers.map((riskManager, index) => (
							<>
								<tr
									className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 relative"
									key={index}
								>
									<th
										scope="row"
										className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
									>
										{riskManager.firstName} {riskManager.lastName}
									</th>
									<td className="py-4 px-6">{riskManager.email}</td>
									<td className="py-4 px-6">{riskManager.enrollments.length}</td>
									<td className="py-4 px-6">{riskManager?.parentCompany?.name}</td>
									<td className="py-4 px-6">
										<button
											className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
											onClick={(e) => {
												setExpanded((prev) => {
													if (prev) {
														return null
													} else {
														return e.target.value
													}
												})
											}}
											value={riskManager._id}
										>
											Expand
										</button>
									</td>
								</tr>
								<tr className={`${expanded === riskManager._id ? 'block' : 'hidden'} w-full`}>{riskManager?.riskManagerProfile ? <RiskManagerMatrixReport profile={riskManager?.riskManagerProfile} /> : null}</tr>
							</>
						))}
					</tbody>
				</table>
			</div>
		</section>
	)
}

export const RiskManagerMatrixReport = ({ profile }) => {
	return (
		<div className="flex flex-col">
			<h2>Assessment Proficiency</h2>
			<div className="flex gap-2">
				{profile?.assessmentProficiency ? (
					Object.entries(profile.assessmentProficiency).map(([key, value], index) => {
						return (
							<div
								className="flex flex-col"
								key={index}
							>
								<p>{key}</p>
								<ProficiencyMatrix
									status={value.status}
									timestamp={value.updatedAt}
								/>
							</div>
						)
					})
				) : (
					<ProficiencyMatrix
						status={undefined}
						timestamp={new Date()}
					/>
				)}
			</div>
			<h2>CRP Video Training</h2>
			<div className="flex gap-2">
				{profile?.crpVideoTraining ? (
					Object.entries(profile.crpVideoTraining).map(([key, value], index) => {
						return (
							<div
								className="flex flex-col"
								key={index}
							>
								<p>{key}</p>
								<ProficiencyMatrix
									status={value.status}
									timestamp={value.updatedAt}
								/>
							</div>
						)
					})
				) : (
					<ProficiencyMatrix
						status={undefined}
						timestamp={new Date()}
					/>
				)}
			</div>
			<h2>Shadow Assessment</h2>
			<div className="flex gap-2">
				{profile?.shadowAssessment ? (
					<div className="flex flex-col">
						<ProficiencyMatrix
							status={profile.shadowAssessment.status}
							timestamp={profile.shadowAssessment.updatedAt}
						/>
					</div>
				) : (
					<ProficiencyMatrix
						status={undefined}
						timestamp={new Date()}
					/>
				)}
			</div>
			<h2>Training Assessment</h2>
			<div className="flex gap-2">
				{profile?.trainingAssessments ? (
					Object.entries(profile.trainingAssessments).map(([key, value], index) => {
						return (
							<div
								className="flex flex-col"
								key={index}
							>
								<p>{key}</p>
								<ProficiencyMatrix
									status={value.status}
									timestamp={value.updatedAt}
								/>
							</div>
						)
					})
				) : (
					<ProficiencyMatrix
						status={undefined}
						timestamp={new Date()}
					/>
				)}
			</div>
		</div>
	)
}

export default ReportingPage

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
			const query = `
        *[_type == "user" && role in ["riskManager", "admin"]]{
          _id,
          firstName,
          lastName,
          email,
          "avatar": avatar.asset->,
          role,
          "enrollments": *[_type == "enrollment" && references(^._id)]{
            course->,
            "progress": *[_type == "progress" && references(^._id)]{
              content->,
              status,
              _id,
              _createdAt,
            },
          },
          "parentCompany": *[_type == "company" && references(^._id)][0]{
            ...,
          },
          "riskManagerProfile": *[_type == "riskManagerProfile" && references(^._id)][0]{...},
        }
      `
			const data = await fetcher(query, true)

			const companyQuery = `
        *[_type == "company"]{...}
      `

			const companyData = await fetcher(companyQuery, true)
			return {
				props: {
					data,
					companyData
				}
			}
		} else {
			return {
				redirect: {
					destination: '/missions',
					permanent: false
				}
			}
		}
	}
}
