export const ROUTES = {
	LOGIN: '/auth/login',
	REGISTER: '/auth/register',

	DASHBOARD: '/dashboard',
	PROFILE: '/profile',
	SCHEDULE: '/schedule',
	BOOKINGS: '/bookings',
	SERVICES: '/services',

	PUBLIC_BOOKING: '/public/booking/:ownerId',
	PUBLIC_BOOKING_CONFIRMATION: '/public/booking-confirmation/:bookingId'
} as const

export const buildRoute = (route: string, params: Record<string, string>): string => {
	let result = route
	Object.entries(params).forEach(([key, value]) => {
		result = result.replace(`:${key}`, value)
	})
	return result
}
