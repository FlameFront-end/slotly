import { type FC } from 'react'
import { Text, Select } from '@mantine/core'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

import { Button, Loader } from '@/shared/kit'
import { Layout } from '@/shared/widgets'
import { useScheduleForm } from '../hooks/useScheduleForm'
import { isWeekday, isWeekend } from '../utils/schedule.utils'
import { DayCard, ExactDatesSection } from '../components'

import s from './Schedule.module.scss'

dayjs.locale('ru')

const Schedule: FC = () => {
	const {
		days,
		dayModes,
		copiedDayIndex,
		bookingRangeMonths,
		setBookingRangeMonths,
		exceptions,
		addExceptionDate,
		removeExceptionDate,
		updateException,
		isLoading,
		updateMutation,
		handleDayChange,
		handleModeChange,
		handleTimeBlockChange,
		addTimeBlocks,
		removeTimeBlock,
		copyDaySettings,
		handleSubmit
	} = useScheduleForm()

	const periodEnd = dayjs().add(Math.max(bookingRangeMonths - 1, 0), 'month')
	const periodLabel = bookingRangeMonths <= 1
		? dayjs().format('MMMM YYYY')
		: `${dayjs().format('MMMM YYYY')} — ${periodEnd.format('MMMM YYYY')}`
	const activeDaysCount = days.filter(day => day.isActive).length

	if (isLoading) {
		return (
			<Layout>
				<div className={s.schedule}>
					<div className={s.header}>
						<div className={s.headerTop}>
							<h1 className={s.title}>Расписание</h1>
							<p className={s.subtitle}>Настройте время приёма и доступность для записи</p>
						</div>
						<div className={s.headerSettings}>
							<Text size="xs" c="dimmed" className={s.periodLabel}>Доступна запись на</Text>
							<div className={s.periodRow}>
								<Select
									value={String(bookingRangeMonths)}
									onChange={value => setBookingRangeMonths(Number(value) || 2)}
									data={[
										{ value: '1', label: '1 месяц' },
										{ value: '2', label: '2 месяца' },
										{ value: '3', label: '3 месяца' },
										{ value: '6', label: '6 месяцев' },
										{ value: '12', label: '12 месяцев' }
									]}
									size="sm"
									className={s.periodSelect}
								/>
								<Text size="xs" c="dimmed" className={s.periodHint}>
									{periodLabel}
								</Text>
								{activeDaysCount > 0 && (
									<div className={s.activeDaysBadge}>
										Активных дней: <span className={s.activeDaysCount}>{activeDaysCount}</span>
									</div>
								)}
							</div>
						</div>
					</div>
					<Loader message="Загрузка расписания..." />
				</div>
			</Layout>
		)
	}

	return (
		<Layout>
			<div className={s.schedule}>
				<div className={s.header}>
					<div className={s.headerTop}>
						<h1 className={s.title}>Расписание</h1>
						<p className={s.subtitle}>Настройте время приёма и доступность для записи</p>
					</div>
					<div className={s.headerSettings}>
						<Text size="xs" c="dimmed" className={s.periodLabel}>Доступна запись на</Text>
						<div className={s.periodRow}>
							<Select
								value={String(bookingRangeMonths)}
								onChange={value => setBookingRangeMonths(Number(value) || 2)}
								data={[
									{ value: '1', label: '1 месяц' },
									{ value: '2', label: '2 месяца' },
									{ value: '3', label: '3 месяца' },
									{ value: '6', label: '6 месяцев' },
									{ value: '12', label: '12 месяцев' }
								]}
								size="sm"
								className={s.periodSelect}
							/>
							<Text size="xs" c="dimmed" className={s.periodHint}>
								{periodLabel}
							</Text>
							{activeDaysCount > 0 && (
								<div className={s.activeDaysBadge}>
									Активных дней: <span className={s.activeDaysCount}>{activeDaysCount}</span>
								</div>
							)}
						</div>
					</div>
				</div>

				<form onSubmit={handleSubmit} className={s.form}>
					<div className={s.exceptionsSection}>
						<ExactDatesSection
							exceptions={exceptions}
							onAddDate={addExceptionDate}
							onRemoveDate={removeExceptionDate}
							onUpdateDate={updateException}
						/>
					</div>
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
										onAddTimeBlock={(count, durationMinutes) => addTimeBlocks(index, count, durationMinutes)}
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
										onAddTimeBlock={(count, durationMinutes) => addTimeBlocks(index, count, durationMinutes)}
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
