import { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

export default function Document() {
	return (
		<Html
			lang="en"
			className="scroll-smooth"
		>
			<Head>
				<link
					rel="shortcut icon"
					href="/favicon.ico"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
