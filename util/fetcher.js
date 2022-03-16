import axios from 'axios'

export const fetcher = async (query) => {
	const results = await axios.get(
		`https://tfh7h5l0.api.sanity.io/v1/data/query/production?query=${encodeURIComponent(
			query
		)}`
	)

	return results.data.result
}
