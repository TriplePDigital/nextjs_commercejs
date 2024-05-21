const createReceiptResponse = (data: NMIResponse): ReceiptResponse => {
	try {
		const { transaction_id, email, first_name, last_name, order_description, merchant_defined_field } = data
		return {
			error: false,
			message: 'Transaction found',
			transaction_id: transaction_id[0],
			email: email[0],
			name: `${first_name[0]} ${last_name[0]}`,
			description: order_description[0],
			merchant_defined_field:
				merchant_defined_field?.length > 0 &&
				merchant_defined_field.map((field) => {
					if (typeof field === 'string') {
						return field
					} else {
						return field._
					}
				})
		}
	} catch (e) {
		return {
			error: true,
			message: e.message
		}
	}
}

export type ReceiptResponse = {
	transaction_id?: string
	amount?: string | number
	product?: []
	email?: string
	name?: string
	description?: string
	merchant_defined_field?: string[] | 'false'
	error: boolean
	message: string
}

export type NMIResponse = {
	transaction_id: [string]
	partial_payment_id: [string]
	partial_payment_balance: [string]
	platform_id: [string]
	transaction_type: [string]
	condition: [string]
	order_id: [string]
	authorization_code: [string]
	ponumber: [string]
	order_description: [string]
	first_name: [string]
	last_name: [string]
	address_1: [string]
	address_2: [string]
	company: [string]
	city: [string]
	state: [string]
	postal_code: [string]
	country: [string]
	email: [string]
	phone: [string]
	fax: [string]
	cell_phone: [string]
	customertaxid: [string]
	customerid: [string]
	website: [string]
	shipping_first_name: [string]
	shipping_last_name: [string]
	shipping_address_1: [string]
	shipping_address_2: [string]
	shipping_company: [string]
	shipping_city: [string]
	shipping_state: [string]
	shipping_postal_code: [string]
	shipping_country: [string]
	shipping_email: [string]
	shipping_carrier: [string]
	tracking_number: [string]
	shipping_date: [string]
	shipping: [string]
	shipping_phone: [string]
	cc_number: [string]
	cc_hash: [string]
	cc_exp: [string]
	cavv: [string]
	cavv_result: [string]
	xid: [string]
	eci: [string]
	directory_server_id: [string]
	three_ds_version: [string]
	avs_response: [string]
	csc_response: [string]
	cardholder_auth: [string]
	cc_start_date: [string]
	cc_issue_number: [string]
	check_account: [string]
	check_hash: [string]
	check_aba: [string]
	check_name: [string]
	account_holder_type: [string]
	account_type: [string]
	sec_code: [string]
	drivers_license_number: [string]
	drivers_license_state: [string]
	drivers_license_dob: [string]
	social_security_number: [string]
	processor_id: [string]
	tax: [string]
	currency: ['USD']
	surcharge: [string]
	cash_discount: [string]
	tip: [string]
	card_balance: [string]
	card_available_balance: [string]
	entry_mode: [string]
	merchant_defined_field?: [{ _: string; $: [Object] } | string]
	cc_bin: [string]
	cc_type: [string]
	signature_image: [string]
	duty_amount: [string]
	discount_amount: [string]
	national_tax_amount: [string]
	summary_commodity_code: [string]
	vat_tax_amount: [string]
	vat_tax_rate: [string]
	alternate_tax_amount: [string]
	action: [
		{
			amount: [string]
			action_type: [string]
			date: [string]
			success: [string]
			ip_address: [string]
			source: [string]
			api_method: [string]
			tap_to_mobile: [string]
			username: [string]
			response_text: [string]
			batch_id: [string]
			processor_batch_id: [string]
			response_code: [string]
			processor_response_text: [string]
			processor_response_code: [string]
			device_license_number: [string]
			device_nickname: [string]
		}
	]
}

export default createReceiptResponse
