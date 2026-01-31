import { useState, useEffect, useMemo, useCallback } from 'react'
import dayjs from 'dayjs'
import { notifications } from '@mantine/notifications'

import { useSchedule, useUpdateSchedule } from '@/shared/api/services/schedule'
import { getErrorMessage } from '@/shared/lib'
import { type ScheduleDay, type ScheduleException, type TimeBlock } from '@/shared/api/services/schedule/types'
import { type Service } from '@/shared/api/services/services/types'
import { parseTimeToMinutes, formatMinutesToTime, calculateEndTime } from '@/shared/utils/time.utils'
import { migrateScheduleDay, DAYS_OF_WEEK, createDefaultSchedule } from '../utils/schedule.utils'

const DEFAULT_START_TIME = '09:00'
const DEFAULT_END_TIME = '18:00'
const DEFAULT_SLOT_DURATION = 60
const DEFAULT_BOOKING_RANGE_MONTHS = 2

export const useScheduleForm = (services: Service[] = []) => {
	const { data: schedule, isLoading } = useSchedule()
	const updateMutation = useUpdateSchedule()

	const [days, setDays] = useState<ScheduleDay[]>([])
	const [dayModes, setDayModes] = useState<Record<number, 'simple' | 'advanced'>>({})
	const [copiedDayIndex, setCopiedDayIndex] = useState<number | null>(null)
	const [bookingRangeMonths, setBookingRangeMonths] = useState<number>(DEFAULT_BOOKING_RANGE_MONTHS)
	const [exceptions, setExceptions] = useState<ScheduleException[]>([])

	const hasActiveServices = useMemo(
		() => services.some(s => s.isActive),
		[services]
	)

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
			setBookingRangeMonths(schedule.bookingRangeMonths || DEFAULT_BOOKING_RANGE_MONTHS)
			setExceptions(schedule.exceptions || [])
			const modes: Record<number, 'simple' | 'advanced'> = {}
			allDays.forEach(day => {
				modes[day.dayOfWeek] = day.timeBlocks.length > 1 ? 'advanced' : 'simple'
			})
			setDayModes(modes)
		} else {
			setDays(defaultDays)
			setDayModes(defaultModes)
			setBookingRangeMonths(DEFAULT_BOOKING_RANGE_MONTHS)
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
								startTime: DEFAULT_START_TIME,
								endTime: calculateEndTime(DEFAULT_START_TIME, DEFAULT_SLOT_DURATION),
								slotDuration: DEFAULT_SLOT_DURATION
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
					if (i === dayIndex) {
						// Оставляем только первый блок и очищаем serviceId
						const firstBlock = { ...day.timeBlocks[0] }
						delete firstBlock.serviceId
						
						// Пересчитываем endTime на основе slotDuration (без услуги)
						firstBlock.endTime = calculateEndTimeForBlock(
							firstBlock.startTime,
							null,
							firstBlock.slotDuration
						)
						
						return {
							...day,
							timeBlocks: [firstBlock]
						}
					}
					return day
				})
			)
		}
	}

	const calculateEndTimeForBlock = useCallback((
		startTime: string,
		serviceId: string | null | undefined,
		slotDuration: number
	): string => {
		// Если выбрана услуга, используем её длительность
		if (serviceId) {
			const service = services.find(s => s.id === serviceId)
			if (service?.duration) {
				return calculateEndTime(startTime, service.duration)
			}
		}
		
		// Иначе используем slotDuration
		return calculateEndTime(startTime, slotDuration)
	}, [services])

	const handleTimeBlockChange = (
		dayIndex: number,
		blockIndex: number,
		field: keyof TimeBlock,
		value: string | number | null
	): void => {
		setDays(prev =>
			prev.map((day, i) => {
				if (i === dayIndex) {
					const newTimeBlocks = [...day.timeBlocks]
					const currentBlock = { ...newTimeBlocks[blockIndex] }
					
					// Обновляем изменённое поле
					currentBlock[field] = value
					
					// Автоматически пересчитываем endTime при изменении startTime, serviceId или slotDuration
					const shouldRecalculateEndTime = field === 'startTime' || field === 'serviceId' || field === 'slotDuration'
					if (shouldRecalculateEndTime) {
						const startTime = field === 'startTime' ? (value as string) : currentBlock.startTime
						const serviceId = field === 'serviceId' ? (value as string | null) : currentBlock.serviceId
						const slotDuration = field === 'slotDuration' ? (value as number) : currentBlock.slotDuration
						
						currentBlock.endTime = calculateEndTimeForBlock(startTime, serviceId, slotDuration)
					}
					
					newTimeBlocks[blockIndex] = currentBlock
					return { ...day, timeBlocks: newTimeBlocks }
				}
				return day
			})
		)
	}


	const addTimeBlocks = useCallback((
		dayIndex: number,
		count: number = 1,
		durationMinutes: number = DEFAULT_SLOT_DURATION,
		serviceId?: string | null
	): void => {
		setDays(prev =>
			prev.map((day, i) => {
				if (i !== dayIndex) return day

				const newBlocks = [...day.timeBlocks]
				const lastBlock = newBlocks[newBlocks.length - 1]
				const safeDuration = Number.isFinite(durationMinutes) && durationMinutes > 0 
					? durationMinutes 
					: DEFAULT_SLOT_DURATION
				let startTime = lastBlock?.endTime || DEFAULT_START_TIME

				// Если есть активные услуги, serviceId обязателен
				const finalServiceId = hasActiveServices && !serviceId ? null : (serviceId || null)

				for (let idx = 0; idx < count; idx += 1) {
					// Если выбрана услуга, используем её длительность, иначе используем durationMinutes
					const selectedService = finalServiceId ? services.find(s => s.id === finalServiceId) : null
					const blockDuration = selectedService?.duration || safeDuration
					
					const endTime = calculateEndTimeForBlock(startTime, finalServiceId, blockDuration)
					
					newBlocks.push({
						startTime,
						endTime,
						slotDuration: blockDuration,
						serviceId: finalServiceId
					})
					startTime = endTime
				}
				
				return {
					...day,
					timeBlocks: newBlocks
				}
			})
		)
	}, [services, hasActiveServices, calculateEndTimeForBlock])

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
				startTime: baseBlock?.startTime || DEFAULT_START_TIME,
				endTime: baseBlock?.endTime || DEFAULT_END_TIME
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
