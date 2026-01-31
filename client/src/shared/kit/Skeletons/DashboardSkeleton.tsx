import { type FC } from 'react'
import { Card, Stack, Group } from '@mantine/core'
import { Skeleton } from '@/shared/kit'
import s from '@/features/dashboard/pages/Dashboard.module.scss'

export const DashboardSkeleton: FC = () => (
	<>
		<Card padding="lg" radius="md" withBorder className={s.publicLinkCard}>
			<Stack gap="md">
				<div>
					<Skeleton height={12} width="60%" style={{ marginBottom: 8 }} />
					<Skeleton height={10} width="90%" style={{ marginBottom: 16 }} />
				</div>
				<Group gap="sm" align="stretch">
					<Skeleton height={42} style={{ flex: 1 }} />
					<Skeleton height={42} width={120} />
				</Group>
			</Stack>
		</Card>

		<div className={s.stats}>
			{[1, 2, 3, 4].map(i => (
				<Card key={i} padding="md" radius="md" withBorder className={s.statCard}>
					<Stack gap="xs">
						<Skeleton height={10} width="70%" />
						<Skeleton height={28} width={40} />
					</Stack>
				</Card>
			))}
		</div>

		<div className={s.grid}>
			{[1, 2, 3].map(i => (
				<div key={i} className={s.card}>
					<Skeleton height={24} width="40%" style={{ marginBottom: 8 }} />
					<Skeleton height={14} count={2} />
				</div>
			))}
		</div>
	</>
)
