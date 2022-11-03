import axios from 'axios'

const getter = (query) => {
	return axios.get(`https://tfh7h5l0.api${process.env.NODE_ENV === 'production' ? 'cdn' : ''}.sanity.io/vX/data/query/production?query=${encodeURIComponent(query)}`).then((res) => res.data)
}

export default getter
