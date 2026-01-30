import { type FC } from 'react'
import { Stack, Group, Text, Anchor } from '@mantine/core'
import { IconMapPin, IconExternalLink, IconGlobe } from '@tabler/icons-react'
import { formatWebsiteUrl, formatWebsiteDisplay } from '@/shared/lib/formatting'
import s from './LocationInfo.module.scss'

interface Props {
	address?: string
	mapLink?: string
	website?: string
}

export const LocationInfo: FC<Props> = ({ address, mapLink, website }) => {
	if (!address && !mapLink && !website) return null
	
	return (
		<Stack gap="xs" mt="md" className={s.locationInfo}>
			{address && (
				<Group gap={6} className={s.address}>
					<IconMapPin size={16} stroke={1.5} />
					<Text size="sm" c="dimmed">{address}</Text>
				</Group>
			)}
			<Group gap="xs" wrap="wrap">
				{mapLink && (
					<Anchor
						href={mapLink}
						target="_blank"
						rel="noopener noreferrer"
						className={s.mapLink}
					>
						<IconExternalLink size={14} stroke={1.5} />
						<Text size="sm">Открыть на карте</Text>
					</Anchor>
				)}
				{website && (
					<Anchor
						href={formatWebsiteUrl(website)}
						target="_blank"
						rel="noopener noreferrer"
						className={s.websiteLink}
					>
						<IconGlobe size={14} stroke={1.5} />
						<Text size="sm">{formatWebsiteDisplay(website)}</Text>
					</Anchor>
				)}
			</Group>
		</Stack>
	)
}
