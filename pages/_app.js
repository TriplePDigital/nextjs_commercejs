import 'tailwindcss/tailwind.css'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from 'next-auth/client'
import { Layout } from '../components/Layout'
import { createContext, useState } from 'react'
import { ToastContainer } from 'react-toastify'

export const UserContext = createContext({
	user: {},
	setUser: () => {}
})

function MyApp({ Component, pageProps }) {
	const [user, setUser] = useState(null)

	return (
		<Provider session={pageProps.session}>
			<UserContext.Provider value={{ user, setUser }}>
					<Layout>
						<Component {...pageProps} />
						<ToastContainer
							position="top-right"
							autoClose={8000}
							hideProgressBar={false}
							newestOnTop={false}
							draggable={false}
							pauseOnVisibilityChange
							closeOnClick
							pauseOnHover
						/>
					</Layout>
			</UserContext.Provider>
		</Provider>
	)
}

export default MyApp
