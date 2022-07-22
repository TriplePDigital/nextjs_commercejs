import axios from 'axios'

const date = new Date()

const config = {
	headers: {
		'Cache-Control': 'max-age=31536000, immutable',
		'If-Modified-Since': `${date.setMinutes(date.getMinutes() - 120)}`,
		'Access-Control-Allow-Origin': '*'
	}
}

export const fetcher = async (query, useCDN = false) => {
	try {
		const results = await axios.get(
			`https://tfh7h5l0.api${
				useCDN ? 'cdn' : ''
			}.sanity.io/vX/data/query/production?query=${encodeURIComponent(
				query
			)}`,
			config
		)
		return results.data.result
	} catch (error) {
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			throw new Error(
				`\nCode [${error.response.status}]: ${error.response.data.error.type} \n${error.response.data.error.description} \n${error.response.data.error.query}`
			)
		} else if (error.request) {
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			throw new Error(JSON.stringify(error.request))
		} else {
			// Something happened in setting up the request that triggered an Error
			throw new Error(error.message)
		}
	}
}
