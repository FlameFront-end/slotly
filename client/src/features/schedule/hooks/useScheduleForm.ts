import { useState, useEffect } from 'react'
import { notifications } from '@mantine/notifications'

import { useSchedule, useUpdateSchedule } from '@/shared/api/services/schedule'
import { getErrorMessage } from '@/shared/lib'
import { type ScheduleDay, type TimeBlock } from '@/shared/api/services/schedule/types'
import { migrateScheduleDay, DAYS_OF_WEEK, createDefaultSchedule } from '../utils/schedule.utils'

export const useScheduleForm = () => {
	const { data: schedule, isLoading } = useSchedule()
	const updateMutation = useUpdateSchedule()

	const [days, setDays] = useState<ScheduleDay[]>([])
	const [dayModes, setDayModes] = useState<Record<number, 'simple' | 'advanced'>>({})
	const [copiedDayIndex, setCopiedDayIndex] = useState<number | null>(null)

	useEffect(() => {
		if (schedule) {
			const migratedDays = schedule.days.map(migrateScheduleDay)
			setDays(migratedDays)
			const modes: Record<number, 'simple' | 'advanced'> = {}
			migratedDays.forEach(day => {
				modes[day.dayOfWeek] = day.timeBlocks.length > 1 ? 'advanced' : 'simple'
			})
			setDayModes(modes)
		} else {
			setDays(createDefaultSchedule())
			const defaultModes: Record<number, 'simple' | 'advanced'> = {}
			DAYS_OF_WEEK.forEach((_, index) => {
				defaultModes[index] = 'simple'
			})
			setDayModes(defaultModes)
		}
	}, [schedule])

	const handleDayChange = (index: number, field: keyof ScheduleDay, value: string | number | boolean): void => {
		setDays(prev =>
			prev.map((day, i) => {
				if (i === index) {
					const updatedDay = { ...day, [field]: value }
					if (field === 'isActive' && value === true && (!updatedDay.timeBlocks || updatedDay.timeBlocks.length === 0)) {
						updatedDay.timeBlocks = [
							{
								startTime: '09:00',
								endTime: '18:00',
								slotDuration: 60
							}
						]
					}
					return updatedDay
				}
				return day
			})
		)
	}

	const handleModeChange = (dayIndex: number, dayOfWeek: number, mode: 'simple' | 'advanced'): void => {
		setDayModes(prev => ({ ...prev, [dayOfWeek]: mode }))
		
		if (mode === 'simple') {
			setDays(prev =>
				prev.map((day, i) => {
					if (i === dayIndex && day.timeBlocks.length > 1) {
						return {
							...day,
							timeBlocks: [day.timeBlocks[0]]
						}
					}
					return day
				})
			)
		}
	}

	const handleTimeBlockChange = (
		dayIndex: number,
		blockIndex: number,
		field: keyof TimeBlock,
		value: string | number
	): void => {
		setDays(prev =>
			prev.map((day, i) => {
				if (i === dayIndex) {
					const newTimeBlocks = [...day.timeBlocks]
					newTimeBlocks[blockIndex] = {
						...newTimeBlocks[blockIndex],
						[field]: value
					}
					return { ...day, timeBlocks: newTimeBlocks }
				}
				return day
			})
		)
	}

	const addTimeBlock = (dayIndex: number): void => {
		setDays(prev =>
			prev.map((day, i) => {
				if (i === dayIndex) {
					const lastBlock = day.timeBlocks[day.timeBlocks.length - 1]
					const newBlock: TimeBlock = {
						startTime: lastBlock?.endTime || '09:00',
						endTime: lastBlock?.endTime || '18:00',
						slotDuration: lastBlock?.slotDuration || 60
					}
					return {
						...day,
						timeBlocks: [...day.timeBlocks, newBlock]
					}
				}
				return day
			})
		)
	}

	const removeTimeBlock = (dayIndex: number, blockIndex: number): void => {
		setDays(prev =>
			prev.map((day, i) => {
				if (i === dayIndex && day.timeBlocks.length > 1) {
					return {
						...day,
						timeBlocks: day.timeBlocks.filter((_, idx) => idx !== blockIndex)
					}
				}
				return day
			})
		)
	}

	const copyDaySettings = (sourceIndex: number, targetIndex: number): void => {
		const sourceDay = days[sourceIndex]
		const targetDay = days[targetIndex]
		
		setDays(prev =>
			prev.map((day, i) => {
				if (i === targetIndex) {
					return {
						...day,
						timeBlocks: sourceDay.timeBlocks.map(block => ({ ...block })),
						isActive: sourceDay.isActive
					}
				}
				return day
			})
		)
		
		setDayModes(prev => ({
			...prev,
			[targetDay.dayOfWeek]: prev[sourceDay.dayOfWeek] || 'simple'
		}))
		
		setCopiedDayIndex(targetIndex)
		setTimeout(() => setCopiedDayIndex(null), 2000)
		
		notifications.show({
			title: 'Настройки скопированы',
			message: `Настройки ${DAYS_OF_WEEK[sourceDay.dayOfWeek]} применены к ${DAYS_OF_WEEK[targetDay.dayOfWeek]}`,
			color: 'blue',
			autoClose: 2000
		})
	}

	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault()

		try {
			await updateMutation.mutateAsync({
				days: days.map(({ id: _id, ...rest }) => rest)
			})
			notifications.show({
				title: 'Успешно',
				message: 'Расписание обновлено',
				color: 'green'
			})
		} catch (error: unknown) {
			const message = getErrorMessage(error)
			notifications.show({
				title: 'Ошибка',
				message,
				color: 'red'
			})
		}
	}

	return {
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
	}
}
