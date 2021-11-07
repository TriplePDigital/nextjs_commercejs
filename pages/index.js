import Head from 'next/head'
import Image from 'next/image'
import { Navbar } from '../components'

export default function Home({ posts }) {
	return (
		<>
			<Navbar />
		</>
	)
}

export async function getStaticProps(context) {
	const { data } = await axios.get('http://localhost:3000/api/list_products')

	if (!data) {
		return {
			notFound: true
		}
	}

	return {
		props: {
			data
		}
	}
}
