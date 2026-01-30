export interface ContactMethods {
	telegram: { enabled: boolean; value: string }
	email: { enabled: boolean; value: string }
	phone: { enabled: boolean; value: string }
	whatsapp: { enabled: boolean; value: string }
}

export interface SocialLinksConfig {
	instagram: { enabled: boolean; value: string }
	vk: { enabled: boolean; value: string }
	facebook: { enabled: boolean; value: string }
	youtube: { enabled: boolean; value: string }
	tiktok: { enabled: boolean; value: string }
	ok: { enabled: boolean; value: string }
}

export interface FormData {
	name: string
	description: string
	contact: string
	email: string
	telegram: string
	phone: string
	address: string
	website: string
	socialLinks: string
	timezone: string
	contactMethods: ContactMethods
	socialLinksConfig: SocialLinksConfig
	mapLink: string
}
