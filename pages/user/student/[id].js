import { fetcher } from '@/util/fetcher'
import Loader from '@/components/util/Loader'
import imgConstructor from '@/util/img'
import Image from 'next/image'
import { FaTrophy } from 'react-icons/fa'
import { client } from '@/util/config'
import { useEffect, useState } from 'react'
import { post, get } from 'axios'
import { getSession, signOut } from 'next-auth/client'
import moment from 'moment'
import ProficiencyMatrix from '@/components/util/ProficiencyMatrix'
import getQuizAttemptsByStudent from '@/util/getQuizAttemptsByStudent'

function Profile({ profile, account, quizAttempts }) {
	const [user, setUser] = useState({ ...profile })
	useEffect(() => {}, [])
	const RMProfile = profile.riskManagerProfile || null
	const [tabIndex, setTabIndex] = useState(0)

	const syncEdgeInstance = async () => {
		try {
			const res = await post(
				`${process.env.NEXT_PUBLIC_EDGE_URL}/updateUser`,
				{},
				{
					params: {
						id: account._id,
						email: user.email,
						firstName: user.firstName,
						lastName: user.lastName
					}
				}
			)
			return res
		} catch (error) {
			throw Error(error)
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		return await client
			.patch(`${profile._id}`)
			.set({
				...user
			})
			.commit()
			.then((res) => {
				syncEdgeInstance()
				if (profile.email !== user.email) {
					signOut()
				}
				return res
			})
			.catch((err) => {
				throw new Error(err)
			})
	}

	return !profile ? (
		<Loader />
	) : (
		<div className="flex flex-col items-center w-full mt-5">
			<form
				className="flex flex-col mx-auto w-1/3"
				onSubmit={(e) => handleSubmit(e)}
			>
				{profile.avatar ? (
					<div className="mx-auto rounded-full h-48 w-48 aspect-square relative overflow-hidden shadow border border-gray-100">
						<Image
							{...imgConstructor(profile.avatar.asset)}
							layout="fill"
							objectFit="cover"
							objectPosition="center"
							quality={50}
							placeholder="blur"
							alt="user profile image in a round shape"
						/>
					</div>
				) : null}
				<label htmlFor="">First name</label>
				<input
					onChange={(e) =>
						setUser((prevState) => ({
							...prevState,
							firstName: e.target.value
						}))
					}
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring focus:shadow-outline my-1"
					type="text"
					defaultValue={profile.firstName}
				/>
				<label htmlFor="">Last name</label>
				<input
					onChange={(e) =>
						setUser((prevState) => ({
							...prevState,
							lastName: e.target.value
						}))
					}
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring focus:shadow-outline my-1"
					type="text"
					defaultValue={profile.lastName}
				/>
				<label htmlFor="">Email</label>
				<input
					onChange={(e) =>
						setUser((prevState) => ({
							...prevState,
							email: e.target.value
						}))
					}
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring focus:shadow-outline my-1"
					type="email"
					defaultValue={profile.email}
				/>
				{/* <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring focus:shadow-outline my-1" type="text" value={profile.email}/> */}
				{profile.achievements?.length > 0 ? (
					<>
						<label htmlFor="">Achievements</label>
						<div className="">
							{profile.achievements.map((achievement, index) => (
								<div
									key={index}
									className="flex flex-row w-full my-1"
								>
									<div
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring focus:shadow-outline my-1 flex items-center"
										type="text"
									>
										<FaTrophy className="text-xl mr-3 text-ncrma-400" />
										{achievement?.title}
									</div>
								</div>
							))}
						</div>
					</>
				) : null}
				<button
					className="flex justify-center items-center bg-ncrma-400 hover:bg-ncrma-600 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					type="submit"
				>
					Save profile
				</button>
			</form>
			<div className="flex items-center gap-5 justify-center rounded shadow w-2/3 bg-gray-50 border border-gray-100 py-5 mt-5">
				<button
					className="bg-ncrma-500 px-3 py-5 rounded text-white"
					onClick={() => setTabIndex(0)}
				>
					Risk Manager Profile
				</button>
				<button
					className="bg-ncrma-500 px-3 py-5 rounded text-white"
					onClick={() => setTabIndex(1)}
				>
					Quiz Attempts
				</button>
			</div>
			{tabIndex === 0 && <RiskManagementProfile RMProfile={RMProfile} />}
			{tabIndex === 1 && <QuizAttempts quizAttempts={quizAttempts} />}
		</div>
	)
}

const QuizAttempts = ({ quizAttempts }) => {
	return (
		<div className="flex flex-col items-center w-full mt-5">
			{quizAttempts.map((attempt, index) => (
				<div
					key={index}
					className="flex flex-col items-center w-2/3 border border-gray-100 rounded p-3 my-2"
				>
					<div className="flex flex-row w-full">
						<div className="flex flex-col w-1/2">
							<div className="flex flex-row">
								<div className="font-bold">Quiz:</div>
								<div className="ml-2">{attempt.quiz.title.replace('[QUIZ]', '')}</div>
							</div>
							<div className="flex flex-row">
								<div className="font-bold">Score:</div>
								<div className="ml-2">{attempt.score}</div>
							</div>
						</div>
						<div className="flex flex-col w-1/2">
							<div className="flex flex-row">
								<div className="font-bold">Date:</div>
								<div className="ml-2">{moment(attempt._createdAt).format('MM/DD/YYYY - hh:mm A')}</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

const RiskManagementProfile = ({ RMProfile }) => {
	return !RMProfile ? null : (
		<section className="my-5">
			<div className="flex flex-col items-center">
				<h2 className="font-medium text-lg">CRP2 Video Training</h2>
				<div className="flex gap-3">
					<div className="flex flex-col gap-1 items-center">
						<h3 className="">Video 1</h3>
						<ProficiencyMatrix
							timestamp={RMProfile.crpVideoTraining.videoNumberOne.updatedAt}
							status={RMProfile.crpVideoTraining.videoNumberOne.status}
						/>
					</div>
					<div className="flex flex-col gap-1 items-center">
						<h3 className="">Video 2</h3>
						<ProficiencyMatrix
							timestamp={RMProfile.crpVideoTraining.videoNumberTwo.updatedAt}
							status={RMProfile.crpVideoTraining.videoNumberTwo.status}
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-center mt-3">
				<h2 className="font-medium text-lg">Training Assessments</h2>
				<div className="flex gap-3">
					<div className="flex flex-col gap-1 items-center">
						<h3 className="">Dispensary</h3>
						<ProficiencyMatrix
							timestamp={RMProfile.trainingAssessments.dispensary.updatedAt}
							status={RMProfile.trainingAssessments.dispensary.status}
						/>
					</div>
					<div className="flex flex-col gap-1 items-center">
						<h3 className="">Express Assessment</h3>
						<ProficiencyMatrix
							timestamp={RMProfile.trainingAssessments.expressAssess.updatedAt}
							status={RMProfile.trainingAssessments.expressAssess.status}
						/>
					</div>
					<div className="flex flex-col gap-1 items-center">
						<h3 className="">Property Premises</h3>
						<ProficiencyMatrix
							timestamp={RMProfile.trainingAssessments.propertyPremises.updatedAt}
							status={RMProfile.trainingAssessments.propertyPremises.status}
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-center mt-3">
				<h2 className="font-medium text-lg">Shadow Assessment</h2>
				<div className="flex gap-3">
					<div className="flex flex-col gap-1 items-center">
						<ProficiencyMatrix
							timestamp={RMProfile.shadowAssessment.updatedAt}
							status={RMProfile.shadowAssessment.status}
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-center mt-3">
				<h2 className="font-medium text-lg">Assessment Proficiency</h2>
				<div className="flex gap-3">
					<div className="flex flex-col gap-1 items-center">
						<h3 className="">Health and Safety (OSHA)</h3>
						<ProficiencyMatrix
							timestamp={RMProfile.assessmentProficiency.healthAndSafety.updatedAt}
							status={RMProfile.assessmentProficiency.healthAndSafety.status}
						/>
					</div>
					<div className="flex flex-col gap-1 items-center">
						<h3 className="">Risk Management</h3>
						<ProficiencyMatrix
							timestamp={RMProfile.assessmentProficiency.riskManagement.updatedAt}
							status={RMProfile.assessmentProficiency.riskManagement.status}
						/>
					</div>
					<div className="flex flex-col gap-1 items-center">
						<h3 className="">Insurance</h3>
						<ProficiencyMatrix
							timestamp={RMProfile.assessmentProficiency.insurance.updatedAt}
							status={RMProfile.assessmentProficiency.insurance.status}
						/>
					</div>
					<div className="flex flex-col gap-1 items-center">
						<h3 className="">Quality Assurance (ISO)</h3>
						<ProficiencyMatrix
							timestamp={RMProfile.assessmentProficiency.qualityAssurance.updatedAt}
							status={RMProfile.assessmentProficiency.qualityAssurance.status}
						/>
					</div>
					<div className="flex flex-col gap-1 items-center">
						<h3 className="">Product and Process (Cannabis)</h3>
						<ProficiencyMatrix
							timestamp={RMProfile.assessmentProficiency.productProcess.updatedAt}
							status={RMProfile.assessmentProficiency.productProcess.status}
						/>
					</div>
					<div className="flex flex-col gap-1 items-center">
						<h3 className="">Property and Premises</h3>
						<ProficiencyMatrix
							timestamp={RMProfile.assessmentProficiency.propertyAndPremises.updatedAt}
							status={RMProfile.assessmentProficiency.propertyAndPremises.status}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Profile

export async function getServerSideProps(ctx) {
	const { id } = await ctx.query
	const sessionUser = await getSession(ctx)

	try {
		const user = await get(`${process.env.NEXT_PUBLIC_EDGE_URL}/getUser`, {
			params: {
				email: sessionUser.user.email
			}
		})

		const profile = await fetcher(`
		*[_type == 'user'  && _id == '${id}']{
			...,
			achievements[] -> {...},
			"riskManagerProfile": *[_type == 'riskManagerProfile' && references(^._id)][0],
			missions[] -> {
				...,
				coverImage{
					asset ->
				},
				instructors[]-> {_id, name},
				enrollment[]->{...}
			}
		}[0]`)

		const quizAttempts = await getQuizAttemptsByStudent(id)

		return {
			props: {
				profile,
				account: await JSON.parse(user.data),
				quizAttempts
			}
		}
	} catch (error) {
		throw Error(error)
	}
}
