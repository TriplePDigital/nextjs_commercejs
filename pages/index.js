// import Head from 'next/head'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { Loader } from '@/components/util'

export default function Home() {
	const [session, loading] = useSession()

	const router = useRouter()

	if (session) {
		router.push('/missions')
	}

	return (
		<div className="w-full h-screen flex justify-center items-center text-center">
			{loading ? (
				<Loader size={96} />
			) : (
				<button
					className="bg-ncrma-400 hover:bg-ncrma-700 text-white rounded py-2 px-4 block mx-auto"
					onClick={() =>
						signIn(null, {
							callbackUrl: `${process.env.NEXT_PUBLIC_CALLBACK_BASE_URL}welcome`
						})
					}
				>
					Sign in to gain access to your courses
				</button>
			)}
		</div>
	)
}
