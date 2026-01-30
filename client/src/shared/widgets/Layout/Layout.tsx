import { type FC, type ReactNode, useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { Group, Burger, Drawer, Stack, Divider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconHome, IconUser, IconCalendar, IconBook, IconLogout } from '@tabler/icons-react'

import { useLogout } from '@/shared/api/services/auth'
import { useOwnerProfile } from '@/shared/api/services/owner'
import { useUnreadBookingsCount } from '@/shared/api/services/bookings'
import { removeAuthData } from '@/shared/lib'
import { ROUTES } from '@/shared/model/routes'
import { Button } from '@/shared/kit'

import s from './Layout.module.scss'

interface LayoutProps {
	children: ReactNode
}

const hasContactMethodsConfigured = (profile: { contactMethods?: Record<string, { enabled?: boolean }> } | null | undefined): boolean => {
	if (!profile?.contactMethods) return false
	return Object.values(profile.contactMethods).some(m => m?.enabled)
}

export const Layout: FC<LayoutProps> = ({ children }) => {
	const navigate = useNavigate()
	const location = useLocation()
	const logoutMutation = useLogout()
	const { data: profile } = useOwnerProfile()
	const { data: unreadBookingsCount = 0 } = useUnreadBookingsCount()
	const needsContactSetup = profile && !hasContactMethodsConfigured(profile)
	const navRef = useRef<HTMLDivElement>(null)
	const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
	const [opened, { toggle, close }] = useDisclosure(false)

	const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({
		left: 0,
		width: 0
	})

	const updateIndicator = (element: HTMLAnchorElement | null) => {
		if (!element || !navRef.current) return

		const navRect = navRef.current.getBoundingClientRect()
		const linkRect = element.getBoundingClientRect()

		setIndicatorStyle({
			left: linkRect.left - navRect.left + 16, // 16px - это padding слева
			width: linkRect.width - 32 // 32px = 16px padding слева + 16px padding справа
		})
	}

	useEffect(() => {
		// Небольшая задержка для правильного расчета позиций после рендера
		const timer = setTimeout(() => {
			const activeLink = linkRefs.current.find((link) => {
				if (!link) return false
				return link.getAttribute('href') === location.pathname
			})

			if (activeLink) {
				updateIndicator(activeLink)
			}
		}, 0)

		return () => clearTimeout(timer)
	}, [location.pathname])

	// Закрываем мобильное меню при изменении маршрута
	useEffect(() => {
		close()
	}, [location.pathname, close])

	const handleLogout = async (): Promise<void> => {
		try {
			await logoutMutation.mutateAsync()
			removeAuthData()
			navigate(ROUTES.LOGIN)
		} catch {
			removeAuthData()
			navigate(ROUTES.LOGIN)
		}
	}

	const isActive = (path: string): boolean => {
		return location.pathname === path
	}

	const handleLinkHover = (index: number) => {
		updateIndicator(linkRefs.current[index])
	}

	const handleLinkLeave = () => {
		const activeLink = linkRefs.current.find((link) => {
			if (!link) return false
			return link.getAttribute('href') === location.pathname
		})
		if (activeLink) {
			updateIndicator(activeLink)
		}
	}

	const handleMobileLinkClick = () => {
		close()
	}

	const navLinks = [
		{ path: ROUTES.DASHBOARD, label: 'Главная', index: 0, icon: IconHome },
		{ path: ROUTES.PROFILE, label: 'Профиль', index: 1, icon: IconUser },
		{ path: ROUTES.SCHEDULE, label: 'Расписание', index: 2, icon: IconCalendar },
		{ path: ROUTES.BOOKINGS, label: 'Записи', index: 3, icon: IconBook }
	]

	return (
		<div className={s.layout}>
			<header className={s.header}>
				<Link to={ROUTES.DASHBOARD} className={s.logo}>
					<span className={s.logoText}>Slotly</span>
				</Link>
				<nav className={s.nav} ref={navRef}>
					<Group gap="xs" className={s.navGroup}>
						{navLinks.map(({ path, label, index }) => (
							<Link
								key={path}
								ref={(el) => (linkRefs.current[index] = el)}
								to={path}
								className={`${s.navLink} ${isActive(path) ? s.active : ''}`}
								onMouseEnter={() => handleLinkHover(index)}
								onMouseLeave={handleLinkLeave}
							>
								<span className={s.navLinkText}>{label}</span>
								{path === ROUTES.PROFILE && needsContactSetup && <span className={s.navLinkDot} title="Настройте способы связи" />}
								{path === ROUTES.BOOKINGS && unreadBookingsCount > 0 && (
									<span className={s.navLinkBadge}>{unreadBookingsCount > 99 ? '99+' : unreadBookingsCount}</span>
								)}
							</Link>
						))}
					</Group>
					{indicatorStyle.width > 0 && (
						<span
							className={s.indicator}
							style={{
								left: `${indicatorStyle.left}px`,
								width: `${indicatorStyle.width}px`
							}}
						/>
					)}
				</nav>
				<div className={s.headerActions}>
					<Button variant="secondary" size="sm" onClick={handleLogout} className={s.logoutButton}>
						Выйти
					</Button>
					<Burger opened={opened} onClick={toggle} className={s.burger} size="sm" />
				</div>
			</header>
			<Drawer
				opened={opened}
				onClose={close}
				title="Меню"
				position="right"
				size="320px"
				styles={{
					content: {
						backgroundColor: 'var(--bg-secondary)'
					},
					header: {
						backgroundColor: 'var(--bg-secondary)',
						borderBottom: '1px solid var(--border-color)',
						padding: '16px 16px'
					},
					title: {
						fontWeight: 700,
						fontSize: '20px',
						color: 'var(--text-primary)'
					},
					body: {
						padding: '16px'
					}
				}}
			>
				<Stack gap={8} className={s.mobileMenuContent}>
					{navLinks.map(({ path, label, icon: Icon }) => (
						<Link
							key={path}
							to={path}
							className={`${s.mobileNavLink} ${isActive(path) ? s.active : ''}`}
							onClick={handleMobileLinkClick}
						>
							<div className={s.mobileNavLinkContent}>
								<Icon className={s.mobileNavIcon} size={20} stroke={1.5} />
								<span className={s.mobileNavLinkText}>{label}</span>
								{path === ROUTES.PROFILE && needsContactSetup && <span className={s.mobileNavLinkDot} title="Настройте способы связи" />}
								{path === ROUTES.BOOKINGS && unreadBookingsCount > 0 && (
									<span className={s.mobileNavLinkBadge}>{unreadBookingsCount > 99 ? '99+' : unreadBookingsCount}</span>
								)}
							</div>
						</Link>
					))}
					<Divider my={12} color="var(--border-color)" />
					<Button
						variant="secondary"
						size="md"
						onClick={handleLogout}
						fullWidth
						className={s.mobileLogoutButton}
						leftSection={<IconLogout size={18} />}
					>
						Выйти
					</Button>
				</Stack>
			</Drawer>
			<main className={s.main}>{children}</main>
		</div>
	)
}
