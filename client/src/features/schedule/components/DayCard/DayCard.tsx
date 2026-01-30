import { type FC } from 'react'
import { Checkbox, Group } from '@mantine/core'
import { IconClock, IconPlus } from '@tabler/icons-react'

import { type ScheduleDay, type TimeBlock } from '@/shared/api/services/schedule/types'
import { DAYS_OF_WEEK, formatTimeRange, isWeekend } from '../../utils/schedule.utils'
import { Button } from '@/shared/kit'

import { ModeSelector } from '../ModeSelector/ModeSelector'
import { TimeBlock as TimeBlockComponent } from '../TimeBlock/TimeBlock'
import { CopySettingsButton } from '../CopySettingsButton/CopySettingsButton'

import s from './DayCard.module.scss'

interface DayCardProps {
	day: ScheduleDay
	dayIndex: number
	mode: 'simple' | 'advanced'
	copiedDayIndex: number | null
	activeDays: ScheduleDay[]
	allDays: ScheduleDay[]
	onActiveChange: (active: boolean) => void
	onModeChange: (mode: 'simple' | 'advanced') => void
	onTimeBlockChange: (blockIndex: number, field: keyof TimeBlock, value: string | number) => void
	onAddTimeBlock: () => void
	onRemoveTimeBlock: (blockIndex: number) => void
	onCopySettings: (sourceIndex: number, targetIndex: number) => void
}

export const DayCard: FC<DayCardProps> = ({
	day,
	dayIndex,
	mode,
	copiedDayIndex,
	activeDays,
	allDays,
	onActiveChange,
	onModeChange,
	onTimeBlockChange,
	onAddTimeBlock,
	onRemoveTimeBlock,
	onCopySettings
}) => {
	return (
		<div 
			className={`${s.dayCard} ${day.isActive ? s.dayCardActive : ''} ${isWeekend(day.dayOfWeek) ? s.weekendCard : ''}`}
		>
			<div className={s.dayHeader}>
				<Group gap="sm" align="center">
					<IconClock size={18} className={s.dayIcon} />
					<Checkbox
						label={DAYS_OF_WEEK[day.dayOfWeek]}
						checked={day.isActive}
						onChange={e => onActiveChange(e.target.checked)}
						size="md"
					/>
				</Group>
				<Group gap="xs">
					{day.isActive && (
						<span className={s.activeBadge}>
							{formatTimeRange(day)}
						</span>
					)}
					<CopySettingsButton
						day={day}
						dayIndex={dayIndex}
						activeDays={activeDays}
						allDays={allDays}
						copiedDayIndex={copiedDayIndex}
						onCopy={onCopySettings}
					/>
				</Group>
			</div>

			{day.isActive && (
				<div className={s.dayFields}>
					<ModeSelector mode={mode} onChange={onModeChange} />

					{day.timeBlocks.map((block, blockIndex) => (
						<TimeBlockComponent
							key={blockIndex}
							block={block}
							blockIndex={blockIndex}
							mode={mode}
							totalBlocks={day.timeBlocks.length}
							onChange={(field, value) => onTimeBlockChange(blockIndex, field, value)}
							onRemove={day.timeBlocks.length > 1 ? () => onRemoveTimeBlock(blockIndex) : undefined}
						/>
					))}
					
					{mode === 'advanced' && (
						<Button
							type="button"
							variant="light"
							leftSection={<IconPlus size={16} />}
							onClick={onAddTimeBlock}
							size="sm"
							fullWidth
							className={s.addBlockButton}
						>
							Добавить временной блок
						</Button>
					)}
				</div>
			)}
		</div>
	)
}
