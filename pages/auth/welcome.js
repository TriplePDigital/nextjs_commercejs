/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from 'react'
import { configuredSanityClient as client } from '@/util/img'
import { useRouter } from 'next/router'
import { Loader } from '@/components/util'
import axios from 'axios'
import { fetcher } from '@/util/fetcher'
import Image from 'next/image'

export default function Welcome({ error, email, userID }) {
	const router = useRouter()

	const [firstName, setFirstName] = useState('')
	// const [userID, setUserID] = useState('')
	const [lastName, setLastName] = useState('')
	const [asset, setAsset] = useState(null)
	const [createObjectURL, setCreateObjectURL] = useState(null)
	const [em, setEmail] = useState('')
	const [loading, setLoading] = useState(false)

	const uploadToClient = (event) => {
		if (event.target.files && event.target.files[0]) {
			const i = event.target.files[0]

			const file = new File([i], i.name, { type: i.type })

			setAsset(file)
			setCreateObjectURL(URL.createObjectURL(i))
		}
	}

	const updateUser = async () => {
		const { data } = await axios.post(
			`${process.env.NEXT_PUBLIC_EDGE_URL}/updateUser`,
			{},
			{
				params: {
					id: userID,
					email,
					firstName,
					lastName
				}
			}
		)
		if (data) {
			return true
		} else {
			throw Error('Error while updating user')
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			setLoading(true)

			let usr = await client.fetch(
				`*[_type == 'user' && email == '${email}'][0]`
			)

			if (!usr) {
				await client.create({
					_type: 'user',
					account_id: userID,
					active: true,
					firstName,
					lastName,
					email: em.length > 0 ? em : email
				})
			} else {
				await client
					.patch(usr._id) // Document ID to patch
					.set({ active: true, account_id: userID }) // Shallow merge
					.commit() // Perform the patch and return a promise
			}

			//Update document in MongoDB

			updateUser()
				.then((res) => {
					if (res) {
						setLoading(false)
						router.reload('/missions')
					}
				})
				.catch((err) => {
					throw new Error(err)
				})
		} catch (error) {
			throw new Error(error)
		}
	}

	return loading ? (
		<Loader size={96} />
	) : (
		<section className="text-center">
			{error ? (
				<p className="rounded bg-red-200 text-red-500 w-1/2 mx-auto my-3 px-3 py-1.5">
					{error}
				</p>
			) : null}
			<form
				className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/2 flex flex-col border border-gray-100 mx-auto"
				onSubmit={handleSubmit}
			>
				<div className="mb-3">
					<h1 className="text-3xl font-semibold">
						Welcome to the NCRMA Learning Management System
					</h1>
					<p className="">
						Please finish setting up your profile in order to gain
						access to your courses. You can always edit your profile
						later on.
					</p>
				</div>
				{createObjectURL ? (
					<div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
						<Image
							src={createObjectURL}
							alt="avatar"
							layout="fill"
							objectFit="cover"
							objectPosition="center"
							quality={50}
						/>
					</div>
				) : null}
				{/* <input
					className="my-1 px-3 py-1.5 border rounded mx-auto w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-white"
					type="file"
					placeholder="URL to image"
					onChange={(e) => uploadToClient(e)}
				/> */}
				<input
					className="my-1 px-3 py-1.5 border rounded mx-auto w-full focus:ring"
					type="text"
					placeholder="First name"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
				/>
				<input
					className="my-1 px-3 py-1.5 border rounded mx-auto w-full focus:ring"
					type="text"
					placeholder="Last name"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
				/>
				<input
					className="my-1 px-3 py-1.5 border rounded mx-auto w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-white"
					type="email"
					placeholder="example@example.com"
					value={email}
					disabled={!error}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<button
					type="submit"
					className="bg-blue-500 hover:bg-blue-700 rounded text-white py-4 w-2/3 mx-auto mt-4 "
				>
					Save Profile
				</button>
			</form>
		</section>
	)
}

export async function getServerSideProps(ctx) {
	try {
		const { callbackUrl } = await ctx.query
		if (callbackUrl) {
			return {
				redirect: {
					destination: callbackUrl,
					permanent: true
				}
			}
		}

		const { email } = await ctx.query

		if (!email) {
			return {
				props: {
					error: 'Your email could not be found. Please enter it manually.',
					email: '',
					active: false
				}
			}
		}

		const query = `*[_type == "user" && email == "${email}"]{_id, active, email, account_id}[0]`
		const userCheck = await fetcher(query)

		if (userCheck) {
			if (userCheck.active) {
				return {
					redirect: {
						destination: '/missions',
						permanent: true
					}
				}
			} else {
				let res = await axios.get(
					`https://us-east-1.aws.data.mongodb-api.com/app/ncrma_lms_edge-hfcpq/endpoint/getUser`,
					{
						params: { email }
					}
				)

				const edgeProfile = JSON.parse(res.data)

				if (edgeProfile) {
					return {
						props: {
							userID: edgeProfile?._id,
							error: false,
							email,
							active: false
						}
					}
				} else {
					return {
						props: {
							error: 'It looks like one of our associates already created an account for you. Please proceed by setting up your profile.',
							userID: userCheck.account_id,
							active: userCheck.active,
							email: userCheck.email
						}
					}
				}
			}
		}
	} catch (error) {
		throw new Error(error)
	}
}
