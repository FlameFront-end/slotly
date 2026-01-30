import { type FC } from 'react'
import { Card, Stack, Group, Text } from '@mantine/core'
import { CopyButton } from '@/shared/kit'
import s from './PublicLinkCard.module.scss'

interface Props {
	publicLink: string
	onCopy: () => void
}

export const PublicLinkCard: FC<Props> = ({ publicLink, onCopy }) => {
	return (
		<Card padding="lg" radius="md" withBorder className={s.publicLinkCard} data-tour="public-link">
			<Stack gap="md">
				<div>
					<Text size="sm" c="dimmed" tt="uppercase" fw={700} mb={4}>
						Публичная ссылка для записи
					</Text>
					<Text size="xs" c="dimmed" mb="md">
						Поделитесь этой ссылкой с клиентами для записи на прием
					</Text>
				</div>
				<Group gap="sm" align="stretch">
					<div
						className={s.publicLink}
						onClick={onCopy}
						onKeyDown={e => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault()
								onCopy()
							}
						}}
						role="button"
						tabIndex={0}
						aria-label="Нажмите для копирования ссылки"
					>
						{publicLink}
					</div>
					<CopyButton
						value={publicLink}
						label="Копировать"
						size="md"
						variant="filled"
					/>
				</Group>
			</Stack>
		</Card>
	)
}
