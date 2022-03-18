import { Navbar } from '../Nav'
import { Footer } from './'

export default function Layout({ children }) {
	return (
		<>
			<Navbar />
			<main className="mb-10 px-10">{children}</main>
			{/* <Footer /> */}
		</>
	)
}
