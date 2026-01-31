import { type FC, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { notifications } from '@mantine/notifications'
import { Select, Badge, Group, Text, Button as MantineButton, SegmentedControl } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconCalendar, IconClock, IconUser, IconMail, IconPhone, IconCheck, IconX, IconClockHour4, IconX as IconClose } from '@tabler/icons-react'

import { useBookings, useUpdateBookingStatus, useMarkBookingsRead } from '@/shared/api/services/bookings'
import { BookingsSkeleton, EmptyState, Skeleton } from '@/shared/kit'
import { getErrorMessage } from '@/shared/lib'
import { type BookingStatus } from '@/shared/api/services/bookings/types'
import { Layout } from '@/shared/widgets'

import s from './Bookings.module.scss'

const STATUS_LABELS: Record<BookingStatus, string> = {
	pending: 'Ожидает',
	confirmed: 'Подтверждена',
	cancelled: 'Отменена',
	rejected: 'Отклонена',
	completed: 'Завершена'
}

const STATUS_COLORS: Record<BookingStatus, string> = {
	pending: 'yellow',
	confirmed: 'blue',
	cancelled: 'red',
	rejected: 'red',
	completed: 'green'
}

const STATUS_ICONS: Record<BookingStatus, typeof IconClock> = {
	pending: IconClockHour4,
	confirmed: IconCheck,
	cancelled: IconX,
	rejected: IconX,
	completed: IconCheck
}

// Владелец может только подтвердить, отклонить или завершить. Отмена — только со стороны клиента.
const STATUS_OPTIONS: Array<{ value: BookingStatus; label: string }> = [
	{ value: 'pending', label: 'Ожидает' },
	{ value: 'confirmed', label: 'Подтверждена' },
	{ value: 'rejected', label: 'Отклонена' },
	{ value: 'completed', label: 'Завершена' }
]

const Bookings: FC = () => {
	const { data: bookings, isLoading } = useBookings()
	const updateStatusMutation = useUpdateBookingStatus()
	const markReadMutation = useMarkBookingsRead()
	const [searchParams, setSearchParams] = useSearchParams()
	const isMobile = useMediaQuery('(max-width: 768px)')

	useEffect(() => {
		markReadMutation.mutate()
	}, [])

	// Получаем фильтры из URL
	const dateFilter = searchParams.get('date')
	const statusFilter = searchParams.get('status') as BookingStatus | null

	// Фильтруем записи
	const filteredBookings = useMemo(() => {
		if (!bookings) return []

		let filtered = [...bookings]

		// Фильтр по дате
		if (dateFilter === 'today') {
			const today = new Date().toISOString().split('T')[0]
			filtered = filtered.filter(b => b.date === today && b.status !== 'cancelled' && b.status !== 'rejected')
		} else if (dateFilter === 'upcoming') {
			const today = new Date().toISOString().split('T')[0]
			filtered = filtered.filter(
				b => b.date >= today && b.status !== 'cancelled' && b.status !== 'rejected' && b.status !== 'completed'
			)
		}

		// Фильтр по статусу
		if (statusFilter) {
			filtered = filtered.filter(b => b.status === statusFilter)
		}

		return filtered
	}, [bookings, dateFilter, statusFilter])

	// Группируем записи по датам
	const groupedBookings = useMemo(() => {
		if (!filteredBookings.length) return []

		const grouped = filteredBookings.reduce((acc, booking) => {
			const date = booking.date
			if (!acc[date]) {
				acc[date] = []
			}
			acc[date].push(booking)
			return acc
		}, {} as Record<string, typeof filteredBookings>)

		// Сортируем по дате (от новых к старым)
		return Object.entries(grouped)
			.sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
			.map(([date, items]) => ({
				date,
				items: items.sort((a, b) => a.time.localeCompare(b.time))
			}))
	}, [filteredBookings])

	const clearFilters = (): void => {
		setSearchParams({})
	}

	const handleDateFilterChange = (value: string): void => {
		if (value === 'all') {
			setSearchParams(prev => {
				const newParams = new URLSearchParams(prev)
				newParams.delete('date')
				const status = newParams.get('status')
				if (status) {
					return { status } as Record<string, string>
				}
				return {} as Record<string, string>
			})
		} else {
			setSearchParams(prev => {
				const newParams = new URLSearchParams(prev)
				newParams.set('date', value)
				return Object.fromEntries(newParams)
			})
		}
	}

	const handleStatusFilterChange = (value: string): void => {
		if (value === 'all') {
			setSearchParams(prev => {
				const newParams = new URLSearchParams(prev)
				newParams.delete('status')
				const date = newParams.get('date')
				if (date) {
					return { date } as Record<string, string>
				}
				return {} as Record<string, string>
			})
		} else {
			setSearchParams(prev => {
				const newParams = new URLSearchParams(prev)
				newParams.set('status', value)
				return Object.fromEntries(newParams)
			})
		}
	}

	const activeDateFilter = dateFilter || 'all'
	const activeStatusFilter = statusFilter || 'all'

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString)
		const today = new Date()
		const tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + 1)
		const yesterday = new Date(today)
		yesterday.setDate(yesterday.getDate() - 1)

		const dateStr = date.toISOString().split('T')[0]
		const todayStr = today.toISOString().split('T')[0]
		const tomorrowStr = tomorrow.toISOString().split('T')[0]
		const yesterdayStr = yesterday.toISOString().split('T')[0]

		if (dateStr === todayStr) return 'Сегодня'
		if (dateStr === tomorrowStr) return 'Завтра'
		if (dateStr === yesterdayStr) return 'Вчера'

		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			weekday: 'long'
		})
	}

	const isEmail = (contact: string): boolean => {
		return contact.includes('@')
	}

	if (isLoading) {
		return (
			<Layout>
				<div className={s.bookings}>
					<div className={s.header}>
						<h1 className={s.title}>Записи</h1>
						<Skeleton height={28} width={80} borderRadius={6} />
					</div>
					<BookingsSkeleton />
				</div>
			</Layout>
		)
	}

	if (!bookings || bookings.length === 0) {
		return (
			<Layout>
				<div className={s.bookings}>
					<h1 className={s.title}>Записи</h1>
					<EmptyState
						icon="📅"
						title="Нет записей"
						description="Когда клиенты будут записываться, записи появятся здесь"
					/>
				</div>
			</Layout>
		)
	}

	if (filteredBookings.length === 0) {
		return (
			<Layout>
				<div className={s.bookings}>
					<div className={s.header}>
						<h1 className={s.title}>Записи</h1>
						<Badge size="lg" variant="light" color="blue">
							{bookings.length} {bookings.length === 1 ? 'запись' : bookings.length < 5 ? 'записи' : 'записей'}
						</Badge>
					</div>

					<div className={s.filters}>
						<div className={s.filtersContent}>
							<div className={`${s.filterGroup} ${s.dateFilterGroup}`}>
								{!isMobile && <Text size="xs" fw={500} c="dimmed" className={s.filterLabel}>Дата:</Text>}
								{isMobile ? (
									<>
										<Text size="sm" fw={600} c="dimmed" className={s.filterLabel}>
											Фильтр по дате
										</Text>
										<Select
											value={activeDateFilter}
											onChange={(value) => handleDateFilterChange(value || 'all')}
											data={[
												{ label: 'Все', value: 'all' },
												{ label: 'Сегодня', value: 'today' },
												{ label: 'Предстоящие', value: 'upcoming' }
											]}
											className={s.mobileSelect}
										/>
									</>
								) : (
									<SegmentedControl
										value={activeDateFilter}
										onChange={handleDateFilterChange}
										data={[
											{ label: 'Все', value: 'all' },
											{ label: 'Сегодня', value: 'today' },
											{ label: 'Предстоящие', value: 'upcoming' }
										]}
										className={s.dateFilter}
										size="xs"
									/>
								)}
							</div>

							<div className={`${s.filterGroup} ${s.statusFilterGroup}`}>
							{!isMobile && <Text size="xs" fw={500} c="dimmed" className={s.filterLabel}>Статус:</Text>}
							{isMobile ? (
									<>
										<Text size="sm" fw={600} c="dimmed" className={s.filterLabel}>
											Фильтр по статусу
										</Text>
										<Select
											value={activeStatusFilter}
											onChange={(value) => handleStatusFilterChange(value || 'all')}
											data={[
												{ label: 'Все', value: 'all' },
												{ label: 'Ожидает', value: 'pending' },
												{ label: 'Подтверждена', value: 'confirmed' },
												{ label: 'Завершена', value: 'completed' },
												{ label: 'Отклонена', value: 'rejected' },
												{ label: 'Отменена', value: 'cancelled' }
											]}
											className={s.mobileSelect}
										/>
									</>
								) : (
									<SegmentedControl
										value={activeStatusFilter}
										onChange={handleStatusFilterChange}
										data={[
											{ label: 'Все', value: 'all' },
											{ label: 'Ожидает', value: 'pending' },
											{ label: 'Подтверждена', value: 'confirmed' },
											{ label: 'Завершена', value: 'completed' },
											{ label: 'Отклонена', value: 'rejected' },
											{ label: 'Отменена', value: 'cancelled' }
										]}
										className={s.statusFilter}
										size="xs"
									/>
								)}
							</div>
						</div>

						<div className={s.clearButtonWrapper}>
							<MantineButton
								variant="subtle"
								size="xs"
								onClick={clearFilters}
								leftSection={<IconClose size={14} />}
								className={s.clearButton}
								style={{ visibility: (dateFilter || statusFilter) ? 'visible' : 'hidden' }}
							>
								{isMobile ? 'Сбросить фильтры' : 'Сбросить'}
							</MantineButton>
						</div>
					</div>

					<EmptyState
						icon="🔍"
						title="Записи не найдены"
						description="По выбранным фильтрам записей не найдено. Попробуйте изменить фильтры."
						action={
							<MantineButton variant="light" onClick={clearFilters}>
								Сбросить фильтры
							</MantineButton>
						}
					/>
				</div>
			</Layout>
		)
	}

	return (
		<Layout>
			<div className={s.bookings}>
				<div className={s.header}>
					<h1 className={s.title}>Записи</h1>
					<Badge size="lg" variant="light" color="blue">
						{filteredBookings.length} {filteredBookings.length === 1 ? 'запись' : filteredBookings.length < 5 ? 'записи' : 'записей'}
						{filteredBookings.length !== bookings.length && ` из ${bookings.length}`}
					</Badge>
				</div>

				<div className={s.filters}>
					<div className={s.filtersContent}>
						<div className={`${s.filterGroup} ${s.dateFilterGroup}`}>
							{!isMobile && <Text size="xs" fw={500} c="dimmed" className={s.filterLabel}>Дата:</Text>}
							{isMobile ? (
								<>
									<Text size="sm" fw={600} c="dimmed" className={s.filterLabel}>
										Фильтр по дате
									</Text>
									<Select
										value={activeDateFilter}
										onChange={(value) => handleDateFilterChange(value || 'all')}
										data={[
											{ label: 'Все', value: 'all' },
											{ label: 'Сегодня', value: 'today' },
											{ label: 'Предстоящие', value: 'upcoming' }
										]}
										className={s.mobileSelect}
									/>
								</>
							) : (
								<SegmentedControl
									value={activeDateFilter}
									onChange={handleDateFilterChange}
									data={[
										{ label: 'Все', value: 'all' },
										{ label: 'Сегодня', value: 'today' },
										{ label: 'Предстоящие', value: 'upcoming' }
									]}
									className={s.dateFilter}
									size="xs"
								/>
							)}
						</div>

						<div className={`${s.filterGroup} ${s.statusFilterGroup}`}>
							{!isMobile && <Text size="xs" fw={500} c="dimmed" className={s.filterLabel}>Статус:</Text>}
							{isMobile ? (
								<>
									<Text size="sm" fw={600} c="dimmed" className={s.filterLabel}>
										Фильтр по статусу
									</Text>
									<Select
										value={activeStatusFilter}
										onChange={(value) => handleStatusFilterChange(value || 'all')}
										data={[
											{ label: 'Все', value: 'all' },
											{ label: 'Ожидает', value: 'pending' },
											{ label: 'Подтверждена', value: 'confirmed' },
											{ label: 'Завершена', value: 'completed' },
											{ label: 'Отклонена', value: 'rejected' },
											{ label: 'Отменена', value: 'cancelled' }
										]}
										className={s.mobileSelect}
									/>
								</>
							) : (
								<SegmentedControl
									value={activeStatusFilter}
									onChange={handleStatusFilterChange}
									data={[
										{ label: 'Все', value: 'all' },
										{ label: 'Ожидает', value: 'pending' },
										{ label: 'Подтверждена', value: 'confirmed' },
										{ label: 'Завершена', value: 'completed' },
										{ label: 'Отклонена', value: 'rejected' },
										{ label: 'Отменена', value: 'cancelled' }
									]}
									className={s.statusFilter}
									size="xs"
								/>
							)}
						</div>
					</div>

					<div className={s.clearButtonWrapper}>
					<MantineButton
						variant="subtle"
						size="xs"
						onClick={clearFilters}
						leftSection={<IconClose size={14} />}
						className={s.clearButton}
						style={{ visibility: (dateFilter || statusFilter) ? 'visible' : 'hidden' }}
					>
							{isMobile ? 'Сбросить фильтры' : 'Сбросить'}
						</MantineButton>
					</div>
				</div>

				<div className={s.list}>
					{groupedBookings.map(({ date, items }) => (
						<div key={date} className={s.dateGroup}>
							<div className={s.dateHeader}>
								<IconCalendar size={18} />
								<Text fw={600} size="lg" className={s.dateTitle}>
									{formatDate(date)}
								</Text>
								<Badge size="sm" variant="light" color="gray">
									{items.length}
								</Badge>
							</div>
							<div className={s.dateBookings}>
								{items.map(booking => {
									const StatusIcon = STATUS_ICONS[booking.status]
									const isInactive = booking.status === 'cancelled' || booking.status === 'rejected'
									return (
										<div key={booking.id} className={`${s.card} ${isInactive ? s.cancelled : ''}`}>
											<div className={s.cardHeader}>
												<div className={s.clientInfo}>
													<Group gap="xs" align="center" mb={4}>
														<IconUser size={16} className={s.icon} />
														<h3 className={s.clientName}>{booking.clientName}</h3>
													</Group>
													<Group gap="xs" align="center">
														{isEmail(booking.clientContact) ? (
															<IconMail size={14} className={s.icon} />
														) : (
															<IconPhone size={14} className={s.icon} />
														)}
														<Text size="sm" c="dimmed" className={s.clientContact}>
															{booking.clientContact}
														</Text>
													</Group>
												</div>
												{/* Отмену ставит только клиент — селект скрыт только для отменённых. Для «Отклонено» владелец может изменить статус. */}
											{booking.status !== 'cancelled' && (
													<Select
														value={booking.status}
														onChange={(value) => {
															if (value && value !== booking.status) {
																updateStatusMutation.mutate(
																	{ id: booking.id, status: value as BookingStatus },
																	{
																		onSuccess: () => {
																			notifications.show({
																				title: 'Успешно',
																				message: 'Статус обновлён',
																				color: 'green'
																			})
																		},
																		onError: (error: unknown) => {
																			const message = getErrorMessage(error)
																			notifications.show({
																				title: 'Ошибка',
																				message,
																				color: 'red'
																			})
																		}
																	}
																)
															}
														}}
														data={STATUS_OPTIONS}
														size="sm"
														className={s.statusSelect}
														disabled={updateStatusMutation.isPending}
													/>
												)}
											</div>

											<Group gap="md" className={s.details}>
												<Group gap={4} className={s.detail}>
													<IconCalendar size={16} className={s.detailIcon} />
													<Text size="sm" c="dimmed">
														{new Date(booking.date).toLocaleDateString('ru-RU', {
															day: 'numeric',
															month: 'long',
															year: 'numeric'
														})}
													</Text>
												</Group>
												<Group gap={4} className={s.detail}>
													<IconClock size={16} className={s.detailIcon} />
													<Text size="sm" fw={500}>
														{booking.time}
													</Text>
												</Group>
												<Badge
													color={STATUS_COLORS[booking.status]}
													variant="light"
													leftSection={<StatusIcon size={12} />}
													size="sm"
												>
													{STATUS_LABELS[booking.status]}
												</Badge>
											</Group>
										</div>
									)
								})}
							</div>
						</div>
					))}
				</div>

		</div>
		</Layout>
	)
}

export const Component = Bookings
