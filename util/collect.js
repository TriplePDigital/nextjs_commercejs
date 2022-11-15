/* eslint-disable no-undef */

const collect = (event) => {
	event.preventDefault()
	if (window) {
		window.CollectJS.startPaymentRequest()
	}
}

export default collect
