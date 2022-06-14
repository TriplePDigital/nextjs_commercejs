import { fetcher } from '@/util/fetcher'
import { Loader } from '@/components/util/Loader'
import imgConstructor from '@/util/img'
import Image from 'next/image'
import { FaTrophy } from 'react-icons/fa'
import { configuredSanityClient as client } from '@/util/img'
import { useEffect, useState } from 'react'
import { post, get } from 'axios'
import { getSession, signOut } from 'next-auth/client'

function Profile({ profile, account }) {
	const [user, setUser] = useState({ ...profile })
	useEffect(() => {}, [])

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
		<div className="flex flex-row w-full mt-5">
			<form
				className="flex flex-col mx-auto w-1/3"
				onSubmit={(e) => handleSubmit(e)}
			>
				<div className="mx-auto rounded-full h-48 w-48 aspect-square relative overflow-hidden shadow border border-gray-100">
					<Image
						{...imgConstructor(profile.avatar.asset)}
						layout="fill"
						objectFit="cover"
						objectPosition="center"
						quality={50}
						placeholder="blur"
						alt='user profile image in a round shape'
					/>
				</div>
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
				{profile.achievements ? (
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
										{achievement.title}
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
		</div>
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
			missions[] -> {
				...,
				coverImage{
					asset ->
				},
				instructors[]-> {_id, name},
				enrollment[]->{...}
			}
		}[0]`)

		return {
			props: {
				profile,
				account: await JSON.parse(user.data)
			}
		}
	} catch (error) {
		throw Error(error)
	}
}
