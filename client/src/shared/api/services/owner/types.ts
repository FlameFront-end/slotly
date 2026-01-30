export interface ContactMethods {
	telegram?: {
		enabled: boolean
		value: string // @username или t.me/username
	}
	email?: {
		enabled: boolean
		value: string
	}
	phone?: {
		enabled: boolean
		value: string // +7 (999) 123-45-67
	}
	whatsapp?: {
		enabled: boolean
		value: string // +7 (999) 123-45-67
	}
}

export interface SocialLinks {
	instagram?: {
		enabled: boolean
		value: string // @username или полная ссылка
	}
	vk?: {
		enabled: boolean
		value: string // vk.com/username или полная ссылка
	}
	facebook?: {
		enabled: boolean
		value: string // facebook.com/username или полная ссылка
	}
	youtube?: {
		enabled: boolean
		value: string // youtube.com/@username или полная ссылка
	}
	tiktok?: {
		enabled: boolean
		value: string // @username или полная ссылка
	}
	ok?: {
		enabled: boolean
		value: string // ok.ru/username или полная ссылка
	}
}

export interface OwnerProfile {
	id: string
	name: string
	description: string
	contact: string // Старое поле для обратной совместимости
	timezone: string
	publicId: string
	contactMethods?: ContactMethods
	socialLinks?: SocialLinks
	address?: string
	mapLink?: string // Ссылка на Google Maps, Яндекс.Карты и т.д.
	website?: string
}

export interface UpdateOwnerProfilePayload {
	name?: string
	description?: string
	contact?: string
	timezone?: string
	contactMethods?: ContactMethods
	socialLinks?: SocialLinks
	address?: string
	mapLink?: string
	website?: string
}
