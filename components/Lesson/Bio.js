import Markdown from 'markdown-to-jsx'

export default function Bio({ data }) {
	return (
		<Markdown
			className="text-sm text-gray-500"
			options={{
				overrides: {
					h1: {
						props: {
							className: 'text-2xl font-bold text-gray-800'
						}
					},
					h2: {
						props: {
							className: 'text-xl pb-2 text-gray-700'
						}
					},
					h3: {
						props: {
							className: 'text-lg pb-1 text-gray-500'
						}
					},
					h4: {
						props: {
							className: 'text-base pb-1 text-gray-500'
						}
					},
					h5: {
						props: {
							className: 'text-md pb-1 text-gray-500'
						}
					},
					ul: {
						props: {
							className: 'list-disc list-inside'
						}
					},
					ol: {
						props: {
							className: 'list-decimal list-inside'
						}
					}
				}
			}}
		>
			{data}
		</Markdown>
	)
}
