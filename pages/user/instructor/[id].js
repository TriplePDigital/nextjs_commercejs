import { fetcher } from '@/util/fetcher'
import imgConstructor from '@/util/img'
import Image from 'next/image'
import Link from 'next/link'

function Profile({ profile }) {
	return (
		<section className="mx-auto w-1/2 flex flex-col mt-5">
			<div className="flex items-center gap-4 mb-5">
				<div className="w-20 h-20 rounded-full overflow-hidden relative">
					<Image
						{...imgConstructor(profile.avatar)}
						layout="intrinsic"
						quality={50}
						alt={profile.name}
					/>
					<div className="bg-ncrma-500 w-full h-full absolute top-0 left-0 opacity-40"></div>
				</div>
				<div className="flex flex-col">
					<h1 className="text-lg font-medium mb-2">{profile.name}</h1>
					<p className="text-md">{profile.company}</p>
					<p className="text-md text-gray-500 underline">
						{profile.email}
					</p>
				</div>
			</div>
			<div className="">{profile.bio}</div>
			<div className="flex flex-col my-5">
				<h1 className="font-medium text-xl">
					Course(s) by {profile.name}
				</h1>
				<table className="">
					<thead className="border-b-2 border-gray-500">
						<tr>
							<th></th>
							<th>Course</th>
							<th>Description</th>
							<th>Track Name</th>
							<th>Number of Enrollments</th>
						</tr>
					</thead>
					<tbody className="text-center">
						{profile.missions.map((mission, count) => (
							<tr key={count} className="border-b">
								<span
									className="w-1 h-auto"
									style={{
										backgroundColor: `${mission.colorCode}`
									}}
								></span>
								<td>
									<Link
										href={`/mission/${mission.slug}`}
										passHref
										key={count}
									>
										<a>{mission.title}</a>
									</Link>
								</td>
								<td>{mission.description}</td>
								<td>{mission.track.name}</td>
								<td>{mission.enrollmentCount}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	)
}

export default Profile

export async function getServerSideProps(ctx) {
	const { id } = await ctx.query

	const profile = await fetcher(`
    *[_type == 'instructor'  && _id == '${id}']{
        bio,
        email,
        company,
        avatar {
            ...,
            asset ->
        },
        name,
        "stages": *[_type == 'checkpoint'  && references(^._id)],
        "missions": *[_type == 'mission'  && references(^._id)]{
            _id,
            "slug": slug.current,
            title,
            description,
            "asset":coverImage.asset ->,
            instructors[]-> {_id, name},
            colorCode,
            "enrollmentCount": count(*[_type == 'enrollment'  && references(^._id)]),
            "track": *[_type == 'track'  && references(^._id)][0]
        }
    }[0]`)

	if (!profile) {
		return {
			redirect: {
				destination: `/404`,
				permanent: false
			}
		}
	}

	return {
		props: {
			profile
		}
	}
}
