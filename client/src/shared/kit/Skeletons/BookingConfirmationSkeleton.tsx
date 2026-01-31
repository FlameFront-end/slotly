import { type FC } from 'react'
import { Card } from '@mantine/core'
import { Skeleton } from '@/shared/kit'
import s from '@/features/public-booking/pages/BookingConfirmation.module.scss'

export const BookingConfirmationSkeleton: FC = () => (
	<Card className={s.card} padding={0} radius="lg" withBorder shadow="sm">
		<div className={s.header}>
			<div className={s.iconWrapper}>
				<Skeleton height={40} width={40} circle />
			</div>
			<Skeleton height={28} width={180} style={{ margin: '0 auto 8px' }} />
			<Skeleton height={14} width="90%" style={{ margin: '0 auto 16px', maxWidth: 320 }} />
			<Skeleton height={28} width={160} style={{ margin: '0 auto' }} />
		</div>

		<div className={s.body}>
			<div className={s.details}>
				{[1, 2, 3, 4].map(i => (
					<div key={i} className={s.detailRow}>
						<Skeleton height={18} width={18} />
						<Skeleton height={16} width="60%" />
					</div>
				))}
			</div>

			<div className={s.actions} style={{ marginTop: 16 }}>
				<Skeleton height={44} style={{ marginBottom: 10 }} />
				<Skeleton height={44} />
			</div>
		</div>
	</Card>
)
