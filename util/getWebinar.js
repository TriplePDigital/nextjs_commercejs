import groq from 'groq'

export const webinarQuery = groq`*[_type == 'webinar' ] | order(releaseDateDesc){
				...,
				presenters[]->{
					...,
					avatar {
						...,
						asset ->
					}
				},
			}[0]`
