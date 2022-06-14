export default async function (req, res) {
	const documentsFromCSV = await req?.body?.csv
	res.json(documentsFromCSV)
	res.status(200)
}
