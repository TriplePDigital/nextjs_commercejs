import axios from 'axios'

const edgeFetcher = ({ endpoint, params }) => {
	return axios
		.get(`${process.env.NEXT_PUBLIC_EDGE_URL}/${endpoint}`, { params })
		.then((res) => {
			return JSON.parse(res.data)
		})
		.catch((err) => console.error(err))
}

export default edgeFetcher
