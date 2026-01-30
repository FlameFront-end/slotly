import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import axiosInstance from '@/shared/api/axiosInstance'

import { type Booking, type CreateBookingPayload, type UpdateBookingStatusPayload } from './types'

export const bookingsApi = {
  getBookings: async (): Promise<Booking[]> => {
    const response = await axiosInstance.get<Booking[]>('/bookings')
    return response.data
  },

  getBooking: async (id: string): Promise<Booking> => {
    const response = await axiosInstance.get<Booking>(`/bookings/${id}`)
    return response.data
  },

  createBooking: async (payload: CreateBookingPayload): Promise<Booking> => {
    const response = await axiosInstance.post<Booking>('/bookings', payload)
    return response.data
  },

  updateBookingStatus: async (id: string, payload: UpdateBookingStatusPayload): Promise<Booking> => {
    const response = await axiosInstance.patch<Booking>(`/bookings/${id}/status`, payload)
    return response.data
  },

  cancelBooking: async (id: string): Promise<Booking> => {
    const response = await axiosInstance.post<Booking>(`/bookings/${id}/cancel`)
    return response.data
  }
}

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingsApi.getBookings()
  })
}

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => bookingsApi.getBooking(id),
    enabled: !!id
  })
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingsApi.createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['schedule', 'slots'] })
    }
  })
}

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & UpdateBookingStatusPayload) =>
      bookingsApi.updateBookingStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    }
  })
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => bookingsApi.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['schedule', 'slots'] })
    }
  })
}
