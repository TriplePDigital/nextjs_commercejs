export type SWRResponse<T> = {
	result: T
	ms: number
	query: string
}

export type Slug = {
	current: string
	_type: 'slug'
}
