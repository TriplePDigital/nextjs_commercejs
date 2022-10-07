export default async function (req, res) {
	const fileUpload = await req.body.csv
	if (!res) {
		res.status(500).json({
			error: 'There was an error processing your CSV file.'
		})
	} else {
		res.json(fileUpload).status(200)
	}
}
