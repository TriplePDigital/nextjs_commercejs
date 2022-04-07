import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import axios from 'axios'
import qs from 'qs'
import { Loader } from '../components/util'
import { fetcher } from '../util/fetcher'
import { useSession, signIn, signOut } from 'next-auth/client'

export default function Home({ missions }) {
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

	return <button onClick={() => signIn('google')}>Sign In</button>
}
