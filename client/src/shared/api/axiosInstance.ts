import axios, { AxiosError, AxiosHeaders, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

import { getAuthData, removeAuthData, updateAccessToken } from '@/shared/lib'
import { env } from '@/shared/model/config'

const TOKEN_REFRESH_MARGIN_MS = 60 * 1000
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh-token']

const isDev = import.meta.env.MODE === 'development'
const logInfo = (message: string): void => {
	if (isDev) {
		// eslint-disable-next-line no-console
		console.info(message)
	}
}
const logWarn = (message: string, data?: unknown): void => {
	if (isDev) {
		console.warn(message, data)
	}
}
const logError = (message: string, error: unknown): void => {
	if (isDev) {
		console.error(message, error)
	}
}

const getAccessTokenExpiryMs = (token: string): number | null => {
	const parts = token.split('.')
	if (parts.length !== 3) return null
	try {
		const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
		const padding = base64.length % 4
		const padded = padding ? `${base64}${'='.repeat(4 - padding)}` : base64
		const payload = JSON.parse(atob(padded))
		return typeof payload.exp === 'number' ? payload.exp * 1000 : null
	} catch {
		return null
	}
}

const isAccessTokenExpiringSoon = (token: string): boolean => {
	const expiresAtMs = getAccessTokenExpiryMs(token)
	if (!expiresAtMs) return false
	return expiresAtMs - Date.now() <= TOKEN_REFRESH_MARGIN_MS
}

const isAuthEndpoint = (url?: string): boolean => {
	if (!url) return false
	return AUTH_ENDPOINTS.some(endpoint => url.includes(endpoint))
}

const shouldLogoutForError = (error: AxiosError): boolean => {
	const data = error.response?.data as { details?: string; detail?: string; message?: string } | undefined
	const details = data?.details || data?.detail || data?.message
	return error.response?.status === 401 && details === 'TOKEN_EXPIRED'
}

const logoutAndRedirect = (): void => {
	removeAuthData()
	const currentPath = window.location.pathname
	const isPublicRoute = currentPath.startsWith('/auth/') || currentPath.startsWith('/public/')
	if (!isPublicRoute) {
		window.location.replace('/auth/login')
	}
}

let refreshPromise: Promise<string | null> | null = null

const refreshAccessToken = async (): Promise<string | null> => {
	if (refreshPromise) {
		return refreshPromise
	}

	refreshPromise = (async () => {
		const authData = getAuthData()
		if (!authData?.refreshToken) {
			logInfo('[auth] refresh skipped: no refresh token')
			return null
		}
		try {
			logInfo('[auth] refresh started')
			const { authApi } = await import('@/shared/api/services/auth/auth.api')
			const response = await authApi.refreshToken(authData.refreshToken)
			const newAccessToken = response.access_token
			updateAccessToken(newAccessToken)
			logInfo('[auth] refresh succeeded')
			return newAccessToken
		} catch (error) {
			const axiosError = error as AxiosError
			logWarn('[auth] refresh failed', {
				status: axiosError.response?.status,
				details: (axiosError.response?.data as { details?: string; detail?: string; message?: string } | undefined)
					?.details
			})
			if (shouldLogoutForError(axiosError)) {
				logoutAndRedirect()
			}
			return null
		} finally {
			refreshPromise = null
		}
	})()

	return refreshPromise
}

const setupRequestInterceptor = (instance: AxiosInstance) => {
	instance.interceptors.request.use(
		async (config: InternalAxiosRequestConfig) => {
			try {
				const authData = getAuthData()
				let token = authData?.accessToken

				if (token && !isAuthEndpoint(config.url) && isAccessTokenExpiringSoon(token)) {
					logInfo('[auth] access token expiring soon, refreshing')
					const refreshedToken = await refreshAccessToken()
					if (refreshedToken) {
						token = refreshedToken
					}
				}

				if (token) {
					config.headers.Authorization = `Bearer ${token}`
				}

				if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
					config.headers['Content-Type'] = 'application/json'
				}

				return config
			} catch (error) {
				logError('Request interceptor error:', error)
				return config
			}
		},
		error => Promise.reject(error)
	)
}

const setupResponseInterceptor = (instance: AxiosInstance) => {
	instance.interceptors.response.use(
		response => response,
		async (error: AxiosError) => {
			if (error.response?.status === 401 && !isAuthEndpoint(error.config?.url)) {
				const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
				if (shouldLogoutForError(error) && originalRequest && !originalRequest._retry) {
					logInfo('[auth] 401 TOKEN_EXPIRED received, retrying with refresh')
					originalRequest._retry = true
					const refreshedToken = await refreshAccessToken()
					if (refreshedToken) {
						const updatedHeaders = AxiosHeaders.from(originalRequest.headers)
						updatedHeaders.set('Authorization', `Bearer ${refreshedToken}`)
						originalRequest.headers = updatedHeaders
						return instance(originalRequest)
					}
				}

				logWarn('[auth] 401 received, logging out')
				logoutAndRedirect()
			}

			return Promise.reject(error)
		}
	)
}

const createAxiosInstance = (baseURL: string): AxiosInstance => {
	const instance = axios.create({
		baseURL,
		headers: {
			Accept: 'application/json'
		}
	})

	setupRequestInterceptor(instance)
	setupResponseInterceptor(instance)

	return instance
}

const axiosInstance = createAxiosInstance(env.API_URL)

export default axiosInstance
