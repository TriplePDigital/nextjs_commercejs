import { useCallback, useContext, useEffect, useState } from 'react'
import CollectJSContext from '../context/collect/CollectContext'
import { notify } from '@/util/notification'
import { finishSubmit } from '@/util/createCollect'

type UseCollect = {
	config: any
	customer: {
		firstName: string
		lastName: string
		email: string
	}
	product: {
		price: number
		sku: string
	}
	endpoint: string
}

export default function useCollect({ config, customer, product, endpoint }: UseCollect) {
	const [paymentToken, setPaymentToken] = useState(null)
	const [collect, setCollect] = useState(null)
	const { unsetErrors, addError, collectJSPromise } = useContext(CollectJSContext)
	console.log({ config, customer, product, endpoint })

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
					console.log(e)
					setPaymentToken(e)
					finishSubmit(e.token, customer, product, endpoint).then((res) => {
						if (res) {
							console.log(res)
						}
					})
				},
				validationCallback: function (fieldName, valid, message) {
					if (valid) {
						unsetErrors(fieldName)
						notify('success', message, fieldName)
					} else {
						unsetErrors(fieldName)
						addError(fieldName, message)
						notify('warning', message, fieldName)
					}
				}
			})
		})
		// No dependencies - we don't ever want this to run more than once. Calling this more times will cause fields to blink.
	}, [])

	return [collect, paymentToken, reset]
}
