import { useState, useEffect } from 'react'
import { notifications } from '@mantine/notifications'
import { useOwnerProfile, useUpdateOwnerProfile } from '@/shared/api/services/owner'
import { getErrorMessage } from '@/shared/lib'
import { CUSTOM_TIMEZONE_VALUE, TIMEZONES } from '@/shared/model/timezones'
import type { ContactMethods, SocialLinksConfig, FormData } from '../types'

export const useProfileForm = () => {
	const { data: profile, isLoading } = useOwnerProfile()
	const updateMutation = useUpdateOwnerProfile()

	const [formData, setFormData] = useState<FormData>({
		name: '',
		description: '',
		contact: '',
		email: '',
		telegram: '',
		phone: '',
		address: '',
		website: '',
		socialLinks: '',
		timezone: 'Europe/Moscow',
		contactMethods: {
			telegram: { enabled: false, value: '' },
			email: { enabled: false, value: '' },
			phone: { enabled: false, value: '' },
			whatsapp: { enabled: false, value: '' }
		},
		socialLinksConfig: {
			instagram: { enabled: false, value: '' },
			vk: { enabled: false, value: '' },
			facebook: { enabled: false, value: '' },
			youtube: { enabled: false, value: '' },
			tiktok: { enabled: false, value: '' },
			ok: { enabled: false, value: '' }
		},
		mapLink: ''
	})

	const [contactError, setContactError] = useState('')
	const [customTimezone, setCustomTimezone] = useState('')
	const [isCustomTimezone, setIsCustomTimezone] = useState(false)

	useEffect(() => {
		if (profile) {
			const profileTimezone = profile.timezone || 'Europe/Moscow'
			const isCustom = !TIMEZONES.some(tz => tz.value === profileTimezone && tz.value !== CUSTOM_TIMEZONE_VALUE)

			const contact = profile.contact || ''
			const isEmail = contact.includes('@') && !contact.startsWith('@') && !contact.startsWith('t.me/')
			const isTelegram = contact.startsWith('@') || contact.startsWith('t.me/')

			const profileContactMethods = profile.contactMethods || {}
			const contactMethods: ContactMethods = {
				telegram: profileContactMethods.telegram || { enabled: false, value: '' },
				email: profileContactMethods.email || { enabled: false, value: '' },
				phone: profileContactMethods.phone || { enabled: false, value: '' },
				whatsapp: profileContactMethods.whatsapp || { enabled: false, value: '' }
			}

			if (!profile.contactMethods) {
				if (isEmail) {
					contactMethods.email = { enabled: true, value: contact }
				} else if (isTelegram) {
					contactMethods.telegram = { enabled: true, value: contact }
				}
			}

			const profileSocialLinks = profile.socialLinks || {}
			const socialLinksConfig: SocialLinksConfig = {
				instagram: profileSocialLinks.instagram || { enabled: false, value: '' },
				vk: profileSocialLinks.vk || { enabled: false, value: '' },
				facebook: profileSocialLinks.facebook || { enabled: false, value: '' },
				youtube: profileSocialLinks.youtube || { enabled: false, value: '' },
				tiktok: profileSocialLinks.tiktok || { enabled: false, value: '' },
				ok: profileSocialLinks.ok || { enabled: false, value: '' }
			}

			setFormData({
				name: profile.name || '',
				description: profile.description || '',
				contact: '',
				email: contactMethods.email.value || (isEmail ? contact : ''),
				telegram: contactMethods.telegram.value || (isTelegram ? contact : ''),
				phone: contactMethods.phone.value || '',
				address: profile.address || '',
				website: profile.website || '',
				socialLinks: '',
				timezone: isCustom ? CUSTOM_TIMEZONE_VALUE : profileTimezone,
				contactMethods,
				socialLinksConfig,
				mapLink: profile.mapLink || ''
			})

			if (isCustom) {
				setCustomTimezone(profileTimezone)
				setIsCustomTimezone(true)
			} else {
				setCustomTimezone('')
				setIsCustomTimezone(false)
			}
		}
	}, [profile])

	useEffect(() => {
		const hasEnabledMethod = Object.values(formData.contactMethods).some(method => method.enabled)

		if (!hasEnabledMethod) {
			setContactError('Включите хотя бы один способ связи, который клиент сможет указать при записи')
		} else {
			setContactError('')
		}
	}, [formData.contactMethods])

	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault()

		try {
			const timezoneToSave = isCustomTimezone && customTimezone ? customTimezone : formData.timezone

			const socialLinks: SocialLinksConfig = {
				instagram: formData.socialLinksConfig.instagram.enabled && formData.socialLinksConfig.instagram.value.trim()
					? { enabled: true, value: formData.socialLinksConfig.instagram.value.trim() }
					: { enabled: false, value: '' },
				vk: formData.socialLinksConfig.vk.enabled && formData.socialLinksConfig.vk.value.trim()
					? { enabled: true, value: formData.socialLinksConfig.vk.value.trim() }
					: { enabled: false, value: '' },
				facebook: formData.socialLinksConfig.facebook.enabled && formData.socialLinksConfig.facebook.value.trim()
					? { enabled: true, value: formData.socialLinksConfig.facebook.value.trim() }
					: { enabled: false, value: '' },
				youtube: formData.socialLinksConfig.youtube.enabled && formData.socialLinksConfig.youtube.value.trim()
					? { enabled: true, value: formData.socialLinksConfig.youtube.value.trim() }
					: { enabled: false, value: '' },
				tiktok: formData.socialLinksConfig.tiktok.enabled && formData.socialLinksConfig.tiktok.value.trim()
					? { enabled: true, value: formData.socialLinksConfig.tiktok.value.trim() }
					: { enabled: false, value: '' },
				ok: formData.socialLinksConfig.ok.enabled && formData.socialLinksConfig.ok.value.trim()
					? { enabled: true, value: formData.socialLinksConfig.ok.value.trim() }
					: { enabled: false, value: '' }
			}

			const contactMethodsToSave: import('@/shared/api/services/owner/types').ContactMethods = {
				telegram: formData.contactMethods.telegram.enabled ? { enabled: true, value: '' } : undefined,
				email: formData.contactMethods.email.enabled ? { enabled: true, value: '' } : undefined,
				phone: formData.contactMethods.phone.enabled ? { enabled: true, value: '' } : undefined,
				whatsapp: formData.contactMethods.whatsapp.enabled ? { enabled: true, value: '' } : undefined
			}

			const socialLinksToSave: import('@/shared/api/services/owner/types').SocialLinks = {
				instagram: socialLinks.instagram.enabled ? { enabled: true, value: socialLinks.instagram.value } : undefined,
				vk: socialLinks.vk.enabled ? { enabled: true, value: socialLinks.vk.value } : undefined,
				facebook: socialLinks.facebook.enabled ? { enabled: true, value: socialLinks.facebook.value } : undefined,
				youtube: socialLinks.youtube.enabled ? { enabled: true, value: socialLinks.youtube.value } : undefined,
				tiktok: socialLinks.tiktok.enabled ? { enabled: true, value: socialLinks.tiktok.value } : undefined,
				ok: socialLinks.ok.enabled ? { enabled: true, value: socialLinks.ok.value } : undefined
			}

			await updateMutation.mutateAsync({
				name: formData.name,
				description: formData.description,
				contact: '',
				timezone: timezoneToSave,
				contactMethods: contactMethodsToSave,
				socialLinks: socialLinksToSave,
				address: formData.address.trim() || undefined,
				mapLink: formData.mapLink.trim() || undefined,
				website: formData.website.trim() || undefined
			})
			notifications.show({
				title: 'Успешно',
				message: 'Профиль обновлён',
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
		profile,
		isLoading,
		formData,
		setFormData,
		contactError,
		customTimezone,
		setCustomTimezone,
		isCustomTimezone,
		setIsCustomTimezone,
		handleSubmit,
		isPending: updateMutation.isPending
	}
}
