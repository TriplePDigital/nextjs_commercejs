import { RiDoubleQuotesL } from 'react-icons/ri'

const mdConfig = {
	h1: ({ node, ...props }) => <h1 className="text-2xl" {...props} />,
	h2: ({ node, ...props }) => <h1 className="text-xl" {...props} />,
	h3: ({ node, ...props }) => <h1 className="text-lg" {...props} />,
	h4: ({ node, ...props }) => <h1 className="text-base" {...props} />,
	h5: ({ node, ...props }) => <h1 className="text-base" {...props} />,
	h6: ({ node, ...props }) => <h1 className="text-base" {...props} />,
	strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
	em: ({ node, ...props }) => <i className="italic" {...props} />,
	blockquote: ({ node, ...props }) => (
		<div className="relative ml-2 my-1 border border-gray-50 rounded-sm shadow px-4 py-4 pl-8 bg-gray-100">
			<RiDoubleQuotesL
				className="absolute left-0 top-0 opacity-10"
				size={36}
			/>
			<blockquote {...props} />
		</div>
	),
	ol: ({ node, ...props }) => <ol className="list-decimal ml-4" {...props} />,
	ul: ({ node, ...props }) => <ul className="list-disc ml-4" {...props} />,
}

export default mdConfig
