import { type FC, type ReactNode } from 'react'

import { Text, Stack } from '@mantine/core'

interface EmptyStateProps {
	icon?: ReactNode
	title: string
	description?: string
	action?: ReactNode
}

export const EmptyState: FC<EmptyStateProps> = ({ icon, title, description, action }) => {
	return (
		<Stack align="center" gap="md" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
			{icon && <div style={{ fontSize: '3rem', opacity: 0.5 }}>{icon}</div>}
			<Text size="lg" fw={500}>
				{title}
			</Text>
			{description && (
				<Text size="sm" c="dimmed">
					{description}
				</Text>
			)}
			{action && <div style={{ marginTop: '1rem' }}>{action}</div>}
		</Stack>
	)
}
