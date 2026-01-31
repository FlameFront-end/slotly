import { type FC, useMemo, useState } from 'react'
import { Text, Group, TextInput, ActionIcon, UnstyledButton } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { IconTrash, IconChevronDown, IconChevronRight } from '@tabler/icons-react'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

import type { ScheduleException } from '@/shared/api/services/schedule/types'

import s from './ExactDatesSection.module.scss'

dayjs.locale('ru')

export interface ExactDatesSectionProps {
	exceptions: ScheduleException[]
	onAddDate: (date: string) => void
	onRemoveDate: (date: string) => void
	onUpdateDate: (date: string, patch: Partial<ScheduleException>) => void
}

export const ExactDatesSection: FC<ExactDatesSectionProps> = ({
	exceptions,
	onAddDate,
	onRemoveDate,
	onUpdateDate
}) => {
	const [collapsed, setCollapsed] = useState(true)

	const sortedExceptions = useMemo(
		() => [...exceptions].sort((a, b) => a.date.localeCompare(b.date)),
		[exceptions]
	)
	const exceptionDates = useMemo(
		() => sortedExceptions.map(item => dayjs(item.date).toDate()),
		[sortedExceptions]
	)

	const handleDatesChange = (dates: Date[]) => {
		const selected = new Set(dates.map(date => dayjs(date).format('YYYY-MM-DD')))
		const existing = new Set(sortedExceptions.map(item => item.date))

		selected.forEach(date => {
			if (!existing.has(date)) {
				onAddDate(date)
			}
		})

		existing.forEach(date => {
			if (!selected.has(date)) {
				onRemoveDate(date)
			}
		})
	}

	return (
		<div className={s.section}>
			<UnstyledButton
				className={s.header}
				onClick={() => setCollapsed(c => !c)}
				aria-expanded={!collapsed}
			>
				{collapsed ? (
					<IconChevronRight size={18} className={s.chevron} />
				) : (
					<IconChevronDown size={18} className={s.chevron} />
				)}
				<Text size="sm" fw={600} c="dimmed">
					Точные даты приёма
				</Text>
				{exceptions.length > 0 && (
					<Text size="xs" c="dimmed" className={s.badge}>
						{exceptions.length}
					</Text>
				)}
			</UnstyledButton>
			{!collapsed && (
				<div className={s.grid}>
				<div className={s.calendarCard}>
					<DatePicker
						type="multiple"
						value={exceptionDates}
						onChange={handleDatesChange}
						locale="ru"
						size="sm"
					/>
					<Text size="xs" c="dimmed" mt={10} style={{ lineHeight: 1.4 }}>
						Выберите даты, когда запись доступна вне обычного расписания по дням недели.
					</Text>
				</div>
				<div className={s.list}>
					{sortedExceptions.length === 0 ? (
						<Text size="sm" c="dimmed" className={s.listEmpty}>
							Нет выбранных дат. Выберите даты в календаре.
						</Text>
					) : (
						sortedExceptions.map(item => (
							<div key={item.date} className={s.row}>
								<Group gap="xs" align="center" className={s.rowHeader}>
									<Text fw={600}>{dayjs(item.date).format('D MMMM YYYY')}</Text>
									<ActionIcon
										variant="subtle"
										color="red"
										onClick={() => onRemoveDate(item.date)}
										aria-label="Удалить дату"
									>
										<IconTrash size={16} />
									</ActionIcon>
								</Group>
								<Group gap="sm" align="center" className={s.rowTimes}>
									<TextInput
										type="time"
										label="Начало"
										value={item.startTime || '09:00'}
										onChange={event => {
											const value = event.target.value
											onUpdateDate(item.date, { startTime: value || undefined })
										}}
										size="sm"
									/>
									<TextInput
										type="time"
										label="Конец"
										value={item.endTime || '18:00'}
										onChange={event => {
											const value = event.target.value
											onUpdateDate(item.date, { endTime: value || undefined })
										}}
										size="sm"
									/>
								</Group>
							</div>
						))
					)}
				</div>
				</div>
			)}
		</div>
	)
}
