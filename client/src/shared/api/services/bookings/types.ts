export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

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
