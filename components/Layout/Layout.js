import { Navbar } from '../Nav'
import { Footer } from './'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import Loader from 'react-spinners/ClipLoader'
import { isActive } from '@/util/isActive'
import React, { useEffect } from 'react'
import AdminSidebar from '../Nav/AdminSidebar'
import Head from 'next/head'

export default function Layout({ children }) {
	const [session, loading] = useSession()
	const router = useRouter()

	useEffect(() => {
		let mounted = true

		if (mounted) {
			if (session && !loading && !router?.pathname.includes('login')) {
				isActive(session.user.email)
					.then((res) => {
						if (!res) {
							router.push(`/auth/welcome?email=${session?.user?.email}`)
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
			<Head>
				<title>NCRM Academy</title>
			</Head>
			{!router?.pathname.includes('login') && !router?.pathname.includes('promo') ? <Navbar /> : null}
			<main className={`mb-10 ${router?.pathname.includes('promo') ? 'px-0' : 'px-10'} ${router?.pathname.includes('login') ? 'h-screen' : ''} ${router.pathname.includes('/admin') ? 'flex lg:flex-row flex-col justify-between gap-3' : ''}`}>
				{router.pathname.includes('/admin') && <AdminSidebar />}
				{children}
			</main>
			<Footer />
		</>
	)
}
