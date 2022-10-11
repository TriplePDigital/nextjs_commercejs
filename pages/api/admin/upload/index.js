export default async function (req, res) {
	const fileUpload = await req.body.csv

	if (!req.body) {
		res.status(500).json({
			error: 'There was an error processing your CSV file.'
		})
	} else {
		res.status(200).json(fileUpload)
	}
}
