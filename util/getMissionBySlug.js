import { fetcher } from './fetcher'
import groq from 'groq'

export default async function getMissionBySlug(slug) {
	const query = groq`
        *[_type == 'mission' && slug.current == '${slug}']{
          _id,
          title,
          blurb,
          description,
          categories,
          colorCode,
          "instructors": *[_type == 'instructor' && references(^._id)]{
            ...,
            "avatar": avatar.asset->
          },
          instructors[]->{
            ...,
            "avatar": avatar.asset->
          },
          "coverImage": coverImage.asset->,
          "slug": slug.current,
          "stages": *[_type == 'stage' && references(^._id)] | order(order asc){
            title,
            "slug": slug.current,
            "checkpoints": *[_type == 'checkpoint' && references(^._id)] | order(order asc){
              _id,
              title,
              "slug": slug.current,
              type -> {
                  title,
                  questions [] -> {
                    title,
                    answers []{
                      answers,
                      correct
                    }
                  },
                  attempts [] -> ,
                  minimumScore,
                  instructor -> {
                    name,
                    avatar {asset ->}
                  },
                  "duration": vimeoVideo.oEmbedData.duration,
                  "url": vimeoVideo.url,
                  body
              },
              "progress": *[_type == 'progress' && references(^._id)]{status}[0],
              instance
            }
          }
        }[0]
    `
	const result = await fetcher(query)
	return result
}
