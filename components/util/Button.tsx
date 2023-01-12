import React from 'react'

interface ButtonProps {
	children: React.ReactNode
	id?: string
	classes?: string
	onClick?: (event: React.MouseEvent) => void
	type?: 'button' | 'submit' | 'reset'
	disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
	const classes = [props.classes, props.disabled ? 'opacity-50 cursor-not-allowed' : '', 'px-5 py-3 rounded' + ' shadow bg-ncrma-400 hover:bg-ncrma-600 dark:bg-ncrma-700 font-medium uppercase text-white'].join(' ')
	return (
		<button
			className={classes}
			{...props}
		>
			{children}
		</button>
	)
}

export default Button
