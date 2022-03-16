import ClipLoader from 'react-spinners/ClipLoader'

export default function Loader({ loading }) {
	return (
		<div className="w-1/2 mx-auto text-center">
			<ClipLoader loading={loading} size={75} />
		</div>
	)
}
