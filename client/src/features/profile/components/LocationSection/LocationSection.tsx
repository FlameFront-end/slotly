import { type FC, useState } from 'react'
import { IconMapPin, IconExternalLink, IconEdit, IconX } from '@tabler/icons-react'
import { Input, Button } from '@/shared/kit'
import s from './LocationSection.module.scss'

interface Props {
	address: string
	mapLink: string
	onAddressChange: (value: string) => void
	onMapLinkChange: (value: string) => void
}

const formatMapLinkDisplay = (url: string): string => {
	if (!url) return ''
	try {
		const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
		if (urlObj.hostname.includes('yandex')) return 'Яндекс.Карты'
		if (urlObj.hostname.includes('google')) return 'Google Maps'
		return urlObj.hostname.replace('www.', '')
	} catch {
		return url.length > 30 ? `${url.substring(0, 30)}...` : url
	}
}

export const LocationSection: FC<Props> = ({
	address,
	mapLink,
	onAddressChange,
	onMapLinkChange
}) => {
	const [isEditingMapLink, setIsEditingMapLink] = useState(!mapLink.trim())

	return (
		<section className={s.section}>
			<h2 className={s.sectionTitle}>Местоположение</h2>
			<div className={s.sectionContent}>
				<Input
					label="Адрес"
					value={address}
					onChange={onAddressChange}
					placeholder="Город, улица, дом"
					description="Укажите адрес вашей организации"
					leftSection={<IconMapPin size={18} />}
				/>

				<div className={s.mapLinkContainer}>
					{isEditingMapLink ? (
						<Input
							label="Ссылка на карты"
							type="url"
							value={mapLink}
							onChange={onMapLinkChange}
							onBlur={() => {
								if (mapLink.trim()) {
									setIsEditingMapLink(false)
								}
							}}
							placeholder="https://yandex.ru/maps/... или https://maps.google.com/..."
							description="Ссылка на Google Maps, Яндекс.Карты или другую картографическую службу"
							leftSection={<IconExternalLink size={18} />}
							rightSection={
								mapLink && (
									<Button
										variant="subtle"
										size="xs"
										onClick={() => setIsEditingMapLink(false)}
										className={s.editButton}
									>
										<IconX size={16} />
									</Button>
								)
							}
						/>
					) : (
						<div className={s.mapLinkDisplay}>
							<label className={s.label}>Ссылка на карты</label>
							<div className={s.mapLinkActions}>
								{mapLink && (
									<a
										href={mapLink}
										target="_blank"
										rel="noopener noreferrer"
										className={s.mapLinkButton}
									>
										<IconExternalLink size={16} />
										<span>{formatMapLinkDisplay(mapLink)}</span>
									</a>
								)}
								<Button
									variant="subtle"
									size="xs"
									onClick={() => setIsEditingMapLink(true)}
									className={s.editButton}
								>
									<IconEdit size={16} />
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
