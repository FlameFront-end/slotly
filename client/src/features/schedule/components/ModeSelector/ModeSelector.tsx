import { type FC } from 'react'
import { SegmentedControl, Text } from '@mantine/core'

import s from './ModeSelector.module.scss'

interface ModeSelectorProps {
	mode: 'simple' | 'advanced'
	onChange: (mode: 'simple' | 'advanced') => void
}

export const ModeSelector: FC<ModeSelectorProps> = ({ mode, onChange }) => {
	return (
		<div className={s.modeSelector}>
			<Text size="sm" fw={500} mb="xs">Режим расписания:</Text>
			<SegmentedControl
				value={mode}
				onChange={(value) => onChange(value as 'simple' | 'advanced')}
				data={[
					{ label: 'Обычный день', value: 'simple' },
					{ label: 'Интервалы', value: 'advanced' }
				]}
				size="sm"
				fullWidth
			/>
			<Text size="xs" c="dimmed" mt="xs">
				{mode === 'simple'
					? 'Клиент сможет записаться на любое время внутри этого диапазона'
					: 'Добавьте отдельные интервалы приема в течение дня'}
			</Text>
		</div>
	)
}
