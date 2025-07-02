import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
	{
		files: ['**/*.{js,mjs,cjs,ts,astro}'],
	},
	{
		languageOptions: {
			globals: globals.browser 
		}
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			'indent': ['error', 'tab'],
			'object-curly-newline': ['error', {
				'ImportDeclaration': 'always',
				'ExportDeclaration': 'always',
				'ObjectPattern': 'never' 
			}],
			'object-property-newline': 'error',
			'semi': ['error', 'always'],
			'space-before-function-paren': ['error', 'never'],
			'quotes': ['error', 'single'],
			'keyword-spacing': 'error',
			'no-case-declarations': 'off'
		}
	},
];