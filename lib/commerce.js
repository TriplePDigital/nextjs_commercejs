import Commerce from '@chec/commerce.js'

console.log(process.env.COMMERCE_PUBLIC)

export const commerce = new Commerce(
	process.env.NEXT_PUBLIC_COMMERCE_PUBLIC_LIVE,
	true
)
