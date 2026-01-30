import { type FC } from 'react'
import { Card, Text, Stack, Group, Switch } from '@mantine/core'
import { IconBrandInstagram, IconBrandVk, IconBrandFacebook, IconBrandYoutube, IconBrandTiktok, IconWorld } from '@tabler/icons-react'
import { Input } from '@/shared/kit'
import type { SocialLinksConfig } from '../../types'
import s from './SocialLinksSection.module.scss'

interface Props {
	socialLinksConfig: SocialLinksConfig
	onChange: (socialLinksConfig: SocialLinksConfig) => void
}

export const SocialLinksSection: FC<Props> = ({
	socialLinksConfig,
	onChange
}) => {
	return (
		<div className={s.wrapper}>
			<Text size="sm" c="dimmed" mb="md">
				Выберите социальные сети, которые будут отображаться на вашей публичной странице
			</Text>

			<Card padding="md" radius="md" withBorder className={s.socialLinkCard}>
					<Stack gap="md">
						<Group justify="space-between" align="center">
							<Group gap="sm">
								<IconBrandInstagram size={20} />
								<Text fw={500}>Instagram</Text>
							</Group>
							<Switch
								checked={socialLinksConfig.instagram.enabled}
								onChange={e => onChange({
									...socialLinksConfig,
									instagram: { ...socialLinksConfig.instagram, enabled: e.currentTarget.checked }
								})}
							/>
						</Group>
						{socialLinksConfig.instagram.enabled && (
							<Input
								value={socialLinksConfig.instagram.value}
								onChange={value => {
									const instagramValue = value.startsWith('@') || value.startsWith('instagram.com/') || value.startsWith('https://')
										? value
										: value ? `@${value.replace('@', '')}` : ''
									onChange({
										...socialLinksConfig,
										instagram: { ...socialLinksConfig.instagram, value: instagramValue }
									})
								}}
								placeholder="@username или instagram.com/username"
								size="sm"
							/>
						)}
					</Stack>
				</Card>

				<Card padding="md" radius="md" withBorder className={s.socialLinkCard}>
					<Stack gap="md">
						<Group justify="space-between" align="center">
							<Group gap="sm">
								<IconBrandVk size={20} />
								<Text fw={500}>ВКонтакте</Text>
							</Group>
							<Switch
								checked={socialLinksConfig.vk.enabled}
								onChange={e => onChange({
									...socialLinksConfig,
									vk: { ...socialLinksConfig.vk, enabled: e.currentTarget.checked }
								})}
							/>
						</Group>
						{socialLinksConfig.vk.enabled && (
							<Input
								value={socialLinksConfig.vk.value}
								onChange={value => onChange({
									...socialLinksConfig,
									vk: { ...socialLinksConfig.vk, value }
								})}
								placeholder="vk.com/username или полная ссылка"
								size="sm"
							/>
						)}
					</Stack>
				</Card>

				<Card padding="md" radius="md" withBorder className={s.socialLinkCard}>
					<Stack gap="md">
						<Group justify="space-between" align="center">
							<Group gap="sm">
								<IconBrandFacebook size={20} />
								<Text fw={500}>Facebook</Text>
							</Group>
							<Switch
								checked={socialLinksConfig.facebook.enabled}
								onChange={e => onChange({
									...socialLinksConfig,
									facebook: { ...socialLinksConfig.facebook, enabled: e.currentTarget.checked }
								})}
							/>
						</Group>
						{socialLinksConfig.facebook.enabled && (
							<Input
								value={socialLinksConfig.facebook.value}
								onChange={value => onChange({
									...socialLinksConfig,
									facebook: { ...socialLinksConfig.facebook, value }
								})}
								placeholder="facebook.com/username или полная ссылка"
								size="sm"
							/>
						)}
					</Stack>
				</Card>

				<Card padding="md" radius="md" withBorder className={s.socialLinkCard}>
					<Stack gap="md">
						<Group justify="space-between" align="center">
							<Group gap="sm">
								<IconBrandYoutube size={20} />
								<Text fw={500}>YouTube</Text>
							</Group>
							<Switch
								checked={socialLinksConfig.youtube.enabled}
								onChange={e => onChange({
									...socialLinksConfig,
									youtube: { ...socialLinksConfig.youtube, enabled: e.currentTarget.checked }
								})}
							/>
						</Group>
						{socialLinksConfig.youtube.enabled && (
							<Input
								value={socialLinksConfig.youtube.value}
								onChange={value => onChange({
									...socialLinksConfig,
									youtube: { ...socialLinksConfig.youtube, value }
								})}
								placeholder="youtube.com/@username или полная ссылка"
								size="sm"
							/>
						)}
					</Stack>
				</Card>

				<Card padding="md" radius="md" withBorder className={s.socialLinkCard}>
					<Stack gap="md">
						<Group justify="space-between" align="center">
							<Group gap="sm">
								<IconBrandTiktok size={20} />
								<Text fw={500}>TikTok</Text>
							</Group>
							<Switch
								checked={socialLinksConfig.tiktok.enabled}
								onChange={e => onChange({
									...socialLinksConfig,
									tiktok: { ...socialLinksConfig.tiktok, enabled: e.currentTarget.checked }
								})}
							/>
						</Group>
						{socialLinksConfig.tiktok.enabled && (
							<Input
								value={socialLinksConfig.tiktok.value}
								onChange={value => {
									const tiktokValue = value.startsWith('@') || value.startsWith('tiktok.com/') || value.startsWith('https://')
										? value
										: value ? `@${value.replace('@', '')}` : ''
									onChange({
										...socialLinksConfig,
										tiktok: { ...socialLinksConfig.tiktok, value: tiktokValue }
									})
								}}
								placeholder="@username или tiktok.com/@username"
								size="sm"
							/>
						)}
					</Stack>
				</Card>

				<Card padding="md" radius="md" withBorder className={s.socialLinkCard}>
					<Stack gap="md">
						<Group justify="space-between" align="center">
							<Group gap="sm">
								<IconWorld size={20} />
								<Text fw={500}>Одноклассники</Text>
							</Group>
							<Switch
								checked={socialLinksConfig.ok.enabled}
								onChange={e => onChange({
									...socialLinksConfig,
									ok: { ...socialLinksConfig.ok, enabled: e.currentTarget.checked }
								})}
							/>
						</Group>
						{socialLinksConfig.ok.enabled && (
							<Input
								value={socialLinksConfig.ok.value}
								onChange={value => onChange({
									...socialLinksConfig,
									ok: { ...socialLinksConfig.ok, value }
								})}
								placeholder="ok.ru/username или полная ссылка"
								size="sm"
							/>
						)}
					</Stack>
				</Card>
		</div>
	)
}
