import { type FC, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { Card, Text, Badge } from '@mantine/core'
import { IconCheck, IconCalendar, IconClock, IconUser, IconBuilding, IconCalendarPlus, IconX } from '@tabler/icons-react'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

import { Loader, EmptyState, Button, ConfirmModal } from '@/shared/kit'
import { LocationInfo } from '@/shared/components/LocationInfo'
import { usePublicBooking, useCancelPublicBooking } from '@/shared/api/services/bookings'
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

const CAN_CANCEL_STATUSES = ['pending', 'confirmed'] as const

const BookingConfirmation: FC = () => {
	const { bookingId } = useParams<{ bookingId: string }>()
	const [cancelModalOpened, setCancelModalOpened] = useState(false)
	const { data: booking, isLoading, isError } = usePublicBooking(bookingId || '')
	const cancelMutation = useCancelPublicBooking(bookingId || '')

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
	const canCancel = CAN_CANCEL_STATUSES.includes(booking.status as (typeof CAN_CANCEL_STATUSES)[number])
	const isInactive = booking.status === 'cancelled' || booking.status === 'rejected'

	const handleCancelClick = () => setCancelModalOpened(true)

	const handleCancelConfirm = async () => {
		try {
			await cancelMutation.mutateAsync()
			setCancelModalOpened(false)
			notifications.show({
				title: 'Готово',
				message: 'Запись отменена',
				color: 'green'
			})
		} catch {
			notifications.show({
				title: 'Ошибка',
				message: 'Не удалось отменить запись',
				color: 'red'
			})
		}
	}

	return (
		<div className={s.page}>
			<div className={s.container}>
				<Card className={`${s.card} ${isInactive ? s.cardInactive : ''}`} padding={0} radius="lg" withBorder shadow="sm">
					<div className={s.header}>
						<div className={s.iconWrapper}>
							{isInactive ? (
								<IconX size={40} stroke={2} className={s.inactiveIcon} />
							) : (
								<IconCheck size={40} stroke={2} className={s.successIcon} />
							)}
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
							{canCancel && (
								<Button
									variant="outline"
									color="red"
									fullWidth
									leftSection={<IconX size={18} stroke={1.5} />}
									onClick={handleCancelClick}
									loading={cancelMutation.isPending}
								>
									Отменить запись
								</Button>
							)}
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

				<ConfirmModal
					opened={cancelModalOpened}
					onClose={() => !cancelMutation.isPending && setCancelModalOpened(false)}
					onConfirm={handleCancelConfirm}
					title="Отменить запись?"
					message="Вы уверены, что хотите отменить запись? Это действие нельзя отменить."
					confirmLabel="Да, отменить"
					confirmColor="red"
					loading={cancelMutation.isPending}
				/>
			</div>
		</div>
	)
}

export const Component = BookingConfirmation
