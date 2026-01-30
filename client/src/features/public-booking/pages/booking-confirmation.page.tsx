import { type FC } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, Text, Badge } from '@mantine/core'
import { IconCheck, IconCalendar, IconClock, IconUser, IconBuilding, IconCalendarPlus } from '@tabler/icons-react'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

import { Loader, EmptyState } from '@/shared/kit'
import { LocationInfo } from '@/shared/components/LocationInfo'
import { usePublicBooking } from '@/shared/api/services/bookings'
import { ROUTES } from '@/shared/model/routes'
import { downloadIcsFile } from '@/shared/lib/calendar'

import s from './BookingConfirmation.module.scss'

dayjs.locale('ru')

const STATUS_LABELS: Record<string, string> = {
	pending: 'Ожидает подтверждения',
	confirmed: 'Подтверждена',
	cancelled: 'Отменена',
	rejected: 'Отклонена',
	completed: 'Завершена'
}

const STATUS_COLORS: Record<string, string> = {
	pending: 'yellow',
	confirmed: 'green',
	cancelled: 'red',
	rejected: 'red',
	completed: 'blue'
}

const BookingConfirmation: FC = () => {
	const { bookingId } = useParams<{ bookingId: string }>()
	const { data: booking, isLoading, isError } = usePublicBooking(bookingId || '')

	if (isLoading) {
		return (
			<div className={s.page}>
				<div className={s.container}>
					<Loader message="Загрузка..." size="lg" />
				</div>
			</div>
		)
	}

	if (isError || !booking) {
		return (
			<div className={s.page}>
				<div className={s.container}>
					<EmptyState
						icon="📋"
						title="Запись не найдена"
						description="Возможно, ссылка устарела или запись была удалена."
					/>
				</div>
			</div>
		)
	}

	const formattedDate = dayjs(booking.date).format('D MMMM YYYY, dddd')
	const formattedTime = booking.time.slice(0, 5)

	return (
		<div className={s.page}>
			<div className={s.container}>
				<Card className={s.card} padding={0} radius="lg" withBorder shadow="sm">
					<div className={s.header}>
						<div className={s.iconWrapper}>
							<IconCheck size={40} stroke={2} className={s.successIcon} />
						</div>
						<Text fw={700} size="xl" ta="center" className={s.title}>Ваша запись</Text>
						<Text size="sm" c="dimmed" ta="center" className={s.hint}>
							Сохраните эту ссылку в закладки — по ней вы всегда сможете посмотреть детали записи.
						</Text>
						<Badge
							size="md"
							color={STATUS_COLORS[booking.status] || 'gray'}
							variant="light"
							className={s.statusBadge}
						>
							{STATUS_LABELS[booking.status] ?? booking.status}
						</Badge>
					</div>

					<div className={s.body}>
						<dl className={s.details}>
							<div className={s.detailRow}>
								<dt><IconCalendar size={18} stroke={1.5} className={s.detailIcon} /></dt>
								<dd>{formattedDate}</dd>
							</div>
							<div className={s.detailRow}>
								<dt><IconClock size={18} stroke={1.5} className={s.detailIcon} /></dt>
								<dd>{formattedTime}</dd>
							</div>
							<div className={s.detailRow}>
								<dt><IconUser size={18} stroke={1.5} className={s.detailIcon} /></dt>
								<dd>{booking.clientName}</dd>
							</div>
							<div className={s.detailRow}>
								<dt><IconBuilding size={18} stroke={1.5} className={s.detailIcon} /></dt>
								<dd className={s.ownerName}>{booking.owner.name}</dd>
							</div>
						</dl>

						{(booking.owner.address || booking.owner.mapLink || booking.owner.website) && (
							<div className={s.locationSection}>
								<LocationInfo
									address={booking.owner.address ?? undefined}
									mapLink={booking.owner.mapLink ?? undefined}
									website={booking.owner.website ?? undefined}
								/>
							</div>
						)}

						{booking.owner.description && (
							<div className={s.descriptionBlock}>
								<Text size="sm" c="dimmed" className={s.description}>
									{booking.owner.description}
								</Text>
							</div>
						)}

						<div className={s.actions}>
							<button
								type="button"
								onClick={() => {
									const url = `${window.location.origin}${ROUTES.PUBLIC_BOOKING_CONFIRMATION.replace(':bookingId', booking.id)}`
									downloadIcsFile(
										{
											id: booking.id,
											date: booking.date,
											time: booking.time,
											owner: {
												name: booking.owner.name,
												address: booking.owner.address
											}
										},
										url
									)
								}}
								className={s.addToCalendarBtn}
							>
								<IconCalendarPlus size={18} stroke={1.5} />
								Добавить в календарь
							</button>
							<Link
								to={ROUTES.PUBLIC_BOOKING.replace(':ownerId', booking.owner.publicId)}
								className={s.newBookingLink}
							>
								Записаться ещё раз
							</Link>
						</div>
					</div>
				</Card>
			</div>
		</div>
	)
}

export const Component = BookingConfirmation
