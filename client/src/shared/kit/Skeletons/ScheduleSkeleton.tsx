import { type FC } from 'react'
import { Skeleton } from '@/shared/kit'
import s from '@/features/schedule/pages/Schedule.module.scss'
import dayCardStyles from '@/features/schedule/components/DayCard/DayCard.module.scss'

const DayCardSkeleton = () => (
	<div className={dayCardStyles.dayCard}>
		<div className={dayCardStyles.dayHeader}>
			<Skeleton height={24} width={24} />
			<Skeleton height={24} width={100} />
			<Skeleton height={24} width={80} />
		</div>
		<div className={dayCardStyles.dayFields} style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
			<Skeleton height={36} width="100%" />
			<Skeleton height={72} count={2} />
		</div>
	</div>
)

export const ScheduleSkeleton: FC = () => (
	<form className={s.form}>
		<div className={s.exceptionsSection}>
			<Skeleton height={40} width={200} />
		</div>
		<div className={s.days}>
			<div className={s.dayGroup}>
				<Skeleton height={14} width={100} className={s.groupLabel} style={{ marginBottom: 16 }} />
				{[1, 2, 3].map(i => (
					<DayCardSkeleton key={i} />
				))}
			</div>
			<div className={s.dayGroup}>
				<Skeleton height={14} width={100} className={s.groupLabel} style={{ marginBottom: 16 }} />
				{[1, 2].map(i => (
					<DayCardSkeleton key={i} />
				))}
			</div>
		</div>
		<div className={s.actions}>
			<Skeleton height={44} />
		</div>
	</form>
)
