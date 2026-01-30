export const validateTelegram = (value: string): string => {
	if (!value.trim()) return 'Укажите Telegram'
	
	const trimmed = value.trim()
	
	if ((trimmed.startsWith('http://') || trimmed.startsWith('https://')) && !trimmed.includes('t.me/')) {
		return 'Это не Telegram ссылка. Укажите Telegram username (например, @username) или ссылку t.me/username'
	}
	
	if (trimmed.startsWith('@') && (trimmed.slice(1).startsWith('http://') || trimmed.slice(1).startsWith('https://'))) {
		return 'Укажите Telegram username без символа @ перед URL. Используйте формат: @username или t.me/username'
	}
	
	let cleaned = trimmed
	if (cleaned.startsWith('@')) {
		cleaned = cleaned.slice(1)
	} else if (cleaned.includes('t.me/')) {
		const match = cleaned.match(/t\.me\/([a-zA-Z0-9_]+)/)
		if (match) {
			cleaned = match[1]
		} else {
			return 'Некорректный формат Telegram ссылки. Используйте: @username или t.me/username'
		}
	}
	
	cleaned = cleaned.replace(/^https?:\/\//, '').replace(/^www\./, '')
	
	if (cleaned.length < 5) return 'Telegram username должен содержать минимум 5 символов'
	if (!/^[a-zA-Z0-9_]+$/.test(cleaned)) {
		return 'Telegram username может содержать только латинские буквы, цифры и подчеркивание. Пример: @username123'
	}
	if (cleaned.length > 32) return 'Telegram username не может быть длиннее 32 символов'
	return ''
}

export const validateEmail = (value: string): string => {
	if (!value.trim()) return 'Укажите email'
	const trimmedValue = value.trim()
	const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
	if (!emailRegex.test(trimmedValue)) return 'Введите корректный email адрес'
	if (trimmedValue.length > 254) return 'Email слишком длинный'
	return ''
}

export const validatePhone = (value: string): string => {
	if (!value.trim()) return 'Укажите номер телефона'
	const digits = value.replace(/\D/g, '')
	if (digits.length === 0) return 'Укажите номер телефона'
	if (digits.length < 11) return 'Номер телефона должен содержать 11 цифр'
	if (digits.length > 11) return 'Номер телефона не может содержать более 11 цифр'
	if (!digits.startsWith('7')) return 'Номер должен начинаться с +7'
	if (digits.length === 11 && digits[1] !== '9' && !['4', '5', '6', '7', '8'].includes(digits[1])) {
		return 'Некорректный формат номера телефона'
	}
	return ''
}

export const formatPhoneNumber = (value: string): string => {
	const digits = value.replace(/\D/g, '')

	if (!digits) return ''

	let phoneDigits = digits.startsWith('8') ? '7' + digits.slice(1) : digits

	if (!phoneDigits.startsWith('7')) {
		phoneDigits = '7' + phoneDigits
	}

	phoneDigits = phoneDigits.slice(0, 11)

	if (phoneDigits.length === 0) return ''
	if (phoneDigits.length === 1) return '+7'
	if (phoneDigits.length <= 4) return `+7 (${phoneDigits.slice(1)}`
	if (phoneDigits.length <= 7) return `+7 (${phoneDigits.slice(1, 4)}) ${phoneDigits.slice(4)}`
	if (phoneDigits.length <= 9) return `+7 (${phoneDigits.slice(1, 4)}) ${phoneDigits.slice(4, 7)}-${phoneDigits.slice(7)}`
	return `+7 (${phoneDigits.slice(1, 4)}) ${phoneDigits.slice(4, 7)}-${phoneDigits.slice(7, 9)}-${phoneDigits.slice(9, 11)}`
}
