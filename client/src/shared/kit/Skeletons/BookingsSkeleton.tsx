import { type FC } from 'react'
import { Skeleton } from '@/shared/kit'
import s from '@/features/bookings/pages/Bookings.module.scss'

export const BookingsSkeleton: FC = () => (
	<>
		<div className={s.filters}>
			<div className={s.filtersContent}>
				<div className={`${s.filterGroup} ${s.dateFilterGroup}`}>
					<Skeleton height={14} width={80} />
					<Skeleton height={32} width="100%" />
				</div>
				<div className={`${s.filterGroup} ${s.statusFilterGroup}`}>
					<Skeleton height={14} width={60} />
					<Skeleton height={32} width="100%" />
				</div>
			</div>
		</div>

		<div className={s.list}>
			{[1, 2].map(groupIdx => (
				<div key={groupIdx} className={s.dateGroup}>
					<div className={s.dateHeader}>
						<Skeleton height={18} width={24} circle />
						<Skeleton height={20} width={180} />
						<Skeleton height={20} width={32} />
					</div>
					<div className={s.dateBookings}>
						{[1, 2, 3].map(cardIdx => (
							<div key={cardIdx} className={s.card}>
								<div className={s.cardHeader}>
									<div className={s.clientInfo}>
										<Skeleton height={18} width="60%" style={{ marginBottom: 8 }} />
										<Skeleton height={14} width="45%" />
									</div>
									<Skeleton height={36} width={150} />
								</div>
								<div className={s.details}>
									<Skeleton height={16} width={120} />
									<Skeleton height={16} width={60} />
									<Skeleton height={24} width={100} />
								</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	</>
)
