module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parserOptions: {
		parser: '@typescript-eslint/parser'
	},
	extends: ['prettier', 'plugin:prettier/recommended'],
	plugins: ['@typescript-eslint', 'prettier'],
	// add your custom rules here
	rules: {
		'@typescript-eslint/no-unused-vars': 'error'
	}
}
