import { type ScheduleDay } from '@/shared/api/services/schedule/types'

export const DAYS_OF_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

export const WEEKDAYS = [1, 2, 3, 4, 5]
export const WEEKENDS = [0, 6]

type LegacyScheduleDay = Partial<ScheduleDay> & {
	startTime?: string
	endTime?: string
	slotDuration?: number
	dayOfWeek: number
}

export const migrateScheduleDay = (day: LegacyScheduleDay | ScheduleDay): ScheduleDay => {
	if ('timeBlocks' in day && Array.isArray(day.timeBlocks)) {
		return day as ScheduleDay
	}

	const legacyDay = day as LegacyScheduleDay
	if (legacyDay.startTime && legacyDay.endTime && legacyDay.slotDuration !== undefined) {
		return {
			id: legacyDay.id || `day-${legacyDay.dayOfWeek}`,
			dayOfWeek: legacyDay.dayOfWeek,
			isActive: legacyDay.isActive ?? false,
			timeBlocks: [
				{
					startTime: legacyDay.startTime,
					endTime: legacyDay.endTime,
					slotDuration: legacyDay.slotDuration
				}
			]
		}
	}

	return {
		id: day.id || `day-${day.dayOfWeek}`,
		dayOfWeek: day.dayOfWeek,
		isActive: false,
		timeBlocks: [
			{
				startTime: '09:00',
				endTime: '18:00',
				slotDuration: 60
			}
		]
	}
}

export const formatTimeRange = (day: ScheduleDay): string => {
	if (!day.isActive || day.timeBlocks.length === 0) return ''
	if (day.timeBlocks.length === 1) {
		return `${day.timeBlocks[0].startTime} - ${day.timeBlocks[0].endTime}`
	}
	return `${day.timeBlocks.length} блоков`
}

export const isWeekend = (dayOfWeek: number): boolean => WEEKENDS.includes(dayOfWeek)

export const isWeekday = (dayOfWeek: number): boolean => WEEKDAYS.includes(dayOfWeek)

export const createDefaultSchedule = (): ScheduleDay[] => {
	return DAYS_OF_WEEK.map((_, index) => ({
		id: `day-${index}`,
		dayOfWeek: index,
		timeBlocks: [
			{
				startTime: '09:00',
				endTime: '18:00',
				slotDuration: 60
			}
		],
		isActive: false
	}))
}
