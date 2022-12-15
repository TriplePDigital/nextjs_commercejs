import 'tailwindcss/tailwind.css'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from 'next-auth/client'
import { Layout } from '../components/Layout'
import React, { createContext, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { CartContextProvider } from '../context/cartProvider'
import Script from 'next/script'
import Head from 'next/head'
import { SWRConfig } from 'swr'

export const UserContext = createContext({
	user: {},
	setUser: () => {}
})

const defaultContext = {
	cart: [],
	addProductToCart: () => {},
	removeProductFromCart: () => {}
}

export function CreateCartContext() {
	return createContext(defaultContext)
}

export const cartContextObject = CreateCartContext()

function MyApp({ Component, pageProps }) {
	const [user, setUser] = useState(null)

	return (
		<SWRConfig refetchInterval={10000}>
			<Provider session={pageProps.session}>
				<UserContext.Provider value={{ user, setUser }}>
					<CartContextProvider context={cartContextObject}>
						<Head>
							<title>NCRM Academy</title>
							<html
								lang="en"
								className="scroll-smooth"
							/>
							<link
								rel="shortcut icon"
								href="/favicon.ico"
							/>
						</Head>
						<Script
							src="https://secure.nmi.com/token/Collect.js"
							data-tokenization-key={process.env.NEXT_PUBLIC_NMI_COLLECT_KEY}
							strategy="beforeInteractive"
							data-theme="material"
						/>
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
					</CartContextProvider>
				</UserContext.Provider>
			</Provider>
		</SWRConfig>
	)
}

export default MyApp
