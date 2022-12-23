import Loader from '@/components/util/Loader'
import Image from 'next/image'
import { FaTrophy } from 'react-icons/fa'
import { client } from '@/util/config'
import { useState } from 'react'
import { post } from 'axios'
import { signOut } from 'next-auth/client'
import moment from 'moment'
import { getQuizAttemptsByStudentQuery } from '@/util/getQuizAttemptsByStudent'
import commerceGetter from '@/util/commerceGetter'
import useSWR from 'swr'
import { useNextSanityImage } from 'next-sanity-image'
import { notify } from '@/util/notification'
import { RiskManagerMatrixReport } from '@/components/RM/RiskManagerMatrix'
import getter from '@/util/getter'
import { useRouter } from 'next/router'
import edgeFetcher from '@/util/edgeFetcher'

function Profile() {
	const [tabIndex, setTabIndex] = useState(0)
	const router = useRouter()
	const id = router.query.id

	const { data: accountData, error: accountError } = useSWR(
		`
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
		}[0]`,
		getter
	)
	const { data, error } = useSWR(`/api/user/getOrders?email=${accountData?.result?.email}`, commerceGetter)
	const { data: edgeData, error: edgeError } = useSWR(edgeFetcher({ endpoint: `getUser`, params: { email: accountData?.result?.email } }))
	const { data: quizAttemptsData, error: quizAttemptsError } = useSWR(getQuizAttemptsByStudentQuery(accountData?.result._id), getter)

	const RMProfile = accountData?.result.riskManagerProfile || null

	const imageProps = useNextSanityImage(client, accountData?.result.avatar.asset)

	const [user, setUser] = useState({ ...accountData?.result })

	if (error || accountError || edgeError || quizAttemptsError) {
		return <div className="text-center text-2xl font-bold">Error</div>
	}

	const syncEdgeInstance = async () => {
		try {
			const res = await post(
				`${process.env.NEXT_PUBLIC_EDGE_URL}/updateUser`,
				{},
				{
					params: {
						id: edgeData.result._id,
						email: accountData.result.email,
						firstName: accountData.result.firstName,
						lastName: accountData.result.lastName
					}
				}
			)
			if (res.status === 200) {
				notify('success', 'User profile updated successfully')
			}
			return res
		} catch (error) {
			throw Error(error)
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		return await client
			.patch(`${accountData.result._id}`)
			.set({
				...accountData.result
			})
			.commit()
			.then((res) => {
				syncEdgeInstance()
				if (accountData.result.email !== edgeData.result.email) {
					signOut()
				}
				return res
			})
			.catch((err) => {
				throw new Error(err)
			})
	}

	if (!accountData || !quizAttemptsData) return <Loader />

	return (
		<div className="flex flex-col items-center w-full mt-5">
			<form
				className="flex flex-col mx-auto w-1/3"
				onSubmit={(e) => handleSubmit(e)}
			>
				{accountData.result.avatar ? (
					<div className="mx-auto rounded-full h-48 w-48 aspect-square relative overflow-hidden shadow border border-gray-100">
						<Image
							src={imageProps.src}
							loader={imageProps.loader}
							blurDataURL={imageProps.blurDataURL}
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
					defaultValue={accountData.result.firstName}
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
					defaultValue={accountData.result.lastName}
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
					defaultValue={accountData.result.email}
				/>
				{/* <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring focus:shadow-outline my-1" type="text" value={profile.email}/> */}
				{accountData.result.achievements?.length > 0 ? (
					<>
						<label htmlFor="">Achievements</label>
						<div className="">
							{accountData.result.achievements.map((achievement, index) => (
								<div
									key={index}
									className="flex flex-row w-full my-1"
								>
									<div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring focus:shadow-outline my-1 flex items-center">
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
			{tabIndex === 1 && <QuizAttempts quizAttempts={quizAttemptsData.result} />}
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
								<div className="ml-2">{Number(attempt.score).toFixed(2)}</div>
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
			<RiskManagerMatrixReport
				profile={RMProfile}
				fallbackDate={RMProfile._createdAt}
			/>
		</section>
	)
}

export default Profile
