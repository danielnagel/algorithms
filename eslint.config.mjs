import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';

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
	...eslintPluginAstro.configs.recommended,
	{
		rules: {
			'indent': ['error', 'tab'],
			'object-curly-newline': ['error', {
				'ImportDeclaration': 'always',
				'ExportDeclaration': 'always',
				'ObjectExpression': 'always',
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