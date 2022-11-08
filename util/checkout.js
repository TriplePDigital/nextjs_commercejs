/* eslint-disable no-undef */

const checkout = (items) => CollectCheckout.redirectToCheckout({
    lineItems: items,
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

export default checkout