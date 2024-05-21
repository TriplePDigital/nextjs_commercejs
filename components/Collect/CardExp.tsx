import React, { useRef } from 'react'

export default function CardExpInput() {
	const field = useRef()

	return (
		<>
			<div
				id="ccexp"
				ref={field}
			/>
		</>
	)
}
