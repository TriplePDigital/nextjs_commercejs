export default async function (req, res) {
	const documentsFromCSV = await req?.body?.csv
	if (!res) {
		res.status(500).json({
			error: 'There was an error processing your CSV file.'
		})
	} else {
		res.json(documentsFromCSV)
		res.status(200)
	}
}
