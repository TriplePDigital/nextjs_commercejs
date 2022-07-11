import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
// Once upgraded to v4 of NextAuth we need to change the above to the below line
// import GoogleProvider from 'next-auth/providers/google'
import nodemailer from 'nodemailer'

function generateRandomNumber() {
	const minm = 100000
	const maxm = 999999
	return Math.floor(Math.random() * (maxm - minm + 1)) + minm
}

const mailjetServerConfig = {
	host: 'in-v3.mailjet.com',
	port: '587',
	auth: {
		user: process.env.NEXT_PUBLIC_MAILJET_API_KEY,
		pass: process.env.NEXT_PUBLIC_MAILJET_API_SECRET
	}
}

const transporterConfigMailtrap = {
	host:
		process.env.NODE_ENV === 'production'
			? 'in-v3.mailjet.com'
			: 'smtp.mailtrap.io',
	port: process.env.NODE_ENV === 'production' ? 587 : 2525,
	auth: {
		user:
			process.env.NODE_ENV === 'production'
				? process.env.NEXT_PUBLIC_MAILJET_API_KEY
				: '9e0c155ae8f9b0',
		pass:
			process.env.NODE_ENV === 'production'
				? process.env.NEXT_PUBLIC_MAILJET_API_SECRET
				: '5cf722b6a809ae'
	}
}

const options = {
	providers: [
		// TODO: set-up support for Google accounts after registration for a g-suit account by the company
		// Providers.Google({
		// 	clientId: process.env.GOOGLE_ID,
		// 	clientSecret: process.env.GOOGLE_SECRET,
		// 	authorizationUrl:
		// 		'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code'
		// }),
		Providers.Email({
			server:
				process.env.NODE_ENV === 'production'
					? mailjetServerConfig
					: process.env.EMAIL_SERVER,
			from: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
			generateVerificationToken: () => {
				const token = generateRandomNumber()
				return token
			},
			sendVerificationRequest: ({
				identifier: email,
				url,
				token,
				provider
			}) => {
				return new Promise((resolve, reject) => {
					const { from } = provider
					let transporter = nodemailer.createTransport(
						transporterConfigMailtrap
					)

					transporter.verify(function (error, success) {
						if (error) {
							throw new Error(error)
						} else {
							if (success) {
								console.log(
									'Server is ready to take our messages'
								)
								transporter.sendMail(
									{
										to: email,
										from,
										subject: `NCRMA Learning Management System - Prompt for Authentication`,
										text: `Authentication token is: ${token}`,
										html: `
										<!DOCTYPE html>
											<html lang="en">

											<head>
											<meta charset="UTF-8" />
											<meta http-equiv="X-UA-Compatible" content="IE=edge" />
											<meta name="viewport" content="width=device-width, initial-scale=1.0" />
											</head>
											<style>
											body {
												font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
												background-color: #f9f9f9;
											}
											.wrapper{
												width: 100%; 
												max-width: 600px; 
												margin: 0 auto;
											}
											.container {
												margin: 0 auto;
												max-width: 1100px;
												width: 100%;
												display: flex;
												flex-direction: column;
												align-items: center;
												text-align: center;
												padding: 20px;
												border-radius: 0.5em;
												background-color: #fff;
											}

											h1 {
												font-weight: bold;
												margin: 0 20px;
												font-size: 1.75em;
											}

											h2 {
												font-weight: normal;
												font-size: 1.5em;
											}

											p {
												font-size: 1em;
												line-height: 1.5;
												margin: 0;
												padding: 3px 0;
											}
											.small {
												font-size: 0.8em;
												opacity: 0.6;
											}
											.token {
												background-color: #5FBBBE;
												color: white;
												padding: 0.5em 0.25em;
											}
											</style>

											<body>
											<div class="wrapper">
												<div class="container">
												<h1>
													NCRMA Learning Management System
												</h1>
												<h2>
													Prompt for Authentication
												</h2>
												<p>
													Your authentication code is: <span class="token">${token}</span>
												</p>
												<p class="small">
													Please either click the link below, or copy and paste the 6 digit code into the appropriate field on the website to log into your account.
												</p>
												<br/>
												<p>
													<a href="${url}" style="color: #0070f3;">
													${url}
													</a>
												</p>
												</div>
											</div>
											</body>
										</html>		
										`
									},
									(error) => {
										if (error) {
											return reject(
												new Error(
													`SEND_VERIFICATION_EMAIL_ERROR ${error}`
												)
											)
										}
										return resolve()
									}
								)
							} else {
								return reject(
									new Error(
										'There was an error while sending your magic password email.'
									)
								)
							}
						}
					})
				})
			}
		})
	],
	session: {
		jwt: false,
		maxAge: 30 * 24 * 60 * 60
	},
	jwt: {
		secret: process.env.JWT_SECRET
	},
	database: process.env.DATABASE_URL,
	pages: {
		newUser: '/auth/welcome',
		signIn: '/auth/login'
	},
	// theme: {
	// 	colorScheme: 'auto', // "auto" | "dark" | "light"
	// 	brandColor: '5FBBBE', // Hex color code
	// 	logo: '' // Absolute URL to image
	// }
	debug: process.env.NODE_ENV !== 'production'
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (req, res) => NextAuth(req, res, options)
