import { useCallback, useContext, useEffect, useState } from 'react'
import CollectJSContext from '../context/collect/CollectContext'
import { notify } from '@/util/notification'
import { Account, finishSubmit, Product } from '@/util/createCollect'

type UseCollect = {
	config: Object
	customer: Account
	product: Product
	endpoint: string
}

export default function useCollect({ config, customer, product, endpoint }: UseCollect) {
	const [paymentToken, setPaymentToken] = useState(null)
	const [collect, setCollect] = useState(null)
	const [loading, setLoading] = useState(false)
	const { unsetErrors, addError, collectJSPromise } = useContext(CollectJSContext)

	const reset = useCallback(() => {
		collect.retokenize()
		setPaymentToken(null)
	}, [collect])

	useEffect(() => {
		collectJSPromise.then((collectJS) => {
			setCollect(collectJS)
			collectJS.configure({
				...config,
				callback: function (e) {
					setLoading(true)
					setPaymentToken(e)
					finishSubmit(e.token, customer, product, endpoint)
						.then((res) => {
							if (res) {
								setLoading(false)
								window.location.href = `/success?transid=${res}`
							} else {
								throw 'There was an error processing your order'
							}
						})
						.catch((err) => {
							console.log(err)
							setLoading(false)
						})
				},
				validationCallback: function (fieldName, valid, message) {
					if (valid) {
						unsetErrors(fieldName)
						notify('success', message, fieldName)
						setLoading(false)
					} else {
						unsetErrors(fieldName)
						addError(fieldName, message)
						notify('warning', message, fieldName)
						setLoading(false)
					}
				}
			})
		})
		// No dependencies - we don't ever want this to run more than once. Calling this more times will cause fields to blink.
	}, [])

	return [collect, paymentToken, reset, loading]
}
