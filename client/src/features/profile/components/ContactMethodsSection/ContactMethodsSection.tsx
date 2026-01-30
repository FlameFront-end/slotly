import { type FC } from 'react'
import { Card, Text, Stack, Group, Switch } from '@mantine/core'
import { IconBrandTelegram, IconMail, IconPhone, IconBrandWhatsapp } from '@tabler/icons-react'
import { Input } from '@/shared/kit'
import { formatTelegramValue } from '@/shared/lib/formatting'
import type { ContactMethods } from '../../types'
import s from './ContactMethodsSection.module.scss'

interface ContactFieldErrors {
	telegram: string
	email: string
	phone: string
	whatsapp: string
}

interface Props {
	contactMethods: ContactMethods
	contactFieldErrors: ContactFieldErrors
	contactError: string
	onChange: (contactMethods: ContactMethods) => void
	onSetFieldError: (field: keyof ContactFieldErrors, error: string) => void
	onTelegramBlur: () => void
	onEmailBlur: () => void
	onPhoneBlur: () => void
	onWhatsAppBlur: () => void
	formatPhoneNumber: (value: string) => string
}

export const ContactMethodsSection: FC<Props> = ({
	contactMethods,
	contactFieldErrors,
	contactError,
	onChange,
	onSetFieldError,
	onTelegramBlur,
	onEmailBlur,
	onPhoneBlur,
	onWhatsAppBlur,
	formatPhoneNumber
}) => {
	return (
		<section className={s.section}>
			<h2 className={s.sectionTitle}>Способы связи для клиентов</h2>
			<div className={s.sectionContent}>
				<Text size="sm" c="dimmed" mb="md">
					Выберите способы связи, через которые клиенты смогут с вами связаться при записи
				</Text>

				<Card padding="md" radius="md" withBorder className={s.contactMethodCard}>
					<Stack gap="md">
						<Group justify="space-between" align="center">
							<Group gap="sm">
								<IconBrandTelegram size={20} />
								<Text fw={500}>Telegram</Text>
							</Group>
							<Switch
								checked={contactMethods.telegram.enabled}
								onChange={e => onChange({
									...contactMethods,
									telegram: { ...contactMethods.telegram, enabled: e.currentTarget.checked }
								})}
							/>
						</Group>
						{contactMethods.telegram.enabled && (
							<Input
								value={contactMethods.telegram.value}
								onChange={value => {
									if (contactFieldErrors.telegram) {
										onSetFieldError('telegram', '')
									}
									const formatted = formatTelegramValue(value)
									onChange({
										...contactMethods,
										telegram: { ...contactMethods.telegram, value: formatted }
									})
								}}
								onBlur={onTelegramBlur}
								placeholder="@username или t.me/username"
								size="sm"
								error={contactFieldErrors.telegram || undefined}
							/>
						)}
					</Stack>
				</Card>

				<Card padding="md" radius="md" withBorder className={s.contactMethodCard}>
					<Stack gap="md">
						<Group justify="space-between" align="center">
							<Group gap="sm">
								<IconMail size={20} />
								<Text fw={500}>Email</Text>
							</Group>
							<Switch
								checked={contactMethods.email.enabled}
								onChange={e => onChange({
									...contactMethods,
									email: { ...contactMethods.email, enabled: e.currentTarget.checked }
								})}
							/>
						</Group>
						{contactMethods.email.enabled && (
							<Input
								type="email"
								value={contactMethods.email.value}
								onChange={value => {
									if (contactFieldErrors.email) {
										onSetFieldError('email', '')
									}
									onChange({
										...contactMethods,
										email: { ...contactMethods.email, value }
									})
								}}
								onBlur={onEmailBlur}
								placeholder="example@email.com"
								size="sm"
								error={contactFieldErrors.email || undefined}
							/>
						)}
					</Stack>
				</Card>

				<Card padding="md" radius="md" withBorder className={s.contactMethodCard}>
					<Stack gap="md">
						<Group justify="space-between" align="center">
							<Group gap="sm">
								<IconPhone size={20} />
								<Text fw={500}>Телефон (звонок)</Text>
							</Group>
							<Switch
								checked={contactMethods.phone.enabled}
								onChange={e => onChange({
									...contactMethods,
									phone: { ...contactMethods.phone, enabled: e.currentTarget.checked }
								})}
							/>
						</Group>
						{contactMethods.phone.enabled && (
							<Input
								type="tel"
								value={contactMethods.phone.value}
								onChange={value => {
									if (contactFieldErrors.phone) {
										onSetFieldError('phone', '')
									}
									const formatted = formatPhoneNumber(value)
									onChange({
										...contactMethods,
										phone: { ...contactMethods.phone, value: formatted }
									})
								}}
								onBlur={onPhoneBlur}
								placeholder="+7 (999) 123-45-67"
								size="sm"
								maxLength={18}
								error={contactFieldErrors.phone || undefined}
							/>
						)}
					</Stack>
				</Card>

				<Card padding="md" radius="md" withBorder className={s.contactMethodCard}>
					<Stack gap="md">
						<Group justify="space-between" align="center">
							<Group gap="sm">
								<IconBrandWhatsapp size={20} />
								<Text fw={500}>WhatsApp</Text>
							</Group>
							<Switch
								checked={contactMethods.whatsapp.enabled}
								onChange={e => onChange({
									...contactMethods,
									whatsapp: { ...contactMethods.whatsapp, enabled: e.currentTarget.checked }
								})}
							/>
						</Group>
						{contactMethods.whatsapp.enabled && (
							<Input
								type="tel"
								value={contactMethods.whatsapp.value}
								onChange={value => {
									if (contactFieldErrors.whatsapp) {
										onSetFieldError('whatsapp', '')
									}
									const formatted = formatPhoneNumber(value)
									onChange({
										...contactMethods,
										whatsapp: { ...contactMethods.whatsapp, value: formatted }
									})
								}}
								onBlur={onWhatsAppBlur}
								placeholder="+7 (999) 123-45-67"
								size="sm"
								maxLength={18}
								error={contactFieldErrors.whatsapp || undefined}
							/>
						)}
					</Stack>
				</Card>

				{contactError && (
					<div className={s.contactError}>
						{contactError}
					</div>
				)}
			</div>
		</section>
	)
}
