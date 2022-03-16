import axios from 'axios'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function Orders({ products }) {
	const {
		query: { member }
	} = useRouter()

	console.log(products)

	return (
		<div>
			<h1>Orders</h1>
			<ul>
				{products.data.map((invoice, index) => (
					<li key={index}>
						Invoice{' '}
						<span className="text-gray-500 text-sm">
							# {invoice.id}
						</span>
						<ol className="ml-10">
							{invoice.lines.data.map((products, index) => (
								<li key={index}>
									{products.id} <br />
									{products.description} <br />
									{(products.amount / 100).toFixed(2)} <br />
									{/* <Image src={products.id} /> */}
								</li>
							))}
						</ol>
					</li>
				))}
			</ul>
		</div>
	)
}

export async function getServerSideProps(context) {
	const { data } = await axios.get(
		`http://localhost:3000/api/member/list_orders?id=${'cus_KYKwXVMMZQjlir'}`
	)
	// console.log(data)

	return {
		props: {
			products: data
		}
	}
}
