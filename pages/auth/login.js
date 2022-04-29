import { useState } from 'react'
import { signIn } from 'next-auth/client'
import { FcGoogle } from 'react-icons/fc'
import { FaMagic } from 'react-icons/fa'

function getCallbackUrl(email) {
	try {
		const urlParams = new URLSearchParams(window.location.search)
		if (!urlParams) {
			throw Error('Invalid callback URLs')
		}
		return urlParams.get('callbackUrl')
		return `/auth/welcome?email=${encodeURI(email)}`
	} catch (error) {
		console.error(error)
	}
}

function EmailForm({ onSubmit }) {
	const [email, setEmail] = useState('')

	const handleSignIn = async () => {
		await signIn('email', {
			email,
			redirect: false,
			callbackUrl: `/auth/welcome?email=${encodeURI(email)}`
		})
		onSubmit(email)
	}

	return (
		<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3 border border-gray-100">
			<form>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="email"
					>
						Email address
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring focus:shadow-outline"
						type="email"
						id="email"
						name="email"
						placeholder="example@ncrma.net"
						value={email}
						onChange={(event) => {
							setEmail(event.target.value)
						}}
						autoComplete={'true'}
					/>
				</div>
				<button
					className="flex justify-center items-center bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					type="button"
					onClick={handleSignIn}
				>
					<FaMagic className="mr-4" />
					Sign in using magic link
				</button>
			</form>
			<div className="border-t border-gray-200 flex flex-col mt-6 pt-4">
				<button
					className="flex justify-center items-center bg-gray-100 hover:bg-gray-300 w-full text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					onClick={() => signIn('google')}
				>
					<FcGoogle className="mr-4" />
					Sign in using Google Account
				</button>
			</div>
		</div>
	)
}

function CodeForm({ email }) {
	const [token, setToken] = useState('')

	const urlParams = new URLSearchParams({
		email,
		token,
		callbackUrl: `http://localhost:3000/auth/welcome?email=${encodeURI(
			email
		)}`
	})

	return (
		<form
			method="post"
			action={`/api/auth/callback/email?${urlParams}`}
			className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3 flex flex-col border border-gray-100"
		>
			<label
				htmlFor="token"
				className="block text-gray-700 text-sm font-bold mb-2"
			>
				Security code
			</label>
			<input
				className="shadow text-center appearance-none border rounded w-1/2 mx-auto py-2 px-3 text-gray-700 leading-tight focus:ring focus:shadow-outline mb-6"
				type="text"
				id="token"
				name="token"
				value={token}
				placeholder="123456"
				maxLength={6}
				onChange={(event) => {
					setToken(event.target.value)
				}}
			/>
			<button
				type="submit"
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
			>
				Sign In
			</button>
		</form>
	)
}

export default function SignIn() {
	const [email, setEmail] = useState(null)

	return (
		<section className="w-full flex flex-col text-center h-full justify-center items-center">
			{email ? (
				<CodeForm email={email} />
			) : (
				<EmailForm onSubmit={setEmail} />
			)}
		</section>
	)
}
