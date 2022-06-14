import { Navbar } from '../Nav'
import { Footer } from './'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import Loader from 'react-spinners/ClipLoader'
import { isActive } from '@/util/isActive'
import { useEffect } from 'react'

export default function Layout({ children }) {
	const [session, loading] = useSession()
	const router = useRouter()

	useEffect(() => {
		if (
			session &&
			!isActive(session?.user?.email) &&
			!router?.pathname.includes('login')
		) {
			router.push(`/auth/welcome?email=${session?.user?.email}`)
		}
		return () => {}
	}, [session, router])

	return loading ? (
		<div className="w-full h-screen flex justify-center items-center text-center">
			<Loader size={96} />
		</div>
	) : (
		<>
			{router?.pathname.includes('login') ? null : <Navbar />}
			<main
				className={`mb-10 px-10 ${
					router?.pathname.includes('login') ? 'h-screen' : ''
				}`}
			>
				{children}
			</main>
			<Footer />
		</>
	)
}
