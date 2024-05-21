export const emailConfig = {
	host: process.env.NODE_ENV === 'production' ? 'in-v3.mailjet.com' : 'smtp.mailtrap.io',
	port: process.env.NODE_ENV === 'production' ? 587 : 2525,
	auth: {
		user: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_MAILJET_API_KEY : '9e0c155ae8f9b0',
		pass: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_MAILJET_API_SECRET : '5cf722b6a809ae'
	}
}

export const mailjetServerConfig = {
	host: 'in-v3.mailjet.com',
	port: '587',
	auth: {
		user: process.env.NEXT_PUBLIC_MAILJET_API_KEY,
		pass: process.env.NEXT_PUBLIC_MAILJET_API_SECRET
	}
}

export const serverConfig = process.env.NODE_ENV === 'production' ? mailjetServerConfig : process.env.EMAIL_SERVER
