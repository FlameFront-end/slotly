import { type FC } from 'react'

import { Loader as MantineLoader, Center } from '@mantine/core'

interface LoaderProps {
	message?: string
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Loader: FC<LoaderProps> = ({ message, size = 'md' }) => {
	return (
		<Center style={{ padding: '2rem' }}>
			<div style={{ textAlign: 'center' }}>
				<MantineLoader size={size} />
				{message && <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>{message}</p>}
			</div>
		</Center>
	)
}
