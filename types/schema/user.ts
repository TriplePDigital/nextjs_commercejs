export type User = {
	_id: string
	_type: 'user'
	_createdAt: string
	_updatedAt: string
	_rev: string
	_key?: string
	firstName: string
	lastName: string
	email: string
	avatar?: AvatarWeak | AvatarPopulated
	role?: 'riskManager' | 'admin' | 'student'
	active?: boolean
	account_id: string
}

export type AvatarWeak = {
	_type: 'reference'
	_ref: string
}

export type AvatarPopulated = {
	_type: 'image'
	_key: string
	asset: {
		_type: 'reference'
		_ref: string
	}
}
