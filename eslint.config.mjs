import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';

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
		},
		rules: {
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
			'@stylistic/semi': ['error', 'always'],
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
