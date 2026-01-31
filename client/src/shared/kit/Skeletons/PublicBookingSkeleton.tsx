import { type FC } from 'react'
import { Skeleton } from '@/shared/kit'
import ownerCardStyles from '@/features/public-booking/components/OwnerCard/OwnerCard.module.scss'

export const PublicBookingSkeleton: FC = () => (
	<>
		<div className={ownerCardStyles.ownerCard}>
			<div className={ownerCardStyles.ownerCardHeader}>
				<Skeleton height={52} width={52} borderRadius={14} />
				<Skeleton height={22} width="70%" />
			</div>
			<Skeleton height={14} count={3} style={{ marginBottom: 12 }} />
			<Skeleton height={40} width="80%" />
		</div>

		<Skeleton height={28} width={200} style={{ marginBottom: 16 }} />

		<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
			<div>
				<Skeleton height={14} width={100} style={{ marginBottom: 8 }} />
				<Skeleton height={44} />
			</div>
			<div>
				<Skeleton height={14} width={80} style={{ marginBottom: 8 }} />
				<Skeleton height={44} />
			</div>
			<div>
				<Skeleton height={14} width={120} style={{ marginBottom: 8 }} />
				<Skeleton height={44} />
			</div>
			<div>
				<Skeleton height={14} width={90} style={{ marginBottom: 8 }} />
				<Skeleton height={44} />
			</div>
			<Skeleton height={48} style={{ marginTop: 8 }} />
		</div>
	</>
)
