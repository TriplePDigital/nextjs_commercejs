import { fetcher } from '@/util/fetcher'
import Image from 'next/image'
import Link from 'next/link'
import mdConfig from '@/util/md'
import ReactMarkdown from 'react-markdown'
import { useNextSanityImage } from 'next-sanity-image'
import { client } from '@/util/config'

function Profile({ profile }) {
	const imageProps = useNextSanityImage(client, profile?.avatar)
	return (
		<section className="mx-auto w-2/3 flex flex-col mt-5">
			<div className="flex items-center gap-4 mb-5">
				<div className="w-20 h-20 rounded-full overflow-hidden relative">
					<Image
						src={imageProps.src}
						loader={imageProps.loader}
						blurDataURL={imageProps.blurDataURL}
						width={imageProps.width}
						height={imageProps.height}
						layout="intrinsic"
						quality={50}
						alt={profile.name}
					/>
					<div className="bg-ncrma-500 w-full h-full absolute top-0 left-0 opacity-40"></div>
				</div>
				<div className="flex flex-col">
					<h1 className="text-lg font-medium mb-2">{profile.name}</h1>
					<p className="text-md">{profile.company}</p>
					<p className="text-md text-gray-500 underline">{profile.email}</p>
				</div>
			</div>
			<div className="">
				<ReactMarkdown
					components={mdConfig}
					className="my-2"
				>
					{profile.bio}
				</ReactMarkdown>
			</div>
			<div className="flex flex-col my-5">
				<h1 className="font-medium text-xl">Course(s) by {profile.name}</h1>
				<table className="container w-full flex flex-col rounded shadow-md">
					<thead className="border-b-2 border-gray-500">
						<tr className="w-full bg-gray-200 flex items-center px-5 py-2 items-center">
							<th className="" />
							<th className="flex-[2]">Course</th>
							<th className="border-l border-gray-500 flex-[3]">Description</th>
							<th className="border-l border-gray-500 flex-[2]">Track Name</th>
							<th className="border-gray-500 border-l flex-1">Number of Enrollments</th>
						</tr>
					</thead>
					<tbody className="text-center flex flex-col w-full">
						{profile.missions.map((mission, count) => (
							<tr
								key={count}
								className="border-b border-r flex relative items-center justify-between w-full py-5"
							>
								<span
									className="block w-2 h-full absolute left-0 top-0"
									style={{
										backgroundColor: `${mission.colorCode}`
									}}
								/>
								<td className="ml-4 flex-[2]">
									<Link
										href={`/mission/${mission.slug}`}
										passHref
										key={count}
									>
										<a>{mission.title}</a>
									</Link>
								</td>
								<td className="flex-[3]">{mission.description.length > 100 ? `${mission.description.slice(0, 90)}...` : mission.description}</td>
								<td className="flex-[2]">{mission?.track?.name || ''}</td>
								<td className="flex-1">{mission.enrollmentCount}</td>
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
