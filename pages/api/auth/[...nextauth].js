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
							console.log(`Transport verify error: ${error}`);
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
																					<body style="background: #f9f9f9;">
			  <table width="100%" border="0" cellspacing="0" cellpadding="0">
				<tr>
				  <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
					<strong>NCRMA Learning Management System</strong>
				  </td>
				</tr>
			  </table>
			  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: #ffffff; max-width: 600px; margin: auto; border-radius: 10px;">
				<tr>
				  <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
					Sign in as <strong>${encodeURI(email)}</strong>
				  </td>
				</tr>
				<tr>
				  <td align="center" style="padding: 20px 0;">
					<table border="0" cellspacing="0" cellpadding="0">
					  <tr>
						<td align="center" style="border-radius: 5px;" bgcolor="#346df1"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid #346df1; display: inline-block; font-weight: bold;">${token}</a></td>
					  </tr>
					</table>
				  </td>
				</tr>
				<tr>
				  <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
					If you did not request this email you can safely ignore it.
				  </td>
				</tr>
			  </table>
			</body>

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
export default (req, res) =>NextAuth(req, res, options)
