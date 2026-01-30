import { type FC } from 'react'
import { Text } from '@mantine/core'

import { Button, Loader } from '@/shared/kit'
import { Layout } from '@/shared/widgets'
import { useScheduleForm } from '../hooks/useScheduleForm'
import { isWeekday, isWeekend } from '../utils/schedule.utils'
import { DayCard } from '../components/DayCard/DayCard'

import s from './Schedule.module.scss'

const Schedule: FC = () => {
	const {
		days,
		dayModes,
		copiedDayIndex,
		isLoading,
		updateMutation,
		handleDayChange,
		handleModeChange,
		handleTimeBlockChange,
		addTimeBlock,
		removeTimeBlock,
		copyDaySettings,
		handleSubmit
	} = useScheduleForm()

	if (isLoading) {
		return (
			<Layout>
				<div className={s.schedule}>
					<div className={s.header}>
						<h1 className={s.title}>Расписание</h1>
						<p className={s.subtitle}>Настройте рабочие часы и доступность для записи</p>
					</div>
					<Loader message="Загрузка расписания..." />
				</div>
			</Layout>
		)
	}

	const activeDaysCount = days.filter(day => day.isActive).length

	return (
		<Layout>
			<div className={s.schedule}>
				<div className={s.header}>
					<h1 className={s.title}>Расписание</h1>
					<p className={s.subtitle}>Настройте рабочие часы и доступность для записи</p>
					{activeDaysCount > 0 && (
						<div className={s.activeDaysInfo}>
							Активных дней: <span className={s.activeDaysCount}>{activeDaysCount}</span>
						</div>
					)}
				</div>

				<form onSubmit={handleSubmit} className={s.form}>
					<div className={s.days}>
						<div className={s.dayGroup}>
							<Text size="sm" fw={600} c="dimmed" className={s.groupLabel}>
								Рабочие дни
							</Text>
							{days.filter(day => isWeekday(day.dayOfWeek)).map((day) => {
								const index = days.findIndex(d => d.id === day.id)
								const activeDays = days.filter(d => d.isActive && d.id !== day.id)

								return (
									<DayCard
										key={day.id}
										day={day}
										dayIndex={index}
										mode={dayModes[day.dayOfWeek] || 'simple'}
										copiedDayIndex={copiedDayIndex}
										activeDays={activeDays}
										allDays={days}
										onActiveChange={(active) => handleDayChange(index, 'isActive', active)}
										onModeChange={(mode) => handleModeChange(index, day.dayOfWeek, mode)}
										onTimeBlockChange={(blockIndex, field, value) => handleTimeBlockChange(index, blockIndex, field, value)}
										onAddTimeBlock={() => addTimeBlock(index)}
										onRemoveTimeBlock={(blockIndex) => removeTimeBlock(index, blockIndex)}
										onCopySettings={copyDaySettings}
									/>
								)
							})}
						</div>

						<div className={s.dayGroup}>
							<Text size="sm" fw={600} c="dimmed" className={s.groupLabel}>
								Выходные дни
							</Text>
							{days.filter(day => isWeekend(day.dayOfWeek)).map((day) => {
								const index = days.findIndex(d => d.id === day.id)
								const activeDays = days.filter(d => d.isActive && d.id !== day.id)

								return (
									<DayCard
										key={day.id}
										day={day}
										dayIndex={index}
										mode={dayModes[day.dayOfWeek] || 'simple'}
										copiedDayIndex={copiedDayIndex}
										activeDays={activeDays}
										allDays={days}
										onActiveChange={(active) => handleDayChange(index, 'isActive', active)}
										onModeChange={(mode) => handleModeChange(index, day.dayOfWeek, mode)}
										onTimeBlockChange={(blockIndex, field, value) => handleTimeBlockChange(index, blockIndex, field, value)}
										onAddTimeBlock={() => addTimeBlock(index)}
										onRemoveTimeBlock={(blockIndex) => removeTimeBlock(index, blockIndex)}
										onCopySettings={copyDaySettings}
									/>
								)
							})}
						</div>
					</div>

					<div className={s.actions}>
						<Button type="submit" disabled={updateMutation.isPending} size="lg" fullWidth>
							{updateMutation.isPending ? 'Сохранение...' : 'Сохранить расписание'}
						</Button>
					</div>
				</form>
			</div>
		</Layout>
	)
}

export const Component = Schedule
