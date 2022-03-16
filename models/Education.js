import mongoose from 'mongoose'

const EduSchema = new mongoose.Schema({
	progress: {
		course: [{}]
	}
})

export const Education =
	mongoose.models.Education || mongoose.model('Education', EduSchema)
