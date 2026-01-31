import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { ROUTES } from '@/shared/model/routes'

const BASE_TITLE = 'Slotly'

const TITLE_MAP: Record<string, string> = {
	[ROUTES.LOGIN]: 'Вход',
	[ROUTES.REGISTER]: 'Регистрация',
	[ROUTES.DASHBOARD]: 'Панель управления',
	[ROUTES.PROFILE]: 'Профиль',
	[ROUTES.SCHEDULE]: 'Расписание',
	[ROUTES.BOOKINGS]: 'Записи'
}

const getPageTitle = (pathname: string): string => {
	if (pathname.startsWith('/public/booking/')) {
		return 'Запись на приём'
	}

	const exactMatch = TITLE_MAP[pathname]
	if (exactMatch) {
		return exactMatch
	}

	for (const [route, title] of Object.entries(TITLE_MAP)) {
		if (pathname.startsWith(route)) {
			return title
		}
	}

	return ''
}

export const usePageTitle = (): void => {
	const location = useLocation()

	useEffect(() => {
		const pageTitle = getPageTitle(location.pathname)
		document.title = pageTitle ? `${BASE_TITLE} | ${pageTitle}` : BASE_TITLE
	}, [location.pathname])
}
