/**
 * Конфигурация окружения приложения
 */

const isDev = import.meta.env.MODE === 'development'
const isDevelopMode = import.meta.env.VITE_IS_DEVELOP === 'true'
const isDevelopment = isDev || isDevelopMode

const validateEnv = (): void => {
	if (isDev) {
		return
	}

	const requiredVars = ['VITE_API_URL'] as const
	const missing = requiredVars.filter(key => !import.meta.env[key])

	if (missing.length > 0) {
		console.error(`Missing required environment variables: ${missing.join(', ')}`)
		console.error('Please set VITE_API_URL in your Vercel environment variables')
		throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
	}
}

validateEnv()

export const env = {
	IS_DEVELOP: isDevelopment,

	API_URL: isDevelopment
		? '/api' // В development используется proxy из vite.config.ts
		: (import.meta.env.VITE_API_URL as string)
} as const
