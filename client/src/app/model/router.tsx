import { createBrowserRouter, Navigate } from 'react-router-dom'

import { ROUTES } from '@/shared/model/routes'

import ErrorPage from '../../features/error/pages/error.page'
import { AppRoutes } from '../components/AppRoutes'

export const router = createBrowserRouter([
	{
		errorElement: <ErrorPage />,
		element: <AppRoutes />,
		children: [
			{
				path: '/',
				element: <Navigate to={ROUTES.DASHBOARD} replace />
			},
			{
				path: ROUTES.LOGIN,
				lazy: () => import('../../features/auth/pages/auth.page')
			},
			{
				path: ROUTES.REGISTER,
				lazy: () => import('../../features/auth/pages/auth.page')
			},
			{
				path: ROUTES.DASHBOARD,
				lazy: () => import('../../features/dashboard/pages/dashboard.page')
			},
			{
				path: ROUTES.PROFILE,
				lazy: () => import('../../features/profile/pages/profile.page')
			},
			{
				path: ROUTES.SCHEDULE,
				lazy: () => import('../../features/schedule/pages/schedule.page')
			},
			{
				path: ROUTES.BOOKINGS,
				lazy: () => import('../../features/bookings/pages/bookings.page')
			},
			{
				path: ROUTES.PUBLIC_BOOKING,
				lazy: () => import('../../features/public-booking/pages/public-booking.page')
			},
			{
				path: ROUTES.PUBLIC_BOOKING_CONFIRMATION,
				lazy: () => import('../../features/public-booking/pages/booking-confirmation.page')
			}
		]
	}
])
