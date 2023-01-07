const createResponse = (data: string): { transactionID: string; code: string; message: string; error: boolean } | { error: boolean; message: string } => {
	try {
		const response = data.split('&')
		const responseCode = response[8].split('=')[1]
		const responseMsg = response[1].split('=')[1]
		const responseID = response[3].split('=')[1]

		if (Number(responseCode) === 300) {
			return { error: true, message: `Payment failed due to ${responseMsg}` }
		}

		return {
			transactionID: responseID,
			code: responseCode,
			message: responseMsg,
			error: false
		}
	} catch (e) {
		return {
			error: true,
			message: e.message
		}
	}
}

export default createResponse
