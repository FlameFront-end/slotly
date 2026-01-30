import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { notifications } from '@mantine/notifications'

import { useSchedule, useUpdateSchedule } from '@/shared/api/services/schedule'
import { getErrorMessage } from '@/shared/lib'
import { type ScheduleDay, type ScheduleException, type TimeBlock } from '@/shared/api/services/schedule/types'
import { migrateScheduleDay, DAYS_OF_WEEK, createDefaultSchedule } from '../utils/schedule.utils'

export const useScheduleForm = () => {
	const { data: schedule, isLoading } = useSchedule()
	const updateMutation = useUpdateSchedule()

	const [days, setDays] = useState<ScheduleDay[]>([])
	const [dayModes, setDayModes] = useState<Record<number, 'simple' | 'advanced'>>({})
	const [copiedDayIndex, setCopiedDayIndex] = useState<number | null>(null)
	const [bookingRangeMonths, setBookingRangeMonths] = useState<number>(2)
	const [exceptions, setExceptions] = useState<ScheduleException[]>([])

	useEffect(() => {
		const defaultDays = createDefaultSchedule()
		const defaultModes: Record<number, 'simple' | 'advanced'> = {}
		DAYS_OF_WEEK.forEach((_, index) => {
			defaultModes[index] = 'simple'
		})

		if (schedule && schedule.days && schedule.days.length > 0) {
			const migratedDays = schedule.days.map(migrateScheduleDay)
			// Объединяем с днями по умолчанию, чтобы гарантировать наличие всех 7 дней
			const daysMap = new Map<number, ScheduleDay>()
			defaultDays.forEach(day => daysMap.set(day.dayOfWeek, day))
			migratedDays.forEach(day => daysMap.set(day.dayOfWeek, day))
			const allDays = Array.from(daysMap.values()).sort((a, b) => a.dayOfWeek - b.dayOfWeek)
			
			setDays(allDays)
			setBookingRangeMonths(schedule.bookingRangeMonths || 2)
			setExceptions(schedule.exceptions || [])
			const modes: Record<number, 'simple' | 'advanced'> = {}
			allDays.forEach(day => {
				modes[day.dayOfWeek] = day.timeBlocks.length > 1 ? 'advanced' : 'simple'
			})
			setDayModes(modes)
		} else {
			setDays(defaultDays)
			setDayModes(defaultModes)
			setBookingRangeMonths(2)
			setExceptions([])
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

	const parseTimeToMinutes = (time: string): number => {
		const [hours, minutes] = time.split(':').map(Number)
		return hours * 60 + minutes
	}

	const formatMinutesToTime = (totalMinutes: number): string => {
		const clamped = Math.min(totalMinutes, 23 * 60 + 59)
		const hours = Math.floor(clamped / 60)
		const minutes = clamped % 60
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
	}

	const addTimeBlocks = (dayIndex: number, count: number = 1, durationMinutes: number = 60): void => {
		setDays(prev =>
			prev.map((day, i) => {
				if (i === dayIndex) {
					const newBlocks = [...day.timeBlocks]
					const lastBlock = newBlocks[newBlocks.length - 1]
					const safeDuration = Number.isFinite(durationMinutes) && durationMinutes > 0 ? durationMinutes : 60
					let startTime = lastBlock?.endTime || '09:00'

					for (let idx = 0; idx < count; idx += 1) {
						const endTime = formatMinutesToTime(parseTimeToMinutes(startTime) + safeDuration)
						newBlocks.push({
							startTime,
							endTime,
							slotDuration: safeDuration
						})
						startTime = endTime
					}
					return {
						...day,
						timeBlocks: newBlocks
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

	const addExceptionDate = (date: string): void => {
		setExceptions(prev => {
			if (prev.some(item => item.date === date)) {
				return prev
			}
			const dayOfWeek = dayjs(date).day()
			const baseDay = days.find(day => day.dayOfWeek === dayOfWeek)
			const baseBlock = baseDay?.timeBlocks?.[0]
			const newException: ScheduleException = {
				id: `exception-${date}`,
				date,
				isAvailable: true,
				startTime: baseBlock?.startTime || '09:00',
				endTime: baseBlock?.endTime || '18:00'
			}
			return [...prev, newException].sort((a, b) => a.date.localeCompare(b.date))
		})
	}

	const removeExceptionDate = (date: string): void => {
		setExceptions(prev => prev.filter(item => item.date !== date))
	}

	const updateException = (date: string, patch: Partial<ScheduleException>): void => {
		setExceptions(prev =>
			prev.map(item => item.date === date ? { ...item, ...patch } : item)
		)
	}

	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault()

		try {
			await updateMutation.mutateAsync({
				days: days.map(({ id: _id, ...rest }) => rest),
				bookingRangeMonths,
				exceptions: exceptions.map(({ id: _id, ...rest }) => rest)
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
	}
}
