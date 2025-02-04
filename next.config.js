const { withSentryConfig } = require('@sentry/nextjs')

const moduleExports = {
	reactStrictMode: true,
	images: {
		domains: ['cdn.sanity.io', 'lh3.googleusercontent.com', 'images.unsplash.com', 'localhost', 'via.placeholder.com', 'i.vimeocdn.com', 'ncrma.net']
	},
	env: { VERSION: process.env.npm_package_version },
	sentry: {
		// Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
		// for client-side builds. (This will be the default starting in
		// `@sentry/nextjs` version 8.0.0.) See
		// https://webpack.js.org/configuration/devtool/ and
		// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
		// for more information.
		hideSourceMaps: true
	}
}

const sentryWebpackPluginOptions = {
	// Additional config options for the Sentry Webpack plugin. Keep in mind that
	// the following options are set automatically, and overriding them is not
	// recommended:
	//   release, url, org, project, authToken, configFile, stripPrefix,
	//   urlPrefix, include, ignore

	silent: true // Suppresses all logs
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options.
}

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions)
