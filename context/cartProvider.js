import { useState } from 'react'

export function CartContextProvider({ children, context }) {
	const [products, setProducts] = useState([])

	const getProductById = (id) => {
		return products.find((p) => p.item === id)
	}

	const addProductToCart = (product) => {
		{
			const existingProduct = getProductById(product.item)
			let newState = []
			if (existingProduct) {
				newState = products.map((p) => {
					if (p.item === existingProduct.item) {
						return {
							item: p.item,
							quantity: p.quantity + product.quantity
						}
					}
					return p
				})
				setProducts(newState)
			}
			setProducts([...products, product])
		}
	}
	const removeProductFromCart = (product) => {
		const newProducts = products.filter((p) => p.item !== product)

		setProducts(newProducts)
	}

	const contextValue = {
		cart: products,
		addProductToCart: addProductToCart,
		removeProductFromCart: removeProductFromCart
	}

	return <context.Provider value={contextValue}>{children}</context.Provider>
}
