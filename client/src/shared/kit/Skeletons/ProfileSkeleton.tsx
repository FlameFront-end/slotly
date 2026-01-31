import { type FC } from 'react'
import { Skeleton } from '@/shared/kit'
import s from '@/features/profile/pages/Profile.module.scss'

const SectionSkeleton = () => (
	<section className={s.section}>
		<Skeleton height={20} width="50%" style={{ marginBottom: 20 }} />
		<div className={s.sectionContent}>
			<div>
				<Skeleton height={14} width={120} style={{ marginBottom: 8 }} />
				<Skeleton height={42} />
			</div>
			<div>
				<Skeleton height={14} width={80} style={{ marginBottom: 8 }} />
				<Skeleton height={100} />
			</div>
		</div>
	</section>
)

export const ProfileSkeleton: FC = () => (
	<form className={s.form}>
		<SectionSkeleton />
		<SectionSkeleton />
		<SectionSkeleton />
		<SectionSkeleton />
		<div className={s.actions}>
			<Skeleton height={44} />
		</div>
	</form>
)
