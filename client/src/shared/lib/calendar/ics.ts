/**
 * Генерация .ics файла для добавления события в нативный календарь
 * (Календарь на iOS/macOS, Outlook/Календарь на Windows, Google Calendar и др. на Android)
 */

const ICS_LINE_LIMIT = 75
const ICS_CONTINUATION_LIMIT = 74

function escapeIcsValue(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function foldLine(line: string): string {
	if (line.length <= ICS_LINE_LIMIT) return line + '\r\n'
	const result: string[] = []
	result.push(line.slice(0, ICS_LINE_LIMIT) + '\r\n')
	let remaining = line.slice(ICS_LINE_LIMIT)
	while (remaining.length > 0) {
		const chunk = remaining.slice(0, ICS_CONTINUATION_LIMIT)
		result.push(' ' + chunk + '\r\n')
		remaining = remaining.slice(ICS_CONTINUATION_LIMIT)
	}
	return result.join('')
}

export interface BookingForIcs {
	id: string
	date: string
	time: string
	owner: {
		name: string
		address?: string | null
	}
}

/**
 * Форматирует время в iCalendar format: YYYYMMDDTHHmmss (локальное время)
 */
function formatIcsDateTime(dateStr: string, timeStr: string, durationMinutes: number): { start: string; end: string } {
	const [year, month, day] = dateStr.split('-').map(Number)
	const [hours, minutes] = timeStr.slice(0, 5).split(':').map(Number)

	const start = new Date(year, month - 1, day, hours, minutes, 0)
	const end = new Date(start.getTime() + durationMinutes * 60 * 1000)

	const pad = (n: number) => String(n).padStart(2, '0')
	const format = (d: Date) =>
		`${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`

	return { start: format(start), end: format(end) }
}

/**
 * Возвращает содержимое .ics файла для данной записи
 */
export function buildIcsContent(booking: BookingForIcs, confirmationUrl: string, durationMinutes = 60): string {
	const { start, end } = formatIcsDateTime(booking.date, booking.time, durationMinutes)
	const summary = `Запись к ${booking.owner.name}`
	const description = [
		`Запись на приём к ${escapeIcsValue(booking.owner.name)}.`,
		`Ссылка на детали: ${confirmationUrl}`
	].join(' ')
	const location = booking.owner.address ? escapeIcsValue(booking.owner.address) : ''
	const uid = `${booking.id}@slotly`

	const lines: string[] = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Slotly//Booking//RU',
		'CALSCALE:GREGORIAN',
		'BEGIN:VEVENT',
		`UID:${uid}`,
		`DTSTART:${start}`,
		`DTEND:${end}`,
		`SUMMARY:${escapeIcsValue(summary)}`
	]
	if (description) {
		lines.push(`DESCRIPTION:${escapeIcsValue(description)}`)
	}
	if (location) {
		lines.push(`LOCATION:${location}`)
	}
	lines.push('END:VEVENT', 'END:VCALENDAR')

	return lines.map(foldLine).join('')
}

/**
 * Скачивает .ics файл — пользователь может открыть его и добавить событие в календарь
 */
export function downloadIcsFile(booking: BookingForIcs, confirmationUrl: string): void {
	const content = buildIcsContent(booking, confirmationUrl)
	const blob = new Blob(['\ufeff' + content], { type: 'text/calendar;charset=utf-8' })
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = `zapis-${booking.date}-${booking.owner.name.replace(/\s+/g, '-')}.ics`
	link.click()
	URL.revokeObjectURL(url)
}
