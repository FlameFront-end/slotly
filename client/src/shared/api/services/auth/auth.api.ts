import { useMutation } from '@tanstack/react-query'

import axiosInstance from '@/shared/api/axiosInstance'

import { type LoginPayload, type LoginResponse, type RegisterPayload, type RegisterResponse, type RefreshTokenResponse } from './types'

export const authApi = {
	register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
		const response = await axiosInstance.post<RegisterResponse>('/auth/register', payload)
		return response.data
	},

	login: async (payload: LoginPayload): Promise<LoginResponse> => {
		const response = await axiosInstance.post<LoginResponse>('/auth/login', payload)
		return response.data
	},

	logout: async (): Promise<void> => {
		await axiosInstance.post('/auth/logout')
	},

	refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
		const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh-token', {
			refresh_token: refreshToken
		})
		return response.data
	}
}

export const useRegister = () => {
	return useMutation({
		mutationFn: (payload: RegisterPayload) => authApi.register(payload)
	})
}

export const useLogin = () => {
	return useMutation({
		mutationFn: (payload: LoginPayload) => authApi.login(payload)
	})
}

export const useLogout = () => {
	return useMutation({
		mutationFn: () => authApi.logout()
	})
}

export const useRefreshToken = () => {
	return useMutation({
		mutationFn: (refreshToken: string) => authApi.refreshToken(refreshToken)
	})
}
