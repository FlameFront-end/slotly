import { type FC } from 'react'

import { Modal, Button, Group, Text } from '@mantine/core'

interface ConfirmModalProps {
	opened: boolean
	onClose: () => void
	onConfirm: () => void
	title: string
	message: string
	confirmLabel?: string
	cancelLabel?: string
	confirmColor?: string
	loading?: boolean
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
	opened,
	onClose,
	onConfirm,
	title,
	message,
	confirmLabel = 'Подтвердить',
	cancelLabel = 'Отмена',
	confirmColor = 'red',
	loading = false
}) => {
	return (
		<Modal opened={opened} onClose={onClose} title={title} centered>
			<Text>{message}</Text>
			<Group justify="flex-end" mt="xl">
				<Button variant="subtle" onClick={onClose} disabled={loading}>
					{cancelLabel}
				</Button>
				<Button color={confirmColor} onClick={onConfirm} loading={loading}>
					{confirmLabel}
				</Button>
			</Group>
		</Modal>
	)
}
