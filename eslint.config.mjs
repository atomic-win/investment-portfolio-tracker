import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
	...nextVitals,
	...nextTs,
	{
		plugins: {
			'@stylistic': stylistic,
			import: importPlugin,
		},
		rules: {
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
			'@stylistic/semi': ['error', 'always'],
			'no-restricted-imports': [
				'error',
				{
					patterns: ['./*', '../*'],
				},
			],
			'import/order': [
				'error',
				{
					groups: [
						'builtin', // Node.js builtins like fs, path
						'external', // Packages from node_modules
						'internal', // Your alias paths (e.g. "@/utils")
						['parent', 'sibling', 'index'],
						'object',
						'type',
					],
					pathGroups: [
						{
							pattern: '@/**',
							group: 'internal',
							position: 'after',
						},
					],
					pathGroupsExcludedImportTypes: ['builtin'],
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
					'newlines-between': 'always',
				},
			],
		},
		settings: {
			'import/resolver': {
				typescript: {
					project: './tsconfig.json',
				},
			},
		},
	},
	globalIgnores([
		'node_modules',
		'dist',
		'build',
		'coverage',
		'public',
		'.next',
	]),
]);
