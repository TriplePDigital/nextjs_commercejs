import NextAuth, { generateAuthtoken } from 'next-auth'
import { SanityAdapter, SanityCredentials } from 'next-auth-sanity'
import Providers from 'next-auth/providers'
// Once upgraded to v4 of NextAuth we need to change the above to the below line
// import GoogleProvider from 'next-auth/providers/google'
import { configuredSanityClient as client } from '@/util/img'
import nodemailer from 'nodemailer'
import axios from 'axios'

function generateRandomNumber() {
	const minm = 100000
	const maxm = 999999
	return Math.floor(Math.random() * (maxm - minm + 1)) + minm
}

const options = {
	providers: [
		Providers.Google({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			authorizationUrl:
				'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code'
		}),
		Providers.Email({
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
			maxAge: 24 * 60 * 60 * 1000000,
			generateVerificationToken: () => {
				const token = generateRandomNumber()
				console.log('generate verification token: ', token)
				return token
			},
			sendVerificationRequest: ({
				identifier: email,
				url,
				token,
				baseUrl,
				provider
			}) => {
				return new Promise((resolve, reject) => {
					const { server, from } = provider
					nodemailer.createTransport(server).sendMail(
						{
							to: email,
							from,
							subject: `Authentication code: ${token}`,
							text: `Authentication code: ${token}`,
							html: `
							<body style="background: #f9f9f9;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
        <strong>localhost:3000</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: #ffffff; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
        Sign in as <strong>papp&#8203;.dany77@icloud&#8203;.com</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="#346df1"><a target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid #346df1; display: inline-block; font-weight: bold;">${token}</a></td>
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
								console.error(
									'SEND_VERIFICATION_EMAIL_ERROR',
									email,
									error
								)
								return reject(
									new Error(
										`SEND_VERIFICATION_EMAIL_ERROR ${error}`
									)
								)
							}
							return resolve()
						}
					)
				})
			}
		}),
		Providers.Credentials({
			name: 'credentials',
			credentials: {
				username: {
					label: 'email',
					type: 'email',
					placeholder: 'example@ncrma.net'
				},
				password: { label: 'Password', type: 'password' }
			},
			async authorize({ credentials, user }) {
				const { email, password } = credentials
				console.log(user)

				const res = await axios.get(
					`https://us-east-1.aws.data.mongodb-api.com/app/application-0-wgzxo/endpoint/users?email=${email}`,
					{
						method: 'GET',
						headers: { 'Content-Type': 'application/json' }
					}
				)
				const usr = await res.json()
				if (!usr) {
					return true
				} else {
					return null
				}
			}
		})
		//SanityCredentials(configuredSanityClient)
	],
	session: {
		jwt: true
	},
	jwt: {
		secret: process.env.JWT_SECRET
	},
	// adapter: SanityAdapter(configuredSanityClient),
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

export default (req, res) => NextAuth(req, res, options)
