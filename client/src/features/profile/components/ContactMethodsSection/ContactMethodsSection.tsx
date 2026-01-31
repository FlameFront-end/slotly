import { type FC } from 'react'
import { Card, Text, Group, Switch, Alert } from '@mantine/core'
import { IconBrandTelegram, IconMail, IconPhone, IconBrandWhatsapp, IconAlertCircle } from '@tabler/icons-react'
import type { ContactMethods } from '../../types'
import s from './ContactMethodsSection.module.scss'

interface Props {
	contactMethods: ContactMethods
	contactError: string
	onChange: (contactMethods: ContactMethods) => void
}

export const ContactMethodsSection: FC<Props> = ({
	contactMethods,
	contactError,
	onChange
}) => {
	return (
		<section className={s.section} data-has-error={contactError ? '' : undefined}>
			<h2 className={s.sectionTitle}>Какие контакты принимать от клиентов при записи</h2>
			<div className={s.sectionContent}>
				<Text size="sm" c="dimmed" mb="md">
					Включите способы связи, которые клиент сможет указать при записи. Свои контакты указывать не нужно — клиент введёт свой Telegram, email или телефон.
				</Text>

				{contactError && (
					<Alert
						icon={<IconAlertCircle size={20} />}
						title="Обратите внимание"
						color="red"
						variant="light"
						className={s.contactAlert}
					>
						{contactError}
					</Alert>
				)}

				<Card padding="md" radius="md" withBorder className={s.contactMethodCard}>
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
				</Card>

				<Card padding="md" radius="md" withBorder className={s.contactMethodCard}>
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
				</Card>

				<Card padding="md" radius="md" withBorder className={s.contactMethodCard}>
					<Group justify="space-between" align="center">
						<Group gap="sm">
							<IconPhone size={20} />
							<Text fw={500}>Телефон</Text>
						</Group>
						<Switch
							checked={contactMethods.phone.enabled}
							onChange={e => onChange({
								...contactMethods,
								phone: { ...contactMethods.phone, enabled: e.currentTarget.checked }
							})}
						/>
					</Group>
				</Card>

				<Card padding="md" radius="md" withBorder className={s.contactMethodCard}>
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
				</Card>
			</div>
		</section>
	)
}
