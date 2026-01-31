import { type FC, useMemo } from 'react'
import { TextInput, ActionIcon, Select } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

import { type TimeBlock as TimeBlockType } from '@/shared/api/services/schedule/types'
import { type Service } from '@/shared/api/services/services/types'
import { getActiveServices, createServiceSelectOptions } from '@/shared/utils/service.utils'

import s from './TimeBlock.module.scss'

interface TimeBlockProps {
	block: TimeBlockType
	blockIndex: number
	mode: 'simple' | 'advanced'
	totalBlocks: number
	services?: Service[]
	onChange: (field: keyof TimeBlockType, value: string | number | null) => void
	onRemove?: () => void
}

const getTimeLabel = (mode: 'simple' | 'advanced', type: 'start' | 'end'): string => {
	if (mode === 'simple') {
		return type === 'start' ? 'Начало рабочего дня' : 'Конец рабочего дня'
	}
	return type === 'start' ? 'Начало приёма' : 'Конец приёма'
}

export const TimeBlock: FC<TimeBlockProps> = ({
	block,
	blockIndex,
	mode,
	totalBlocks,
	services = [],
	onChange,
	onRemove
}) => {
	const activeServices = useMemo(() => getActiveServices(services), [services])
	const serviceOptions = useMemo(
		() => createServiceSelectOptions(activeServices),
		[activeServices]
	)
	
	const showServiceSelect = mode === 'advanced' && activeServices.length > 0

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
			<div className={`${s.timeBlockFields} ${mode === 'simple' ? s.simpleMode : ''}`}>
				<TextInput
					label={getTimeLabel(mode, 'start')}
					type="time"
					value={block.startTime}
					onChange={e => onChange('startTime', e.target.value)}
					size="sm"
				/>

				<TextInput
					label={getTimeLabel(mode, 'end')}
					type="time"
					value={block.endTime}
					onChange={e => onChange('endTime', e.target.value)}
					size="sm"
					readOnly
					styles={{
						input: {
							cursor: 'default',
							backgroundColor: 'var(--bg-secondary)'
						}
					}}
				/>

				{showServiceSelect && (
					<Select
						label="Услуга"
						placeholder="Выберите услугу"
						data={serviceOptions}
						value={block.serviceId || ''}
						onChange={(value) => onChange('serviceId', value || null)}
						size="sm"
						required
						searchable
						className={s.serviceSelect}
					/>
				)}
			</div>
		</div>
	)
}
