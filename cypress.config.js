const { defineConfig } = require('cypress')

module.exports = defineConfig({
	projectId: '3shm9d',
	component: {
		devServer: {
			framework: 'next',
			bundler: 'webpack'
		}
	},
	e2e: {
		baseUrl: 'http://localhost:3000',
		setupNodeEvents(on, config) {
			require('@cypress/code-coverage/task')(on, config)
			// include any other plugin code...

			// It's IMPORTANT to return the config object
			// with any changed environment variables
			return config
		}
	}
})
