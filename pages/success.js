// eslint-disable-next-line no-unused-vars
import axios from 'axios'
import useSWR from 'swr'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Success() {
	const {
		query: { session_id }
	} = useRouter()

	//clear shopping cart

	// eslint-disable-next-line no-unused-vars
	const { data, error } = useSWR(() => `/api/checkout_sessions/${session_id}`)

	useEffect(() => {
		if (data) {
			// eslint-disable-next-line no-console
			console.log(data)
		}
	}, [data])
	return <>Thank you for your order!</>
}
