import { useSession, signIn, signOut } from 'next-auth/client'
import ActiveLink from './ActiveLink'
import { Loader } from '../util'
import Image from 'next/image'

export default function Navbar() {
	const [session, loading] = useSession()
	return (
		<nav className={`w-full h-16 border-b border-gray-200 px-10`}>
			<ul className={`flex flex-row justify-between items-center h-full`}>
				<div className="flex flex-row justify-between items-center h-full w-1/2">
					<ActiveLink
						href={`/`}
						activeClassName="font-bold underline underline-offset-8"
					>
						<a className="border-b-2 border-transparent">Home</a>
					</ActiveLink>
					<ActiveLink
						href={`/my-learning`}
						activeClassName="font-bold underline underline-offset-8"
					>
						<a>My Learning</a>
					</ActiveLink>
					<ActiveLink
						href={`/missions`}
						activeClassName="font-bold underline underline-offset-8"
					>
						<a>Courses</a>
					</ActiveLink>
					<ActiveLink
						href={`/certs`}
						activeClassName="font-bold underline underline-offset-8"
					>
						<a>Certificates</a>
					</ActiveLink>
				</div>
				<div className="w-1/3 flex justify-end">
					{!session ? (
						<button
							className="bg-teal-400 font-bold text-white uppercase px-6 py-2 rounded leading-loose tracking-wide"
							onClick={() => signIn()}
						>
							Sign in
						</button>
					) : loading ? (
						<Loader />
					) : (
						<>
							<button
								className="bg-teal-400 font-bold text-white uppercase px-6 py-2 rounded leading-loose tracking-wide mr-12"
								onClick={() =>
									alert(
										'Purchase membership to access exclusive features'
									)
								}
							>
								no membership
							</button>
							<div className="bg-teal-100 rounded-lg px-5 py-2 flex flex-row items-center">
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
								{/* <button
								className="underline cursor-pointer"
								onClick={() => signOut()}
							>
								Sign out
							</button> */}
							</div>
						</>
					)}
				</div>
			</ul>
		</nav>
	)
}
