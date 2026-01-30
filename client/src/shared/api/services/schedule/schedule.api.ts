import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import axiosInstance from '@/shared/api/axiosInstance'

import { type AvailableSlot, type Schedule, type UpdateSchedulePayload } from './types'

export const scheduleApi = {
	getSchedule: async (): Promise<Schedule> => {
		const response = await axiosInstance.get<Schedule>('/schedule')
		return response.data
	},

	updateSchedule: async (payload: UpdateSchedulePayload): Promise<Schedule> => {
		const response = await axiosInstance.put<Schedule>('/schedule', payload)
		return response.data
	},

	getAvailableSlots: async (ownerId: string, startDate: string, endDate?: string): Promise<AvailableSlot[]> => {
		const params: Record<string, string> = { start_date: startDate }
		if (endDate) {
			params.end_date = endDate
		}
		const response = await axiosInstance.get<AvailableSlot[]>(
			`/public/schedule/${ownerId}/slots`,
			{
				params
			}
		)
		return response.data
	}
}

export const useSchedule = () => {
	return useQuery({
		queryKey: ['schedule'],
		queryFn: () => scheduleApi.getSchedule()
	})
}

export const useUpdateSchedule = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: UpdateSchedulePayload) => scheduleApi.updateSchedule(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['schedule'] })
		}
	})
}

export const useAvailableSlots = (ownerId: string, startDate: string, endDate?: string) => {
	return useQuery({
		queryKey: ['schedule', 'slots', ownerId, startDate, endDate ?? 'default'],
		queryFn: () => scheduleApi.getAvailableSlots(ownerId, startDate, endDate),
		enabled: !!ownerId && !!startDate
	})
}
