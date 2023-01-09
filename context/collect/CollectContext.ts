import { createContext } from 'react'

const context = createContext({
	unsetErrors: null,
	addError: null,
	collectJSPromise: null,
	state: {
		errors: []
	}
})

export default context
