// import Head from 'next/head'
import { useSession, signIn, signOut } from 'next-auth/client'

export default function Home({ }) {
	// eslint-disable-next-line no-unused-vars
	const [session, loading] = useSession()

	if (session) {
		return (
			<div>
				<p>User: {session.user.name}</p>
				<button onClick={() => signOut({ redirect: false })}>
					Sign Out
				</button>
			</div>
		)
	}

	return <button onClick={() => signIn('google')}>Sign In with google</button>
}
