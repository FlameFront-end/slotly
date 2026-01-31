export interface Service {
  id: string
  name: string
  description: string | null
  duration: number // длительность в минутах
  price: number | null
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateServicePayload {
  name: string
  description?: string
  duration: number
  price?: number
  isActive?: boolean
  order?: number
}

export interface UpdateServicePayload {
  name?: string
  description?: string
  duration?: number
  price?: number
  isActive?: boolean
  order?: number
}
