import { type FC, useState, useMemo, useCallback } from 'react'
import { Checkbox, Group, NumberInput, Text, Select } from '@mantine/core'
import { IconClock, IconPlus } from '@tabler/icons-react'

import { type ScheduleDay, type TimeBlock } from '@/shared/api/services/schedule/types'
import { type Service } from '@/shared/api/services/services/types'
import { DAYS_OF_WEEK, formatTimeRange, isWeekend } from '../../utils/schedule.utils'
import { getActiveServices, createServiceSelectOptions } from '@/shared/utils/service.utils'
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
	services?: Service[]
	onActiveChange: (active: boolean) => void
	onModeChange: (mode: 'simple' | 'advanced') => void
	onTimeBlockChange: (blockIndex: number, field: keyof TimeBlock, value: string | number | null) => void
	onAddTimeBlock: (count: number, durationMinutes: number, serviceId?: string | null) => void
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
	services = [],
	onActiveChange,
	onModeChange,
	onTimeBlockChange,
	onAddTimeBlock,
	onRemoveTimeBlock,
	onCopySettings
}) => {
	const [batchCount, setBatchCount] = useState(3)
	const [batchDuration, setBatchDuration] = useState(60)
	const [batchServiceId, setBatchServiceId] = useState<string | null>(null)

	const activeServices = useMemo(() => getActiveServices(services), [services])
	const serviceOptions = useMemo(
		() => createServiceSelectOptions(activeServices),
		[activeServices]
	)
	
	const isServiceRequired = activeServices.length > 0
	const isAddButtonDisabled = isServiceRequired && !batchServiceId

	const handleBatchChange = useCallback((value: string | number): void => {
		const parsed = typeof value === 'number' ? value : Number(value)
		const normalized = Number.isFinite(parsed) ? parsed : 2
		const clamped = Math.max(2, Math.min(12, normalized))
		setBatchCount(clamped)
	}, [])

	const handleDurationChange = useCallback((value: string | number): void => {
		const parsed = typeof value === 'number' ? value : Number(value)
		const normalized = Number.isFinite(parsed) ? parsed : 60
		const clamped = Math.max(15, Math.min(480, normalized))
		setBatchDuration(clamped)
	}, [])

	const handleAddSingleBlock = useCallback(() => {
		onAddTimeBlock(1, batchDuration, batchServiceId || undefined)
	}, [onAddTimeBlock, batchDuration, batchServiceId])

	const handleAddMultipleBlocks = useCallback(() => {
		onAddTimeBlock(batchCount, batchDuration, batchServiceId || undefined)
	}, [onAddTimeBlock, batchCount, batchDuration, batchServiceId])

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
				<Group gap="xs" align="center">
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
							services={services}
							onChange={(field, value) => onTimeBlockChange(blockIndex, field, value)}
							onRemove={day.timeBlocks.length > 1 ? () => onRemoveTimeBlock(blockIndex) : undefined}
						/>
					))}
					
					{mode === 'advanced' && (
						<div className={s.blockActions}>
							<Button
								type="button"
								variant="light"
								leftSection={<IconPlus size={16} />}
								onClick={handleAddSingleBlock}
								size="sm"
								fullWidth
								className={s.addBlockButton}
								disabled={isAddButtonDisabled}
							>
								Добавить интервал
							</Button>
							<div className={s.batchControls}>
								<div className={s.batchField}>
									<Text size="xs" c="dimmed">Сколько</Text>
									<NumberInput
										value={batchCount}
										onChange={handleBatchChange}
										min={2}
										max={12}
										step={1}
										size="xs"
										hideControls
										placeholder="3"
										className={s.batchInput}
									/>
								</div>
								<div className={s.batchField}>
									<Text size="xs" c="dimmed">Мин/интервал</Text>
									<NumberInput
										value={batchDuration}
										onChange={handleDurationChange}
										min={15}
										max={480}
										step={5}
										size="xs"
										suffix=" мин"
										hideControls
										placeholder="60"
										className={s.batchInput}
									/>
								</div>
								{isServiceRequired && (
									<div className={s.batchField}>
										<Text size="xs" c="dimmed">Услуга</Text>
										<Select
											data={serviceOptions}
											value={batchServiceId || ''}
											onChange={(value) => setBatchServiceId(value || null)}
											size="xs"
											required
											searchable
											placeholder="Выберите услугу"
											className={s.batchServiceSelect}
										/>
									</div>
								)}
								<Button
									type="button"
									variant="subtle"
									onClick={handleAddMultipleBlocks}
									size="xs"
									className={s.batchAddButton}
									disabled={isAddButtonDisabled}
								>
									Добавить {batchCount} × {batchDuration} мин
								</Button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
