export type loginRequestArgs = {
	email: string
	token: string
	url: string
}

export const loginRequestTemplate = ({ email, token, url }: loginRequestArgs) => `
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

export type purchaseTemplateArgs = {
	firstName: string
	lastName: string
	email: string
	description: string
	courses: string[]
}
export const purchaseTemplate = ({ email, firstName, lastName, description, courses }: purchaseTemplateArgs) => `
<body style="background: #f9f9f9; width: 66%; margin-left: auto; margin-right: auto">
	<main style='text-align: center'>
		<section>
			<h1 style=''>New customer added!</h1>
			<p>Customer email: ${email}</p>
			<p>Customer name: ${firstName} ${lastName}</p>
			<p>Order description: ${description}</p>
			<h2>Courses Enrolled:</h2>
			<ul>
				${courses.map((course) => `<li>${course}</li>`)}
			</ul>
		</section>
	</main>
</body>
`
