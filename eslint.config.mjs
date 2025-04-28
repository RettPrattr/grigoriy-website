/* eslint-disable import/no-anonymous-default-export */
import {
    fixupConfigRules,
    fixupPluginRules
} from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
})

export default [
	{
		ignores: ['!src/**/*']
	},
	...fixupConfigRules(
		compat.extends(
			'next/core-web-vitals',
			'plugin:react/recommended',
			'plugin:react-hooks/recommended',
			'plugin:prettier/recommended'
		)
	),
	{
		plugins: {
			react: fixupPluginRules(react),
			'react-hooks': fixupPluginRules(reactHooks),
			prettier: fixupPluginRules(prettier)
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},

			ecmaVersion: 'latest',
			sourceType: 'module',

			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			}
		},

		settings: {
			react: {
				version: '19'
			}
		},

		rules: {
			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-react': 'off',
			'react/prop-types': 'off',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'react/self-closing-comp': [
				'error',
				{
					component: true,
					html: true
				}
			],
			'prettier/prettier': 'warn'
		}
	},
	{
		files: ['src/**/*.{js,jsx,ts,tsx}'],
		ignores: ['**/*.config.js']
	}
]
