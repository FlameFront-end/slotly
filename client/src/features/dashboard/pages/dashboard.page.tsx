import { type FC, useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Card, Group, Text, Stack, Modal, Button as MantineButton } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'

import { useBookings } from '@/shared/api/services/bookings'
import { useOwnerProfile } from '@/shared/api/services/owner'
import { ROUTES } from '@/shared/model/routes'
import { CopyButton } from '@/shared/kit'
import { useOnboardingTour } from '@/shared/hooks/useOnboardingTour'
import { Layout, Loader } from '@/shared/widgets'

import s from './Dashboard.module.scss'

const Dashboard: FC = () => {
	const { data: bookings, isLoading } = useBookings()
	const { data: profile } = useOwnerProfile()

	const [showTrialModal, setShowTrialModal] = useState(false)

	const tourSteps = useMemo(() => {
		if (!profile?.publicId) return []

		return [
			{
				element: '[data-tour="public-link"]',
				popover: {
					title: 'Публичная ссылка',
					description: 'Это ваша уникальная ссылка для записи. Поделитесь ею с клиентами, чтобы они могли записаться на прием. Вы можете скопировать её, кликнув на поле или кнопку.',
					side: 'bottom' as const,
					align: 'start' as const
				}
			},
			{
				element: '[data-tour="stats"]',
				popover: {
					title: 'Статистика записей',
					description: 'Здесь отображается общая статистика по вашим записям: всего записей, записи на сегодня, предстоящие и ожидающие подтверждения.',
					side: 'bottom' as const,
					align: 'start' as const
				}
			},
			{
				element: '[data-tour="profile-card"]',
				popover: {
					title: 'Профиль',
					description: 'Настройте информацию о себе и вашей услуге. Укажите контакты, описание, часовой пояс и другие детали.',
					side: 'top' as const,
					align: 'start' as const
				}
			},
			{
				element: '[data-tour="schedule-card"]',
				popover: {
					title: 'Расписание',
					description: 'Настройте рабочие дни и время. Укажите, в какие дни и часы вы доступны для записи клиентов.',
					side: 'top' as const,
					align: 'start' as const
				}
			},
			{
				element: '[data-tour="bookings-card"]',
				popover: {
					title: 'Записи',
					description: 'Просматривайте и управляйте всеми записями клиентов. Подтверждайте, отменяйте или отмечайте записи как завершенные.',
					side: 'top' as const,
					align: 'start' as const
				}
			}
		]
	}, [profile?.publicId])

	const { startTour } = useOnboardingTour(tourSteps)

	useEffect(() => {
		// Проверяем, нужно ли показать модалку о пробном периоде
		const shouldShowModal = sessionStorage.getItem('showTrialModal') === 'true'
		if (shouldShowModal) {
			setShowTrialModal(true)
			sessionStorage.removeItem('showTrialModal')
		}
	}, [])

	const publicLink = profile?.publicId
		? `${window.location.origin}/public/booking/${profile.publicId}`
		: ''

	const handleCopyLink = async (): Promise<void> => {
		if (!publicLink) return

		try {
			await navigator.clipboard.writeText(publicLink)
			notifications.show({
				title: 'Скопировано',
				message: 'Ссылка скопирована в буфер обмена',
				color: 'green',
				autoClose: 2000
			})
		} catch {
			// Fallback для старых браузеров
			const textArea = document.createElement('textarea')
			textArea.value = publicLink
			document.body.appendChild(textArea)
			textArea.select()
			document.execCommand('copy')
			document.body.removeChild(textArea)
			notifications.show({
				title: 'Скопировано',
				message: 'Ссылка скопирована в буфер обмена',
				color: 'green',
				autoClose: 2000
			})
		}
	}

	const stats = useMemo(() => {
		if (!bookings) return null

		const today = new Date().toISOString().split('T')[0]
		const todayBookings = bookings.filter(b => b.date === today && b.status !== 'cancelled')
		const upcomingBookings = bookings.filter(
			b => b.date >= today && b.status !== 'cancelled' && b.status !== 'completed'
		)
		const pendingBookings = bookings.filter(b => b.status === 'pending')

		return {
			total: bookings.length,
			today: todayBookings.length,
			upcoming: upcomingBookings.length,
			pending: pendingBookings.length
		}
	}, [bookings])

	return (
		<Layout>
			<div className={s.dashboard}>
				<h1 className={s.title}>Панель управления</h1>

				{isLoading ? (
					<Loader message="Загрузка статистики..." />
				) : (
					<>
						{profile?.publicId && (
							<Card padding="lg" radius="md" withBorder className={s.publicLinkCard} data-tour="public-link">
								<Stack gap="md">
									<div>
										<Text size="sm" c="dimmed" tt="uppercase" fw={700} mb={4}>
											Публичная ссылка для записи
										</Text>
										<Text size="xs" c="dimmed" mb="md">
											Поделитесь этой ссылкой с клиентами для записи на прием
										</Text>
									</div>
									<Group gap="sm" align="stretch">
										<div
											className={s.publicLink}
											onClick={handleCopyLink}
											onKeyDown={e => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault()
													handleCopyLink()
												}
											}}
											role="button"
											tabIndex={0}
											aria-label="Нажмите для копирования ссылки"
										>
											{publicLink}
										</div>
										<CopyButton
											value={publicLink}
											label="Копировать"
											size="md"
											variant="filled"
										/>
									</Group>
								</Stack>
							</Card>
						)}

						{stats && (
							<div className={s.stats} data-tour="stats">
								<Link to={ROUTES.BOOKINGS} className={s.statCardLink}>
									<Card padding="md" radius="md" withBorder className={s.statCard}>
										<Stack gap="xs">
											<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
												Всего записей
											</Text>
											<Text size="xl" fw={700}>
												{stats.total}
											</Text>
										</Stack>
									</Card>
								</Link>

								<Link to={`${ROUTES.BOOKINGS}?date=today`} className={s.statCardLink}>
									<Card padding="md" radius="md" withBorder className={s.statCard}>
										<Stack gap="xs">
											<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
												Сегодня
											</Text>
											<Text size="xl" fw={700}>
												{stats.today}
											</Text>
										</Stack>
									</Card>
								</Link>

								<Link to={`${ROUTES.BOOKINGS}?date=upcoming`} className={s.statCardLink}>
									<Card padding="md" radius="md" withBorder className={s.statCard}>
										<Stack gap="xs">
											<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
												Предстоящие
											</Text>
											<Text size="xl" fw={700}>
												{stats.upcoming}
											</Text>
										</Stack>
									</Card>
								</Link>

								<Link to={`${ROUTES.BOOKINGS}?status=pending`} className={s.statCardLink}>
									<Card padding="md" radius="md" withBorder className={s.statCard}>
										<Stack gap="xs">
											<Text size="xs" c="dimmed" tt="uppercase" fw={700}>
												Ожидают подтверждения
											</Text>
											<Text size="xl" fw={700}>
												{stats.pending}
											</Text>
										</Stack>
									</Card>
								</Link>
							</div>
						)}

						<div className={s.grid}>
							<Link to={ROUTES.PROFILE} className={s.card} data-tour="profile-card">
								<h2>Профиль</h2>
								<p>Настройте информацию о себе и услуге</p>
							</Link>

							<Link to={ROUTES.SCHEDULE} className={s.card} data-tour="schedule-card">
								<h2>Расписание</h2>
								<p>Настройте рабочие дни и время</p>
							</Link>

							<Link to={ROUTES.BOOKINGS} className={s.card} data-tour="bookings-card">
								<h2>Записи</h2>
								<p>Просмотр и управление записями</p>
							</Link>
						</div>
					</>
				)}

				<Modal
					opened={showTrialModal}
					onClose={() => setShowTrialModal(false)}
					centered
					closeOnClickOutside={false}
					closeOnEscape={false}
					withCloseButton={false}
					className={s.trialModal}
					size="md"
				>
					<div className={s.trialModalContent}>
						<div className={s.trialIcon}>
							<IconCheck size={32} stroke={3} />
						</div>
						<div className={s.trialText}>
							<h2 className={s.trialTitle}>Добро пожаловать в Slotly!</h2>
							<p className={s.trialMessage}>
								Пробный период на <strong>7 дней</strong> активирован
							</p>
							<p className={s.trialDescription}>
								Вы получили полный доступ ко всем функциям платформы. Начните настраивать свой профиль и расписание.
							</p>
						</div>
						<div className={s.trialButtons}>
							<MantineButton
								fullWidth
								size="lg"
								onClick={() => {
									setShowTrialModal(false)
									// Небольшая задержка для плавного перехода
									setTimeout(() => {
										if (tourSteps.length > 0) {
											startTour()
										}
									}, 300)
								}}
								className={s.trialButton}
							>
								Показать инструкцию
							</MantineButton>
							<MantineButton
								fullWidth
								variant="subtle"
								size="md"
								onClick={() => setShowTrialModal(false)}
								className={s.trialSkipButton}
							>
								Пропустить
							</MantineButton>
						</div>
					</div>
				</Modal>
			</div>
		</Layout>
	)
}

export const Component = Dashboard
