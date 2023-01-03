import { Mission } from '@/types/schema/mission'
import { Slug } from '@/types/index'

export type Certificate = {
	_id: string
	_createdAt: string
	_updatedAt: string
	_type: 'certification'
	title: string
	sku: string
	description: string
	price: number
	missions: Mission[]
	slugs: Slug
}
