import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/client'

export default function Navbar() {
	const [session, loading] = useSession()
	return (
		<nav className={`w-full mb-4 border-b shadow-md border-gray-200`}>
			<ul className={`flex flex-row justify-between`}>
				<Link href={`/`}>Home</Link>
				<Link href={`/products`}>Products</Link>
				{!session ? (
					<button onClick={() => signIn()}>Sign in</button>
				) : (
					<div>
						<span className={`inline-block capitalize mr-10`}>
							Hi, {session.user.name.toLowerCase()}!
						</span>
						<button onClick={() => signOut()}>Sign out</button>
					</div>
				)}
			</ul>
		</nav>
	)
}
