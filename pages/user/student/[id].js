import { fetcher } from '@/util/fetcher'

function Profile({ profile }) {
	return <div>{profile.name}</div>
}

export default Profile

export async function getServerSideProps(ctx) {
	const { id } = await ctx.query

	const profile = await fetcher(`
    *[_type == 'user'  && _id == '${id}']{
        ...,
        achievements[] -> {...},
        missions[] -> {
            ...,
            coverImage{
            	asset ->
            },
            instructors[]-> {_id, name},
			enrollment[]->{...}
        }
    }`)

	console.log(profile)

	return {
		props: {
			profile: profile.length > 0 ? profile[0] : {}
		}
	}
}
