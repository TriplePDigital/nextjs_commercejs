import React from 'react'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
} from 'chart.js'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Filler,
	Tooltip,
	Legend
)

import { Line } from 'react-chartjs-2'
function Charts(props) {
	return (
		<section className="bg-gray-100 rounded border border-gray-200 shadow w-full flex">
			<Line
				data={props.data}
				height={40}
				width={100}
				options={props.options}
			/>
		</section>
	)
}

export default Charts
