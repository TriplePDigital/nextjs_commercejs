import ClipLoader from 'react-spinners/ClipLoader'

export default function Loader({ loading = true, size = 75, color = '#000000' }: LoaderProps) {
	return (
		<div className="w-1/2 mx-auto text-center">
			<ClipLoader
				loading={loading}
				size={size}
				color={color}
			/>
		</div>
	)
}

type LoaderProps = {
	loading?: boolean
	size?: number
	color?: string
}
