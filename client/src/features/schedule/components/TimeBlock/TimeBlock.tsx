import { type FC } from 'react'
import { TextInput, ActionIcon } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

import { type TimeBlock as TimeBlockType } from '@/shared/api/services/schedule/types'

import s from './TimeBlock.module.scss'

interface TimeBlockProps {
	block: TimeBlockType
	blockIndex: number
	mode: 'simple' | 'advanced'
	totalBlocks: number
	onChange: (field: keyof TimeBlockType, value: string | number) => void
	onRemove?: () => void
}

export const TimeBlock: FC<TimeBlockProps> = ({
	block,
	blockIndex,
	mode,
	totalBlocks,
	onChange,
	onRemove
}) => {
	return (
		<div className={s.timeBlock}>
			{mode === 'advanced' && totalBlocks > 1 && (
				<div className={s.timeBlockHeader}>
					<span className={s.timeBlockLabel}>Интервал {blockIndex + 1}</span>
					{onRemove && (
						<ActionIcon
							color="red"
							variant="subtle"
							size="sm"
							onClick={onRemove}
							aria-label="Удалить блок"
						>
							<IconTrash size={16} />
						</ActionIcon>
					)}
				</div>
			)}
			<div className={s.timeBlockFields}>
				<TextInput
					label="Начало приема"
					type="time"
					value={block.startTime}
					onChange={e => onChange('startTime', e.target.value)}
					size="sm"
				/>

				<TextInput
					label="Конец приема"
					type="time"
					value={block.endTime}
					onChange={e => onChange('endTime', e.target.value)}
					size="sm"
				/>
			</div>
		</div>
	)
}
