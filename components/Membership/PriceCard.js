import { FaCheck } from 'react-icons/fa'
import checkout from '@/util/checkout'

const PriceCard = ({ title, description, price, benefits, sku }) => {
	return (
		<div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
			<h3 className="mb-4 text-2xl font-semibold">{title}</h3>
			<p className="font-light text-gray-500 italic sm:text-base dark:text-gray-400">{description}</p>
			<div className="flex justify-center items-baseline my-8">
				<span className="mr-2 text-5xl font-extrabold relative">
					<span className="text-sm font-medium absolute top-0 left-0">$</span>
					<span className="ml-3">{price}</span>
				</span>
				<span className="text-gray-500 dark:text-gray-400">/yearly</span>
			</div>
			<ul
				role="list"
				className="mb-8 space-y-4 text-left"
			>
				{benefits.map((item, itemIndex) => {
					return (
						<li
							className="flex items-center space-x-3"
							key={itemIndex}
						>
							<FaCheck className="text-green-500 flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
							<span>{item}</span>
						</li>
					)
				})}
			</ul>
			<a
				href="#"
				className="text-white bg-ncrma-600 hover:bg-ncrma-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
				onClick={() =>
					checkout([
						{
							quantity: 1,
							sku: sku
						}
					])
				}
			>
				Get started
			</a>
		</div>
	)
}

export default PriceCard
