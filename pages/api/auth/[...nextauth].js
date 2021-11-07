import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import * as Fauna from 'faunadb'
import { FaunaAdapter } from '@next-auth/fauna-adapter'

const client = new Fauna.Client({
	secret: process.env.FAUNA_KEY,
	domain: 'db.us.fauna.com'
})
const q = Fauna.query

export default NextAuth({
	providers: [
		Providers.GitHub({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET
		}),
		Providers.Google({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			authorizationUrl:
				'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code'
		})
	],
	session: {
		jwt: true
	}
})
