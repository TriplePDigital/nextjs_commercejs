import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
// Once upgraded to v4 of NextAuth we need to change the above to the below line
// import GoogleProvider from 'next-auth/providers/google'
import nodemailer from 'nodemailer'
import { emailConfig, serverConfig } from '../util/config'
import { loginRequestTemplate } from '../admin/notification/templates'

function generateRandomNumber() {
	const minm = 100000
	const maxm = 999999
	return process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_LOCAL_PASSWORD : Math.floor(Math.random() * (maxm - minm + 1)) + minm
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
			server: serverConfig,
			from: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
			generateVerificationToken: () => {
				const token = generateRandomNumber()
				return token
			},
			sendVerificationRequest: ({ identifier: email, url, token, provider }) => {
				return new Promise((resolve, reject) => {
					const { from } = provider
					let transporter = nodemailer.createTransport(emailConfig)

					transporter.verify(function (error, success) {
						if (error) {
							throw new Error(error)
						} else {
							if (success) {
								transporter.sendMail(
									{
										to: email,
										from,
										subject: `NCRMA Learning Management System - Prompt for Authentication`,
										text: `Authentication token is: ${token}`,
										html: loginRequestTemplate({ email, url, token })
									},
									(error) => {
										if (error) {
											return reject(new Error(`SEND_VERIFICATION_EMAIL_ERROR ${error}`))
										}
										return resolve()
									}
								)
							} else {
								return reject(new Error('There was an error while sending your magic password email.'))
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
	debug: process.env.NODE_ENV !== 'production'
}

export default (req, res) => NextAuth(req, res, options)
