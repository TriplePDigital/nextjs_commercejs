import ClipLoader from 'react-spinners/ClipLoader'

export default function Loader({ loading, size = 75, color = '#000000' }) {
	return (
		<div className="w-1/2 mx-auto text-center">
			<ClipLoader loading={loading} size={size} color={color} />
		</div>
	)
}
