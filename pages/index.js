// import Head from 'next/head'
import { useState } from 'react'
import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { Loader } from '@/components/util'

export default function Home({}) {
	const [session] = useSession()
	const [loading, setLoading] = useState(false)

	const router = useRouter()

	if (session) {
		router.push('/missions')
	}

	return (
		<div className="w-full h-screen flex justify-center items-center text-center">
			{loading ? (
				<Loader size={96} />
			) : (
				<button onClick={() => signIn()}>
					Sign In to gain access to your courses
				</button>
			)}
		</div>
	)
}
