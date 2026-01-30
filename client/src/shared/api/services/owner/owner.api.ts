import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import axiosInstance from '@/shared/api/axiosInstance'

import { type OwnerProfile, type UpdateOwnerProfilePayload } from './types'

export const ownerApi = {
	getProfile: async (): Promise<OwnerProfile> => {
		const response = await axiosInstance.get<OwnerProfile>('/owner/profile')
		return response.data
	},

	getProfileByPublicId: async (publicId: string): Promise<OwnerProfile> => {
		const response = await axiosInstance.get<OwnerProfile>(`/public/owner/${publicId}`)
		return response.data
	},

	updateProfile: async (payload: UpdateOwnerProfilePayload): Promise<OwnerProfile> => {
		const response = await axiosInstance.put<OwnerProfile>('/owner/profile', payload)
		return response.data
	}
}

export const useOwnerProfile = () => {
	return useQuery({
		queryKey: ['owner', 'profile'],
		queryFn: () => ownerApi.getProfile()
	})
}

export const useOwnerProfileByPublicId = (publicId: string) => {
	return useQuery({
		queryKey: ['owner', 'profile', 'public', publicId],
		queryFn: () => ownerApi.getProfileByPublicId(publicId),
		enabled: !!publicId
	})
}

export const useUpdateOwnerProfile = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: UpdateOwnerProfilePayload) => ownerApi.updateProfile(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['owner', 'profile'] })
		}
	})
}
