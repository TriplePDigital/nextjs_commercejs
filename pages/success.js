import axios from 'axios'
import useSWR from 'swr'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Navbar } from '../components'

export const fetcher = (url) => axios.get(url).then((res) => res.data)

export default function Success() {
	const {
		query: { session_id }
	} = useRouter()

	//clear shopping cart

	const { data, error } = useSWR(
		() => `/api/checkout_sessions/${session_id}`,
		fetcher
	)

	useEffect(() => {
		if (data) {
			console.log(data)
		}
	}, [data])
	return (
		<>
			<Navbar />
			Thank you for your order!
		</>
	)
}
