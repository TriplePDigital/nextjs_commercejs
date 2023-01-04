import { useState } from 'react'

export function UserContextProvider({ children, context }) {
	const [user, setUser] = useState()

	const contextValue = {
		user: user,
		setUser: (user) => {
			setUser(user)
		}
	}

	return <context.Provider value={contextValue}>{children}</context.Provider>
}
