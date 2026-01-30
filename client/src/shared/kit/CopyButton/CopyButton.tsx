import { type FC, useState } from 'react'

import { Button } from '@mantine/core'
import { IconCopy, IconCheck } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

interface CopyButtonProps {
	value: string
	label?: string
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	variant?: 'filled' | 'light' | 'outline' | 'subtle'
	fullHeight?: boolean
}

export const CopyButton: FC<CopyButtonProps> = ({
	value,
	label = 'Копировать',
	size = 'sm',
	variant = 'subtle',
	fullHeight = false
}) => {
	const [copied, setCopied] = useState(false)

	const handleCopy = async (): Promise<void> => {
		try {
			await navigator.clipboard.writeText(value)
			setCopied(true)
			notifications.show({
				title: 'Скопировано',
				message: 'Ссылка скопирована в буфер обмена',
				color: 'green',
				autoClose: 2000
			})
			setTimeout(() => {
				setCopied(false)
			}, 2000)
		} catch {
			// Fallback для старых браузеров
			const textArea = document.createElement('textarea')
			textArea.value = value
			document.body.appendChild(textArea)
			textArea.select()
			document.execCommand('copy')
			document.body.removeChild(textArea)
			setCopied(true)
			notifications.show({
				title: 'Скопировано',
				message: 'Ссылка скопирована в буфер обмена',
				color: 'green',
				autoClose: 2000
			})
			setTimeout(() => {
				setCopied(false)
			}, 2000)
		}
	}

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleCopy}
			color={copied ? 'green' : 'gray'}
			leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
			style={fullHeight ? { height: '100%', alignSelf: 'stretch' } : undefined}
		>
			{copied ? 'Скопировано' : label}
		</Button>
	)
}
