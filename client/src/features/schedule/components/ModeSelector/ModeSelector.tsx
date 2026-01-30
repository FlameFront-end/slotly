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
			<Text size="sm" fw={500} mb="xs">Режим настройки:</Text>
			<SegmentedControl
				value={mode}
				onChange={(value) => onChange(value as 'simple' | 'advanced')}
				data={[
					{ label: 'Простой', value: 'simple' },
					{ label: 'Расширенный', value: 'advanced' }
				]}
				size="sm"
				fullWidth
			/>
			<Text size="xs" c="dimmed" mt="xs">
				{mode === 'simple' 
					? 'Настройте начало и конец рабочего дня'
					: 'Настройте несколько временных блоков с разными параметрами'}
			</Text>
		</div>
	)
}
