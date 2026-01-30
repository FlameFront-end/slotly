import { type FC } from 'react'
import { Card, Stack, Text } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import { Button } from '@/shared/kit'
import s from './SuccessCard.module.scss'

interface Props {
	onCreateNew: () => void
}

export const SuccessCard: FC<Props> = ({ onCreateNew }) => {
	return (
		<Card className={s.successCard} padding="xl" radius="md" withBorder>
			<Stack align="center" gap="md">
				<IconCheck size={64} stroke={2} className={s.successIcon} />
				<Text fw={600} size="xl" ta="center">Запись успешно создана!</Text>
				<Text size="sm" c="dimmed" ta="center">
					Мы свяжемся с вами для подтверждения записи.
				</Text>
				<Button onClick={onCreateNew} variant="light" mt="md">
					Создать новую запись
				</Button>
			</Stack>
		</Card>
	)
}
