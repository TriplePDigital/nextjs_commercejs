import { useSession, signIn, signOut } from 'next-auth/client'
import ActiveLink from './ActiveLink'
import { Loader } from '../util'
import Image from 'next/image'

export default function Navbar() {
	const [session, loading] = useSession()
	return (
		<nav className={`w-full h-16 border-b border-gray-200 px-10`}>
			<ul className={`flex flex-row justify-between items-center h-full`}>
				<ActiveLink href={`/`} activeClassName="font-bold">
					<a>Home</a>
				</ActiveLink>
				<ActiveLink href={`/products`} activeClassName="font-bold">
					<a>Products</a>
				</ActiveLink>
				{/* <ActiveLink href={`/abc/orders`} activeClassName="font-bold">
					<a>Orders</a>
				</ActiveLink> */}
				<ActiveLink href={`/missions`} activeClassName="font-bold">
					<a>Missions</a>
				</ActiveLink>
				{!session ? (
					<button onClick={() => signIn()}>Sign in</button>
				) : loading ? (
					<Loader />
				) : (
					<div className="bg-blue-300 rounded-lg px-5 py-2 flex flex-row items-center">
						<div className="h-8 w-8 rounded-full mr-2 overflow-hidden">
							<Image
								src={session?.user?.image}
								alt="Profile picture"
								width={4}
								height={4}
								layout="responsive"
								quality={50}
							/>
						</div>
						<span
							className={`inline-block capitalize mr-2 font-semibold leading-loose tracking-wide`}
						>
							{session.user.name.toLowerCase()}!
						</span>
						<button
							className="underline cursor-pointer"
							onClick={() => signOut()}
						>
							Sign out
						</button>
					</div>
				)}
			</ul>
		</nav>
	)
}
