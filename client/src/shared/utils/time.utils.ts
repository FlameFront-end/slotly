/**
 * Утилиты для работы со временем
 */

/**
 * Парсит время в формате HH:mm в минуты с начала дня
 * @param time - время в формате HH:mm
 * @returns количество минут с начала дня
 */
export const parseTimeToMinutes = (time: string): number => {
	const [hours, minutes] = time.split(':').map(Number)
	return hours * 60 + minutes
}

/**
 * Форматирует количество минут в формат времени HH:mm
 * @param totalMinutes - количество минут с начала дня
 * @returns время в формате HH:mm
 */
export const formatMinutesToTime = (totalMinutes: number): string => {
	const clamped = Math.min(totalMinutes, 23 * 60 + 59)
	const hours = Math.floor(clamped / 60)
	const minutes = clamped % 60
	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/**
 * Вычисляет время окончания на основе времени начала и длительности
 * @param startTime - время начала в формате HH:mm
 * @param durationMinutes - длительность в минутах
 * @returns время окончания в формате HH:mm
 */
export const calculateEndTime = (startTime: string, durationMinutes: number): string => {
	const startMinutes = parseTimeToMinutes(startTime)
	return formatMinutesToTime(startMinutes + durationMinutes)
}
