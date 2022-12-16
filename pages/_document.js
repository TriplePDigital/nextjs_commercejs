import { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

export default function Document() {
	return (
		<Html>
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
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
