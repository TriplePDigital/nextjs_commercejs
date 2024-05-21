import axios, { AxiosRequestConfig } from 'axios'
import { Fetcher } from 'swr'

const edgeFetcher: Fetcher<any> = ({ endpoint, params }: EdgeFetcher) => {
	return axios
		.get(`${process.env.NEXT_PUBLIC_EDGE_URL}/${endpoint}`, { params })
		.then((res) => {
			return JSON.parse(res.data)
		})
		.catch((err) => console.error(err))
}

type EdgeFetcher = {
	endpoint: string
	params: AxiosRequestConfig<any>
}

export default edgeFetcher
