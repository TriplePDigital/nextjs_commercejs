import moment from 'moment'
import React from 'react'

const ProficiencyMatrix = ({ status, timestamp = moment(new Date()).format('MM/DD/YYYY') }) => {
	if (status === 'proficient') {
		return (
			<div className="grid grid-cols-2 grid-rows-2">
				<div className="bg-green-500 order-4 border border-black text-sm font-light">{moment(timestamp).format('MM/DD/YYYY')}</div>
				<div className="bg-green-500 order-3 text-transparent border border-black">.</div>
				<div className="bg-green-500 order-2 text-transparent border border-black">.</div>
				<div className="bg-green-500 order-1 text-transparent border border-black">.</div>
			</div>
		)
	}
	if (status === 'idRisk') {
		return (
			<div className="grid grid-cols-2 grid-rows-2">
				<div className="bg-green-500 order-4 border border-black text-sm font-light">{moment(timestamp).format('MM/DD/YYYY')}</div>
				<div className="bg-green-500 order-3 text-transparent border border-black">.</div>
				<div className="bg-green-500 order-2 text-transparent border border-black">.</div>
				<div className="bg-transparent order-1 text-transparent border border-black">.</div>
			</div>
		)
	}

	if (status === 'inTraining') {
		return (
			<div className="grid grid-cols-2 grid-rows-2">
				<div className="bg-green-500 order-4 border border-black text-sm font-light">{moment(timestamp).format('MM/DD/YYYY')}</div>
				<div className="bg-green-500 order-3 text-transparent border border-black">.</div>
				<div className="bg-transparent text-transparent border border-black">.</div>
				<div className="bg-transparent text-transparent border border-black">.</div>
			</div>
		)
	}

	if (status === 'started') {
		return (
			<div className="grid grid-cols-2 grid-rows-2">
				<div className="bg-green-500 order-4 border border-black text-sm font-light">{moment(timestamp).format('MM/DD/YYYY')}</div>
				<div className="bg-transparent text-transparent border border-black">.</div>
				<div className="bg-transparent text-transparent border border-black">.</div>
				<div className="bg-transparent text-transparent border border-black">.</div>
			</div>
		)
	} else {
		return (
			<div className="grid grid-cols-2 grid-rows-2">
				<div className="bg-transparent order-4 border border-black text-sm font-light">{moment(timestamp).format('MM/DD/YYYY')}</div>
				<div className="bg-transparent text-transparent border border-black">.</div>
				<div className="bg-transparent text-transparent border border-black">.</div>
				<div className="bg-transparent text-transparent border border-black">.</div>
			</div>
		)
	}
}

export default ProficiencyMatrix
