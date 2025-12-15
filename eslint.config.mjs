import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default defineConfig([
	...compat.extends('next/core-web-vitals', 'next/typescript'),
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
