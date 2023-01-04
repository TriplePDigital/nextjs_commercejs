import React from 'react'

interface ButtonProps {
	children: React.ReactNode
	id?: string
	className?: string
	onClick?: () => void
	type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
	return (
		<button
			className="px-5 py-3 rounded shadow bg-ncrma-400 hover:bg-ncrma-600 dark:bg-ncrma-700 font-medium uppercase text-white"
			{...props}
		>
			{children}
		</button>
	)
}

export default Button
