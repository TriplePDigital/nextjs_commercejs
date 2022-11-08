import useSWR from 'swr'
import {useRouter} from 'next/router'
import commerceGetter from "@/util/commerceGetter";

export default function Success() {
	const {
		query: {transid}
	} = useRouter()


	const {data, error} = useSWR(() => `/api/user/getReceipt?transid=${transid}`, commerceGetter)

	if (!data) {
		return <div>Loading...</div>
	}
	if (error) {
		return <div>Error</div>
	}


	return (
		<div className="w-2/3 mx-auto">
			<h1 className="text-2xl font-bold text-center">Thank you for your purchase {data.transaction.name}!</h1>
			<div className="w-1/2 mx-auto">
				<p className="flex justify-between items-center">
					<span>Transaction ID: </span>
					<span>{data.transaction.transaction_id}</span>
				</p>
				<p className="flex justify-between items-center"><span>Amount:</span>
					<span>${Number(data.transaction.amount).toFixed(2)}</span></p>
				<p className="flex justify-between items-center"><span>Email:</span>
					<span>{data.transaction.email}</span></p>
				<span className="text-xs text-gray-400 italic">Please ensure that you log in to your account with this email address.</span>
				<p className="flex justify-between items-center mt-3"><span>Product(s):</span></p>
				<ul className="">
					{data.transaction.product.map((product, productIndex) => (
						<div key={productIndex} className="flex justify-between border-b">
							<div className="flex flex-col w-1/2 gap-1">
								<li className="font-semibold">{product.description[0]}</li>
								<li className="text-sm text-gray-400">SKU: {product.sku[0]}</li>
							</div>
							<li className="w-1/4 text-right">{Number(product.quantity[0]).toFixed(0)}</li>
							<li className="w-1/4 text-right">${Number(product.amount[0]).toFixed(2)}</li>
						</div>
					))}
				</ul>
			</div>
		</div>
	)
}
