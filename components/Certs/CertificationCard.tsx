import React from 'react'
import { FaCheck } from 'react-icons/fa'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import Anchor from '@/components/util/Anchor'

function CertificationCard({ certificate }) {
	return (
		<div className="w-full my-8 lg:h-64 h-fit rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col lg:flex-row items-center justify-between gap-4 px-2 lg:px-8 py-2 lg:py-5">
			<div className="flex items-center justify-between w-full lg:w-1/2 h-full">
				<div className="flex flex-col justify-between gap-8">
					<Link
						href={`/certificates/${certificate.slug.current}`}
						passHref={true}
					>
						<a className="hover:underline">
							<h1 className="text-2xl font-medium">{certificate.title}</h1>
						</a>
					</Link>
					<p className="text-sm">
						<ReactMarkdown>{certificate.description}</ReactMarkdown>
					</p>
				</div>
			</div>
			<div className="w-full lg:w-1/2 h-full flex items-center justify-between">
				<ul className="lg:w-2/3 w-full">
					{certificate.missions
						? certificate.missions.map((mission, missionIndex) => (
								<li
									key={missionIndex}
									className="flex items-center gap-2"
								>
									<FaCheck className="text-green-500" />
									<p className="text-sm">{mission.title}</p>
								</li>
						  ))
						: null}
				</ul>
				<div className="lg:w-1/3 w-full">
					<Anchor href={`/certificates/${certificate.slug.current}`}>Learn More</Anchor>
				</div>
			</div>
		</div>
	)
}

export default CertificationCard
