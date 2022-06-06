export default async function (req, res) {
	const documentsFromCSV = req?.body?.csv
	console.log('documentsFromCSV', documentsFromCSV)
	res.json(documentsFromCSV)
	res.status(200)
}
