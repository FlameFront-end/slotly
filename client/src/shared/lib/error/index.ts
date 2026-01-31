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
			return 'Доступ запрещён'
		}

		if (error.response?.status === 404) {
			return 'Ресурс не найден'
		}

		if (error.response?.status === 500) {
			return 'Ошибка сервера. Попробуйте позже.'
		}

		if (error.code === 'ERR_NETWORK' || error.message?.toLowerCase().includes('network')) {
			return 'Проверьте подключение к интернету'
		}

		return error.message || 'Что-то пошло не так. Попробуйте ещё раз.'
	}

	if (error instanceof Error) {
		const msg = error.message?.toLowerCase()
		if (msg?.includes('network') || msg === 'failed to fetch') {
			return 'Проверьте подключение к интернету'
		}
		return error.message || 'Что-то пошло не так. Попробуйте ещё раз.'
	}

	return 'Что-то пошло не так. Попробуйте ещё раз.'
}
