import React from 'react'
import Link from 'next/link'

interface AnchorProps {
	children: React.ReactNode
	href: string
	className?: string
	variant?: 'link' | 'button'
}

const Anchor: React.FC<AnchorProps> = ({ variant = 'link', children, ...props }) => {
	return (
		<Link
			href={props.href}
			{...props}
		>
			<a className={`${variant === 'link' ? 'hover:underline' : ''} ${variant === 'button' ? 'px-5 py-3 rounded' + ' shadow' + ' bg-ncrma-400 hover:bg-ncrma-600 dark:bg-ncrma-700 font-medium uppercase text-white' : ''} ${props.className}`}>
				{children}
			</a>
		</Link>
	)
}

export default Anchor
