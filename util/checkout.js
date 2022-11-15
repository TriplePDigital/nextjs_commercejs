/* eslint-disable no-undef */

const checkout = (items) => {
	const filteredItems = items.filter((item) => item.quantity > 0 && item.sku !== undefined && item.sku !== null)
	return CollectCheckout.redirectToCheckout({
		lineItems: filteredItems,
		successUrl: `${process.env.NEXT_PUBLIC_NMI_SUCCESS_URL}?transid={TRANSACTION_ID}`,
		cancelUrl: process.env.NEXT_PUBLIC_NMI_CANCEL_URL,
		receipt: {
			showReceipt: true,
			redirectToSuccessUrl: true,
			sendToCustomer: true
		},
		customerVault: {
			addCustomer: true
		}
	})
}

export default checkout
