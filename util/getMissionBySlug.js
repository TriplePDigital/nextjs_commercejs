import { fetcher } from './fetcher'

export default async function getMissionBySlug(slug) {
	const query = `
        *[_type == 'mission' && slug.current == '${slug}']{
          title,
          "slug": slug.current,
          "stages": *[_type == 'stage' && references(^._id)] | order(order){
            title,
            "slug": slug.current,
            "checkpoints": *[_type == 'checkpoint' && references(^._id)] | order(order){
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
