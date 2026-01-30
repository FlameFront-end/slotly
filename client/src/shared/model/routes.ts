export const ROUTES = {
	LOGIN: '/auth/login',
	REGISTER: '/auth/register',

	DASHBOARD: '/dashboard',
	PROFILE: '/profile',
	SCHEDULE: '/schedule',
	BOOKINGS: '/bookings',

	PUBLIC_BOOKING: '/public/booking/:ownerId'
} as const

export const buildRoute = (route: string, params: Record<string, string>): string => {
	let result = route
	Object.entries(params).forEach(([key, value]) => {
		result = result.replace(`:${key}`, value)
	})
	return result
}
