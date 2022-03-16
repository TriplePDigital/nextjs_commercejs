import 'tailwindcss/tailwind.css'
import { Provider } from 'next-auth/client'
import { Layout } from '../components/Layout'
import { SWRConfig } from 'swr'
import axios from 'axios'

const fetcher = (url) => axios.get(url).then((res) => res.data)

function MyApp({ Component, pageProps }) {
	return (
		<Provider session={pageProps.session}>
			<SWRConfig value={{ fetcher }}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</SWRConfig>
		</Provider>
	)
}

export default MyApp
