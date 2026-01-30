import { type FC } from 'react'
import { notifications } from '@mantine/notifications'

import { Button, Loader } from '@/shared/kit'
import { Layout } from '@/shared/widgets'
import { useProfileForm } from '../hooks/useProfileForm'
import { BasicInfoSection } from '../components/BasicInfoSection'
import { ContactMethodsSection } from '../components/ContactMethodsSection'
import { LocationSection } from '../components/LocationSection'
import { AdditionalSection } from '../components/AdditionalSection'
import { PublicLinkCard } from '../components/PublicLinkCard'

import s from './Profile.module.scss'

const Profile: FC = () => {
	const {
		profile,
		isLoading,
		formData,
		setFormData,
		contactError,
		contactFieldErrors,
		setContactFieldErrors,
		customTimezone,
		setCustomTimezone,
		isCustomTimezone,
		setIsCustomTimezone,
		handleTelegramBlur,
		handleEmailBlur,
		handlePhoneBlur,
		handleWhatsAppBlur,
		handleSubmit,
		formatPhoneNumber,
		isPending
	} = useProfileForm()

	const publicLink = profile?.publicId
		? `${window.location.origin}/public/booking/${profile.publicId}`
		: ''

	const handleCopyLink = async (): Promise<void> => {
		if (!publicLink) return

		try {
			await navigator.clipboard.writeText(publicLink)
			notifications.show({
				title: 'Скопировано',
				message: 'Ссылка скопирована в буфер обмена',
				color: 'green',
				autoClose: 2000
			})
		} catch {
			const textArea = document.createElement('textarea')
			textArea.value = publicLink
			document.body.appendChild(textArea)
			textArea.select()
			document.execCommand('copy')
			document.body.removeChild(textArea)
			notifications.show({
				title: 'Скопировано',
				message: 'Ссылка скопирована в буфер обмена',
				color: 'green',
				autoClose: 2000
			})
		}
	}

	if (isLoading) {
		return (
			<Layout>
				<div className={s.profile}>
					<div className={s.header}>
						<h1 className={s.title}>Профиль</h1>
						<p className={s.subtitle}>Управление настройками вашего профиля</p>
					</div>
					<Loader message="Загрузка профиля..." />
				</div>
			</Layout>
		)
	}

	return (
		<Layout>
			<div className={s.profile}>
				<div className={s.header}>
					<h1 className={s.title}>Профиль</h1>
					<p className={s.subtitle}>Управление настройками вашего профиля</p>
				</div>

				<form onSubmit={handleSubmit} className={s.form}>
					<BasicInfoSection
						name={formData.name}
						description={formData.description}
						onNameChange={value => setFormData(prev => ({ ...prev, name: value }))}
						onDescriptionChange={value => setFormData(prev => ({ ...prev, description: value }))}
					/>

					<ContactMethodsSection
						contactMethods={formData.contactMethods}
						contactFieldErrors={contactFieldErrors}
						contactError={contactError}
						onChange={contactMethods => setFormData(prev => ({ ...prev, contactMethods }))}
						onSetFieldError={(field, error) => setContactFieldErrors(prev => ({ ...prev, [field]: error }))}
						onTelegramBlur={handleTelegramBlur}
						onEmailBlur={handleEmailBlur}
						onPhoneBlur={handlePhoneBlur}
						onWhatsAppBlur={handleWhatsAppBlur}
						formatPhoneNumber={formatPhoneNumber}
					/>

					<LocationSection
						address={formData.address}
						mapLink={formData.mapLink}
						onAddressChange={value => setFormData(prev => ({ ...prev, address: value }))}
						onMapLinkChange={value => setFormData(prev => ({ ...prev, mapLink: value }))}
					/>

					<AdditionalSection
						website={formData.website}
						socialLinksConfig={formData.socialLinksConfig}
						timezone={formData.timezone}
						customTimezone={customTimezone}
						isCustomTimezone={isCustomTimezone}
						onWebsiteChange={value => setFormData(prev => ({ ...prev, website: value }))}
						onSocialLinksChange={socialLinksConfig => setFormData(prev => ({ ...prev, socialLinksConfig }))}
						onTimezoneChange={value => setFormData(prev => ({ ...prev, timezone: value }))}
						onCustomTimezoneChange={setCustomTimezone}
						onIsCustomTimezoneChange={setIsCustomTimezone}
					/>

					{profile?.publicId && (
						<PublicLinkCard
							publicLink={publicLink}
							onCopy={handleCopyLink}
						/>
					)}

					<div className={s.actions}>
						<Button type="submit" disabled={isPending} size="lg" fullWidth>
							{isPending ? 'Сохранение...' : 'Сохранить изменения'}
						</Button>
					</div>
				</form>
			</div>
		</Layout>
	)
}

export const Component = Profile
