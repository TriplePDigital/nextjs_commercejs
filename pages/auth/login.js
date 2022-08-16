import { useEffect, useState} from 'react'
import { signIn } from 'next-auth/client'
import { FaMagic } from 'react-icons/fa'
import { Loader } from '@/components/util'
import { useRouter } from 'next/router'
import { notify } from '@/util/notification'

// eslint-disable-next-line no-unused-vars
function getCallbackUrl(email) {
	try {
		const urlParams = new URLSearchParams(window.location.search)
		if (!urlParams) {
			throw Error('Invalid callback URLs')
		}
		return urlParams.get('callbackUrl')
	} catch (error) {
		throw new Error(error)
	}
}

function EmailForm({ onSubmit }) {
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleSignIn = async (e) => {
		e.preventDefault()
		setLoading(true)
		await signIn('email', {
			email,
			redirect: false
		})
		onSubmit(email)
	}

	useEffect(() => {
		if(router.query.error) {
			setLoading(false)
			setEmail(router.query.email)
			notify(
				'error',
				decodeURI(router.query.error),
				'welcome-page-error'
			)
		}
	}, [])

	return loading ? (
		<Loader size={96} />
	) : (
		<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 lg:w-2/4  md:w-2/3 w-full border border-gray-100">
			<form onSubmit={handleSignIn}>
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
						required
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
					type="submit"
				>
					<FaMagic className="mr-4" />
					Sign in using magic passcode
				</button>
				<p className="text-sm text-gray-500 my-2">
					You will receive a 6 digit code to your email inbox. This
					code will act as your password and will regenerate upon
					every login attempt.{' '}
					<strong className="text-gray-800">
						DO NOT SHARE THIS CODE WITH ANYONE!
					</strong>
				</p>
			</form>
			{/* <div className="border-t border-gray-200 flex flex-col mt-6 pt-4">
				<button
					className="flex justify-center items-center bg-gray-100 hover:bg-gray-300 w-full text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					onClick={() => signIn('google')}
				>
					<FcGoogle className="mr-4" />
					Sign in using Google Account
				</button>
			</div> */}
		</div>
	)
}

function CodeForm({ email }) {
	const [token, setToken] = useState('')
	const [callbackUrl] = useState(process.env.NEXT_PUBLIC_CALLBACK_BASE_URL)

	const urlParams = new URLSearchParams({
		email,
		token,
		callbackUrl: `${callbackUrl}welcome?email=${email}`
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
				required
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
