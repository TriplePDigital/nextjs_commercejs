import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { FaBug, FaCheck, FaExclamationCircle, FaExclamationTriangle, FaInfo } from 'react-icons/fa'

export const displayIcon = (type) => {
	switch (type) {
		case 'success':
			return <FaCheck />
		case 'info':
			return <FaInfo />
		case 'error':
			return <FaExclamationCircle />
		case 'warning':
			return <FaExclamationTriangle />
		default:
			return <FaBug />
	}
}

const ToastMessage = ({ type, message, ID }): React.FC =>
	toast[type](
		<div style={{ display: 'flex' }}>
			<div style={{ flexGrow: 1, fontSize: 15, padding: '8px 12px' }}>{message}</div>
		</div>,
		{
			toastId: ID
		}
	)

ToastMessage.propTypes = {
	message: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	ID: PropTypes.string.isRequired
}

ToastMessage.dismiss = toast.dismiss

export default ToastMessage
