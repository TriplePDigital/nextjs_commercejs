import 'tailwindcss/tailwind.css'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from 'next-auth/client'
import { Layout } from '../components/Layout'
import React, { createContext, useContext } from 'react'
import { ToastContainer } from 'react-toastify'
import { CartContextProvider } from '../context/cartProvider'
import Script from 'next/script'
import { SWRConfig } from 'swr'
import * as Sentry from '@sentry/browser'
import { Analytics } from '@vercel/analytics/react'
import Head from 'next/head'
import { UserContextProvider } from '../context/user'
import CollectProvider from '../context/collect/CollectProvider'
import injectCollect from '@/util/createCollect'

const defaultContext = {
	cart: [],
	addProductToCart: () => {},
	removeProductFromCart: () => {}
}

const defaultUserContext = {
	user: null,
	setUser: () => {}
}

export function CreateCartContext() {
	return createContext(defaultContext)
}

export function CreateUserContext() {
	return createContext(defaultUserContext)
}

export const cartContextObject = CreateCartContext()
export const userContextObject = CreateUserContext()

const collectJS = typeof window !== 'undefined' && injectCollect('https://secure.networkmerchants.com/token/Collect.js', process.env.NEXT_PUBLIC_NMI_COLLECT_KEY)

function MyApp({ Component, pageProps }) {
	const { user } = useContext(userContextObject)
	Sentry.setUser({ email: user?.email || '' })
	return (
		<SWRConfig refetchInterval={10000}>
			<Provider session={pageProps.session}>
				<CollectProvider collectJSPromise={collectJS}>
					<UserContextProvider context={userContextObject}>
						<CartContextProvider context={cartContextObject}>
							<Head>
								<meta
									name="viewport"
									content="width=device-width, initial-scale=1"
								/>
							</Head>
							{/*<Script*/}
							{/*	src="https://secure.nmi.com/token/Collect.js"*/}
							{/*	data-tokenization-key={process.env.NEXT_PUBLIC_NMI_COLLECT_KEY}*/}
							{/*	strategy="beforeInteractive"*/}
							{/*	data-theme="material"*/}
							{/*/>*/}
							<Script
								src="https://secure.nmi.com/token/CollectCheckout.js"
								data-checkout-key={process.env.NEXT_PUBLIC_NMI_PUB_KEY}
								strategy="beforeInteractive"
							/>
							<Layout>
								<Analytics />
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
					</UserContextProvider>
				</CollectProvider>
			</Provider>
		</SWRConfig>
	)
}

export default MyApp
