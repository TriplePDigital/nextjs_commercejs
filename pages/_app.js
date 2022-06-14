import 'tailwindcss/tailwind.css'
import { Provider } from 'next-auth/client'
import { Layout } from '../components/Layout'
import { SWRConfig } from 'swr'
import { createContext, useState } from 'react'
import { fetcher } from '../util/fetcher'

export const UserContext = createContext({
	user: {},
	setUser: () => {}
})

// const fetcher = (url) =>
// 	axios
// 		.get(url)
// 		.then((res) => res.data)
// 		.catch((err) => {
// 			throw err
// 		})

function MyApp({ Component, pageProps }) {
	const [user, setUser] = useState(null)

	return (
		<Provider session={pageProps.session}>
			<UserContext.Provider value={{ user, setUser }}>
				<SWRConfig value={{ fetcher }}>
					<Layout session={pageProps.session}>
						<Component {...pageProps} />
					</Layout>
				</SWRConfig>
			</UserContext.Provider>
		</Provider>
	)
}

export default MyApp
