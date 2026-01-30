export interface AuthData {
	accessToken: string
	refreshToken: string
}

const AUTH_STORAGE_KEY = 'auth_data'

export const getAuthData = (): AuthData | null => {
	try {
		const data = localStorage.getItem(AUTH_STORAGE_KEY)
		return data ? JSON.parse(data) : null
	} catch {
		return null
	}
}

export const setAuthData = (data: AuthData): void => {
	localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
}

export const removeAuthData = (): void => {
	localStorage.removeItem(AUTH_STORAGE_KEY)
}

export const updateAccessToken = (accessToken: string): void => {
	const authData = getAuthData()
	if (authData) {
		setAuthData({ ...authData, accessToken })
	}
}

export const isAuthenticated = (): boolean => {
	return !!getAuthData()?.accessToken
}
