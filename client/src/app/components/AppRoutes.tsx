import { memo } from 'react'

import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { usePageTitle } from '@/shared/hooks'
import { isAuthenticated } from '@/shared/lib'
import { ROUTES } from '@/shared/model/routes'

export const AppRoutes = memo(() => {
	const location = useLocation()

	const authenticated = isAuthenticated()

	usePageTitle()

	if (!authenticated && !location.pathname.startsWith('/auth/') && !location.pathname.startsWith('/public/')) {
		return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
	}

	if (authenticated && location.pathname.startsWith('/auth/')) {
		return <Navigate to={ROUTES.DASHBOARD} replace />
	}

	return <Outlet />
})
