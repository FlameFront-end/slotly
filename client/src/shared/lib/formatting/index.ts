export const formatTelegramValue = (value: string): string => {
	let telegramValue = value.trim()

	if (telegramValue.startsWith('http://') || telegramValue.startsWith('https://')) {
		if (telegramValue.includes('t.me/')) {
			telegramValue = telegramValue.replace(/^https?:\/\//, '').replace(/^www\./, '')
			if (!telegramValue.startsWith('t.me/')) {
				const match = telegramValue.match(/t\.me\/(.+)/)
				if (match) {
					telegramValue = `t.me/${match[1]}`
				}
			}
		}
	} else if (telegramValue.includes('t.me/')) {
		telegramValue = telegramValue.replace(/^www\./, '')
		if (!telegramValue.startsWith('t.me/')) {
			const match = telegramValue.match(/t\.me\/(.+)/)
			if (match) {
				telegramValue = `t.me/${match[1]}`
			}
		}
	} else if (telegramValue.startsWith('@')) {
		const withoutAt = telegramValue.slice(1)
		if (withoutAt.startsWith('http://') || withoutAt.startsWith('https://')) {
			telegramValue = withoutAt
		}
	} else if (telegramValue) {
		telegramValue = `@${telegramValue.replace(/^@+/, '')}`
	}

	return telegramValue
}

export const formatSocialLink = (type: string, value: string): string => {
	if (value.startsWith('http://') || value.startsWith('https://')) return value
	if (type === 'instagram') {
		if (value.startsWith('@')) return `https://instagram.com/${value.slice(1)}`
		if (value.startsWith('instagram.com/')) return `https://${value}`
		return `https://instagram.com/${value.replace('@', '')}`
	}
	if (type === 'vk') {
		if (value.startsWith('vk.com/')) return `https://${value}`
		return `https://vk.com/${value}`
	}
	if (type === 'facebook') {
		if (value.startsWith('facebook.com/')) return `https://${value}`
		return `https://facebook.com/${value}`
	}
	if (type === 'youtube') {
		if (value.startsWith('youtube.com/') || value.startsWith('youtu.be/')) return `https://${value}`
		return `https://youtube.com/${value}`
	}
	if (type === 'tiktok') {
		if (value.startsWith('@')) return `https://tiktok.com/${value}`
		if (value.startsWith('tiktok.com/')) return `https://${value}`
		return `https://tiktok.com/@${value.replace('@', '')}`
	}
	if (type === 'ok') {
		if (value.startsWith('ok.ru/')) return `https://${value}`
		return `https://ok.ru/${value}`
	}
	return value
}

export const formatWebsiteUrl = (url: string): string => {
	if (url.startsWith('http://') || url.startsWith('https://')) return url
	return `https://${url}`
}

export const formatWebsiteDisplay = (url: string): string => {
	if (!url) return ''
	
	// Удаляем протокол и www
	let display = url.replace(/^https?:\/\//, '').replace(/^www\./, '')
	
	// Если URL очень длинный (больше 40 символов), показываем только домен
	if (display.length > 40) {
		try {
			const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
			const hostname = urlObj.hostname.replace(/^www\./, '')
			
			// Если домен сам по себе длинный, обрезаем его
			if (hostname.length > 30) {
				return `${hostname.substring(0, 27)}...`
			}
			
			return hostname
		} catch {
			// Если не удалось распарсить URL, просто обрезаем
			return display.length > 40 ? `${display.substring(0, 37)}...` : display
		}
	}
	
	return display
}
