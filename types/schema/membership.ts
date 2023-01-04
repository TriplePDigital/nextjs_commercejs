export type Membership = {
	_id: string
	_createdAt: string
	_updatedAt: string
	_rev: string
	_type: 'membership'
	_key?: string
	benefits: string[]
	discount: number
	price: number
	name: string
	sku: string
	description?: string
}
