// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

if (process.env.NODE_ENV === 'production') {
	Sentry.init({
		dsn: SENTRY_DSN || 'https://ade5e333b8ed4c75b27bb7f6788e80be@o1189320.ingest.sentry.io/6309666',
		// Adjust this value in production, or use tracesSampler for greater control
		tracesSampleRate: 1.0,
		release: `ncrma-lms-api@${process.env.VERSION}`
		// ...
		// Note: if you want to override the automatic release value, do not set a
		// `release` value here - use the environment variable `SENTRY_RELEASE`, so
		// that it will also get attached to your source maps
	})
}
