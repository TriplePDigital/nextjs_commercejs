import { useEffect, useState } from 'react'
import { configuredSanityClient as client } from '@/util/img'
import { useRouter } from 'next/router'
import { Loader } from '@/components/util'
import axios from 'axios'
import { fetcher } from '@/util/fetcher'

export default function Welcome({ error, email, active, userID }) {
	const [fullName, setFullName] = useState('')
	const [asset, setAsset] = useState('')
	const [em, setEmail] = useState('')

	const router = useRouter()

	const updateUser = async () => {
		const { data } = await axios.post(
			`${process.env.NEXT_PUBLIC_EDGE_URL}/updateUser?email=${email}&fullName=${fullName}&image=${asset}`,
			{}
		)
		if (data.status === 'success') {
			router.push('/dashboard')
		} else {
			throw Error('Error while updating user')
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			await client.create({
				_type: 'user',
				account_id: userID,
				active: true,
				name: fullName,
				image: asset,
				email: em.length > 0 ? em : email
			}) // Document
			//TODO: Update document in MongoDB using image path and name
			await router.push('/')
		} catch (error) {
			throw new Error(error)
		}
	}

	useEffect(() => {
		if (error && error.length > 0 && userID && active) {
			router.push('/')
		}
		if (active) {
			router.push('/')
		}
	}, [])

	return em ? (
		<Loader />
	) : (
		<section className="text-center">
			{error ? (
				<p className="rounded bg-red-200 text-red-500 w-1/2 mx-auto my-3 px-3 py-1.5">
					{error}
				</p>
			) : null}

			<h1 className="text-3xl">
				Welcome to the NCRMA Learning Management System
			</h1>
			<p className="">
				Please finish setting up your profile in order to gain access to
				your courses. You can always edit your profile later on.
			</p>
			<form
				className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3 flex flex-col border border-gray-100 mx-auto"
				onSubmit={handleSubmit}
			>
				<input
					className="my-1 px-3 py-1.5 border rounded mx-auto w-1/2 focus:ring"
					type="text"
					placeholder="Full name"
					value={fullName}
					onChange={(e) => setFullName(e.target.value)}
				/>
				<input
					className="my-1 px-3 py-1.5 border rounded mx-auto w-1/2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-white"
					type="email"
					placeholder="example@example.com"
					value={email}
					disabled={!error}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					className="my-1 px-3 py-1.5 border rounded mx-auto w-1/2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-white"
					type="text"
					placeholder="URL to image"
					value={asset}
					onChange={(e) => setAsset(e.target.value)}
				/>
				<button
					type="submit"
					className="bg-blue-500 hover:bg-blue-700 rounded text-white py-4 w-1/3 mx-auto mt-4 "
				>
					Save Profile
				</button>
			</form>
		</section>
	)
}

export async function getServerSideProps(ctx) {
	const { email } = await ctx.query

	const query = `*[_type == "user" && email == "${email}"]{...}`
	const userCheck = await fetcher(query)

	if (userCheck.length > 0) {
		return {
			props: {
				error: 'User already exists',
				userID: userCheck[0]._id,
				active: userCheck[0].active
			}
		}
	}

	const url = `https://us-east-1.aws.data.mongodb-api.com/app/application-0-wgzxo/endpoint/users?email=${await email}`

	const res = await axios.get(url)

	if (res.data.length === 0) {
		return {
			props: {
				error: 'User not found'
			}
		}
	} else {
		const user = await JSON.parse(res.data)
		return {
			props: {
				error: false,
				email,
				userID: user._id,
				active: false
			}
		}
	}
}
