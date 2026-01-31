import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import axiosInstance from '@/shared/api/axiosInstance'

import { type Service, type CreateServicePayload, type UpdateServicePayload } from './types'

export const servicesApi = {
  getServices: async (includeInactive = false): Promise<Service[]> => {
    const params: Record<string, string> = {}
    if (includeInactive) {
      params.include_inactive = 'true'
    }
    const response = await axiosInstance.get<Service[]>('/services', { params })
    return response.data
  },

  getService: async (id: string): Promise<Service> => {
    const response = await axiosInstance.get<Service>(`/services/${id}`)
    return response.data
  },

  getPublicServices: async (ownerId: string): Promise<Service[]> => {
    const response = await axiosInstance.get<Service[]>(`/public/owner/${ownerId}/services`)
    return response.data
  },

  createService: async (payload: CreateServicePayload): Promise<Service> => {
    const response = await axiosInstance.post<Service>('/services', payload)
    return response.data
  },

  updateService: async (id: string, payload: UpdateServicePayload): Promise<Service> => {
    const response = await axiosInstance.patch<Service>(`/services/${id}`, payload)
    return response.data
  },

  deleteService: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/services/${id}`)
  }
}

export const useServices = (includeInactive = false) => {
  return useQuery({
    queryKey: ['services', includeInactive ? 'all' : 'active'],
    queryFn: () => servicesApi.getServices(includeInactive)
  })
}

export const useService = (id: string) => {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => servicesApi.getService(id),
    enabled: !!id
  })
}

export const usePublicServices = (ownerId: string) => {
  return useQuery({
    queryKey: ['public', 'services', ownerId],
    queryFn: () => servicesApi.getPublicServices(ownerId),
    enabled: !!ownerId
  })
}

export const useCreateService = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateServicePayload) => servicesApi.createService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    }
  })
}

export const useUpdateService = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & UpdateServicePayload) =>
      servicesApi.updateService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    }
  })
}

export const useDeleteService = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => servicesApi.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    }
  })
}
