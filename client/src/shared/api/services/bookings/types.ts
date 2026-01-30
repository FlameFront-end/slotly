export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'rejected' | 'completed'

export interface Booking {
  id: string
  clientName: string
  clientContact: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  status: BookingStatus
  readAt: string | null
  createdAt: string
}

export interface CreateBookingPayload {
  clientName: string
  clientContact: string
  date: string
  time: string
  ownerId?: string
}

export interface UpdateBookingStatusPayload {
  status: BookingStatus
}

export interface PublicBookingResponse {
  id: string
  date: string
  time: string
  status: BookingStatus
  clientName: string
  clientContact: string
  owner: {
    publicId: string
    name: string
    description: string | null
    address: string | null
    mapLink: string | null
    website: string | null
  }
}
