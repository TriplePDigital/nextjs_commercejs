import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
	email: 'string',
	name: 'string',
	memberships: 'boolean',
	education: { type: mongoose.Schema.Types.ObjectId, ref: 'Education' },
	orders: ['string']
})

export const User = mongoose.models.User || mongoose.model('User', UserSchema)
