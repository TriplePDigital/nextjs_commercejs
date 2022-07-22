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

	const checkForActive = () => {
		if (session && !loading && !router?.pathname.includes('login')) {
			isActive(session.user.email)
				.then((res) => {
					if (!res) {
						router.push(
							`/auth/welcome?email=${session?.user?.email}`
						)
					} else {
						return true
					}
				})
				.catch((err) => {
					throw new Error(err)
				})
		}
	}

	useEffect(() => {
		let mounted = true

		if (mounted) {
			if (session && !loading && !router?.pathname.includes('login')) {
				isActive(session.user.email)
					.then((res) => {
						if (!res) {
							router.push(
								`/auth/welcome?email=${session?.user?.email}`
							)
						} else {
							return true
						}
					})
					.catch((err) => {
						throw new Error(err)
					})
			}
		}

		return () => {
			mounted = false
		}
	}, [session, loading, router])

	return loading ? (
		<div className="w-full h-screen flex justify-center items-center text-center">
			<Loader size={96} />
		</div>
	) : (
		<>
			{!router?.pathname.includes('login') ? <Navbar /> : null}
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
