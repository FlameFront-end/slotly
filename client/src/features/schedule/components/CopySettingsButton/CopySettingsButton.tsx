import { type FC } from 'react'
import { Menu, Button as MantineButton, Text } from '@mantine/core'
import { IconCopy, IconCheck, IconChevronDown, IconClock } from '@tabler/icons-react'

import { type ScheduleDay } from '@/shared/api/services/schedule/types'
import { DAYS_OF_WEEK, formatTimeRange } from '../../utils/schedule.utils'

import s from './CopySettingsButton.module.scss'

interface CopySettingsButtonProps {
	day: ScheduleDay
	dayIndex: number
	activeDays: ScheduleDay[]
	allDays: ScheduleDay[]
	copiedDayIndex: number | null
	onCopy: (sourceIndex: number, targetIndex: number) => void
}

export const CopySettingsButton: FC<CopySettingsButtonProps> = ({
	day: _day,
	dayIndex,
	activeDays,
	allDays,
	copiedDayIndex,
	onCopy
}) => {
	if (activeDays.length === 0) return null

	return (
		<Menu shadow="md" width={200} position="bottom-end">
			<Menu.Target>
				<MantineButton
					variant="subtle"
					size="xs"
					leftSection={copiedDayIndex === dayIndex ? <IconCheck size={14} /> : <IconCopy size={14} />}
					rightSection={<IconChevronDown size={14} />}
					color={copiedDayIndex === dayIndex ? "green" : "blue"}
					className={s.copyButton}
				>
					{copiedDayIndex === dayIndex ? 'Скопировано' : 'Копировать'}
				</MantineButton>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Label>Скопировать настройки с:</Menu.Label>
				{activeDays.map(sourceDay => {
					const sourceIndex = allDays.findIndex(d => d.id === sourceDay.id)
					return (
						<Menu.Item
							key={sourceDay.id}
							leftSection={<IconClock size={14} />}
							onClick={() => onCopy(sourceIndex, dayIndex)}
						>
							<div>
								<div>{DAYS_OF_WEEK[sourceDay.dayOfWeek]}</div>
								{sourceDay.timeBlocks.length > 0 && (
									<Text size="xs" c="dimmed" mt={2}>
										{formatTimeRange(sourceDay)}
									</Text>
								)}
							</div>
						</Menu.Item>
					)
				})}
			</Menu.Dropdown>
		</Menu>
	)
}
