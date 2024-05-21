import { signIn, signOut, useSession } from 'next-auth/client'
import ActiveLink from './ActiveLink'
import { RiShutDownLine } from 'react-icons/ri'
import { useContext, useState } from 'react'
import { cartContextObject, userContextObject } from '../../pages/_app'
import { BsAwardFill, BsCaretDownFill, BsCaretUpFill, BsFillPersonFill, BsGearFill } from 'react-icons/bs'
import Link from 'next/link'
import { BiCart } from 'react-icons/bi'

export default function Navbar() {
	const [session, loading] = useSession()
	const [toggleDropdown, setToggleDropdown] = useState(false)
	const ctx = useContext(cartContextObject)
	const { user } = useContext(userContextObject)

	return loading ? null : (
		<nav className={`w-full h-16 border-b border-gray-200 px-10`}>
			<ul className={`flex flex-row justify-between items-center h-full`}>
				<div className="flex flex-row justify-around lg:justify-start gap-5 items-center h-full lg:w-2/3 w-1/2 text-gray-500 font-semibold">
					<span
						className="font-bold text-white bg-slate-500 px-2 py-2 rounded"
						title="The current release of this application is still under active development. If you experience any issues with the application, please let one of our associates know."
					>
						PRE-RELEASE
					</span>
					{/* <ActiveLink
						href={`/`}
						activeClassName="font-bold underline underline-offset-8 decoration-4 text-black"
					>
						<a>Browse</a>
					</ActiveLink>
					<ActiveLink
						href={`/enrollments`}
						activeClassName="font-bold underline underline-offset-8 decoration-4 text-black"
					>
						<a>My Learning</a>
					</ActiveLink> */}
					<ActiveLink
						href={`/missions`}
						activeClassName="font-bold underline underline-offset-8 decoration-4 text-black"
					>
						<a>Courses</a>
					</ActiveLink>
					<ActiveLink
						href={`/certificates`}
						activeClassName="font-bold underline underline-offset-8 decoration-4 text-black"
					>
						<a>Certificates</a>
					</ActiveLink>
					<ActiveLink
						href={`/memberships`}
						activeClassName="font-bold underline underline-offset-8 decoration-4 text-black"
					>
						<a>Memberships</a>
					</ActiveLink>
					{user?.role === 'admin' ||
						(user?.role === 'riskManager' && (
							<ActiveLink
								href={`/admin`}
								activeClassName="font-bold underline underline-offset-8 decoration-4 text-black"
							>
								<a>Member Management</a>
							</ActiveLink>
						))}
				</div>
				<div className="lg:w-1/3 w-1/2 flex justify-end">
					{!session ? (
						<>
							<Link
								href={`/cart`}
								passHref={true}
							>
								<a className="flex items-center gap-3 bg-ncrma-400 hover:bg-ncrma-600 font-bold text-white uppercase xl:px-6 px-3 py-2 rounded leading-loose tracking-wide xl:mr-3 mr-1">
									<BiCart size={30} />
									{ctx.cart.length > 0 ? ctx.cart.length : null}
								</a>
							</Link>
							<button
								className="bg-ncrma-400 font-bold text-white uppercase px-6 py-2 rounded leading-loose tracking-wide"
								onClick={() =>
									signIn(null, {
										callbackUrl: `${process.env.NEXT_PUBLIC_CALLBACK_BASE_URL}welcome`
									})
								}
							>
								Sign in
							</button>
						</>
					) : (
						<>
							<Link
								href={`/cart`}
								passHref={true}
							>
								<a className="flex items-center gap-3 bg-ncrma-400 hover:bg-ncrma-600 font-bold text-white uppercase xl:px-6 px-3 py-2 rounded leading-loose tracking-wide mr-1">
									<BiCart size={30} />
									{ctx.cart.length > 0 ? ctx.cart.length : null}
								</a>
							</Link>
							<button
								className="relative bg-ncrma-100 hover:bg-ncrma-300 rounded-lg xl:px-5 px-3 py-2 flex flex-row items-center"
								onClick={() => setToggleDropdown(!toggleDropdown)}
								onMouseLeave={() => setToggleDropdown(false)}
							>
								<div className="h-8 w-8 rounded-full mr-2 overflow-hidden">
									<BsFillPersonFill size={30} />
								</div>

								<span className={`inline-block capitalize mr-2 font-semibold leading-loose tracking-wide`}>{user?.firstName?.toLowerCase()}</span>
								{toggleDropdown ? (
									<ol className="absolute w-full h-fit top-full left-0 bg-gray-100 rounded shadow-md border text-left flex flex-col gap-1 z-50">
										<button onClick={() => alert('Purchase membership to access exclusive features')}>
											<li className="flex gap-2 items-center hover:bg-gray-200 px-2 py-3 capitalize">
												<span className="opacity-50">
													<BsAwardFill />
												</span>
												{user?.membershipType ? user?.membershipType.name : 'Become a Member'}
											</li>
										</button>
										<Link
											href={user ? `/user/student/${user._id}` : '/user'}
											passHref={false}
										>
											<a>
												<li className="flex gap-2 items-center hover:bg-gray-200 px-2 py-3">
													<span className="opacity-50">
														<BsGearFill />
													</span>
													Your Profile
												</li>
											</a>
										</Link>
										<a
											onClick={() =>
												signOut({
													callbackUrl: `${process.env.NEXTAUTH_URL}/login`
												})
											}
										>
											<li className="flex gap-2 items-center hover:bg-gray-200 px-2 py-3">
												<span className="opacity-50">
													<RiShutDownLine />
												</span>
												Log Out
											</li>
										</a>
									</ol>
								) : null}
								<span>{toggleDropdown ? <BsCaretUpFill /> : <BsCaretDownFill />}</span>
							</button>
						</>
					)}
				</div>
			</ul>
		</nav>
	)
}
