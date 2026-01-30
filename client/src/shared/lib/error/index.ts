import { AxiosError } from 'axios'

export const getErrorMessage = (error: unknown, customMessages?: Record<string, string>): string => {
	if (error instanceof AxiosError) {
		const data = error.response?.data as { message?: string; detail?: string; details?: string } | undefined
		const message = data?.message || data?.detail || data?.details

		if (message && customMessages?.[message]) {
			return customMessages[message]
		}

		if (message) {
			return message
		}

		if (error.response?.status === 401) {
			return 'Необходима авторизация'
		}

		if (error.response?.status === 403) {
			return 'Доступ запрещен'
		}

		if (error.response?.status === 404) {
			return 'Ресурс не найден'
		}

		if (error.response?.status === 500) {
			return 'Ошибка сервера'
		}

		return error.message || 'Произошла ошибка'
	}

	if (error instanceof Error) {
		return error.message
	}

	return 'Произошла неизвестная ошибка'
}
