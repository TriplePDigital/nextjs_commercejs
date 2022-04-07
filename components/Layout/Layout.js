import { Navbar } from '../Nav'
import { Footer } from './'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
	const [session, loading] = useSession()
	const router = useRouter()
	console.log(router)
	console.log(session)
	return (
		<>
			{router?.pathname.includes('login') ? null : <Navbar />}
			<main
				className={`mb-10 px-10 ${
					router?.pathname.includes('login') ? 'h-screen' : ''
				}`}
			>
				{children}
			</main>
			{/* <Footer /> */}
		</>
	)
}

export async function getServerSideProps(ctx) {
	// const res = await fetcher(`
	// *[_type == 'explorer' && email == '${session?.user?.email}']{
	//     ...,
	// }`)
}
