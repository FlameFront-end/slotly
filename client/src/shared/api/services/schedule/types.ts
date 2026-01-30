export interface TimeBlock {
	startTime: string // HH:mm
	endTime: string // HH:mm
	slotDuration: number // minutes
}

export interface ScheduleDay {
	id: string
	dayOfWeek: number // 0-6 (Sunday-Saturday)
	timeBlocks: TimeBlock[] // Массив временных блоков для более гибкой настройки
	isActive: boolean
}

export interface ScheduleException {
	id: string
	date: string // YYYY-MM-DD
	isAvailable?: boolean // По умолчанию true, если дата добавлена
	startTime?: string
	endTime?: string
}

export interface Schedule {
	days: ScheduleDay[]
	bookingRangeMonths?: number
	exceptions: ScheduleException[]
}

export interface UpdateSchedulePayload {
	days: Omit<ScheduleDay, 'id'>[]
	bookingRangeMonths?: number
	exceptions?: Omit<ScheduleException, 'id'>[]
}

export interface AvailableSlot {
	date: string // YYYY-MM-DD
	time: string // HH:mm
	slotDuration?: number // minutes - длительность слота из расписания
}
