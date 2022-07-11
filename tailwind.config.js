const colors = require('tailwindcss/colors')

module.exports = {
	purge: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
	],
	plugins: [require('flowbite/plugin')],
	mode: 'jit',
	darkMode: 'media', // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				ncrma: {
					DEFAULT: '#5FBBBE',
					50: '#E2F2F3',
					100: '#D3ECED',
					200: '#B6E0E1',
					300: '#99D4D6',
					400: '#7CC7CA',
					500: '#5FBBBE',
					600: '#42A0A3',
					700: '#32797B',
					800: '#225153',
					900: '#122A2B'
				},
				green: colors.emerald,
				yellow: colors.amber,
				purple: colors.violet,
				gray: colors.neutral
			}
		}
	}
}
