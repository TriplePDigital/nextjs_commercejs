import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
// Once upgraded to v4 of NextAuth we need to change the above to the below line
// import GoogleProvider from 'next-auth/providers/google'
import nodemailer from 'nodemailer'
import { Novu } from '@novu/node'
import { client } from '@/util/config'
import type { User } from '@/types/schema/user'

const novu = new Novu(process.env.NOVU_API_KEY)

function generateRandomNumber() {
	const minm = 100000
	const maxm = 999999
	return process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_LOCAL_PASSWORD : Math.floor(Math.random() * (maxm - minm + 1)) + minm
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
	host: process.env.NODE_ENV === 'production' ? 'in-v3.mailjet.com' : 'smtp.mailtrap.io',
	port: process.env.NODE_ENV === 'production' ? 587 : 2525,
	auth: {
		user: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_MAILJET_API_KEY : '9e0c155ae8f9b0',
		pass: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_MAILJET_API_SECRET : '5cf722b6a809ae'
	}
}

const findUserInSanity = async (email: string): Promise<User> => {
	const query = `*[_type == "user" && email == $email][0]`
	const params = { email: email.toLowerCase() }
	return await client.fetch(query, params)
}

const authenticate = async (email) => {
	//find user in sanity and return user object
	//if user does not exist, send email to user with error message
	//if user exists, get the subscriber ID

	//trigger novu authentication
	//send email to user with authentication token

	const user = await findUserInSanity(email)
	if (!user) {
		return false
	} else {
		const subscriberId = user._id
		const sub = await novu.subscribers.identify(subscriberId, {
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName
		})
		return {
			...user,
			sub: sub.data.data.subscriberId
		}
	}
}

const options = {
	providers: [
		Providers.Email({
			server: process.env.NODE_ENV === 'production' ? mailjetServerConfig : process.env.EMAIL_SERVER,
			from: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
			// @ts-ignore
			generateVerificationToken: () => {
				return generateRandomNumber()
			},
			sendVerificationRequest: async ({ identifier: email, url, token, provider }) => {
				const subscriber = await authenticate(email)

				if (subscriber) {
					novu
						.trigger('login', {
							to: {
								subscriberId: subscriber.sub,
								email: email
							},
							payload: {
								auth_code: token,
								email: email,
								url: url
							}
						})
						.catch((error) => {
							console.log(error)
						})
				} else {
					//send email to user with error message
					let transporter = nodemailer.createTransport(transporterConfigMailtrap)
					const message = {
						from: provider.from,
						to: email,
						subject: 'Login Request Error',
						html: `
							<body style="background: #f9f9f9;">
							  <table width="100%" border="0" cellspacing="0" cellpadding="0">
								<tr>
								  <td align="center" style="padding: 10px 0 20px 0; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
									<strong>NCRMA Learning Management System</strong>
								  </td>
								</tr>
							  </table>
							  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: #ffffff; max-width: 600px; margin: auto; border-radius: 10px;">
								<tr>
								  <td align="center" style="padding: 20px 0;">
									<table border="0" cellspacing="0" cellpadding="0">
									  <tr>
										<td>
											<p>You are receiving this email because you have attempted to log in to the NCRM Academy Learning Management System, with an email that has not been set up yet. Please ensure that you are signing in using the email (${email}) that you purchased your courses with, or that an associate set you up with. If you believe this was a mistake please contact us immidetly.</p>
										</td>
									  </tr>
									</table>
								  </td>
								</tr>
							  </table>
							</body>`
					}
					transporter.sendMail(message, (err, info) => {
						if (err) {
							console.log(err)
						} else {
							console.log(info)
						}
					})
				}
				// 	return new Promise((resolve, reject) => {
				// 		// const { from } = provider
				// 		// let transporter = nodemailer.createTransport(transporterConfigMailtrap)
				//
				//
				// // 		transporter.verify(function (error, success) {
				// // 			if (error) {
				// // 				throw new Error(error)
				// // 			} else {
				// // 				if (success) {
				// // 					transporter.sendMail(
				// // 						{
				// // 							to: email,
				// // 							from,
				// // 							subject: `NCRMA Learning Management System - Prompt for Authentication`,
				// // 							text: `Authentication token is: ${token}`,
				// 							html:
				// // 						},
				// // 						(error) => {
				// // 							if (error) {
				// // 								return reject(new Error(`SEND_VERIFICATION_EMAIL_ERROR ${error}`))
				// // 							}
				// // 							return resolve()
				// // 						}
				// // 					)
				// // 				} else {
				// // 					return reject(new Error('There was an error while sending your magic password email.'))
				// // 				}
				// // 			}
				// // 		})
				// 	})
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
	debug: false
}

export default (req, res) => NextAuth(req, res, options)
