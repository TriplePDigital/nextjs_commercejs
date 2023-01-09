import React, { useRef } from 'react'

export default function CardNumInput() {
	const field = useRef()

	return (
		<>
			<div
				id="ccnumber"
				ref={field}
			/>
		</>
	)
}
