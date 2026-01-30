import { type FC } from 'react'
import { IconMapPin, IconExternalLink } from '@tabler/icons-react'
import { Input } from '@/shared/kit'
import s from './LocationSection.module.scss'

interface Props {
	address: string
	mapLink: string
	onAddressChange: (value: string) => void
	onMapLinkChange: (value: string) => void
}

export const LocationSection: FC<Props> = ({
	address,
	mapLink,
	onAddressChange,
	onMapLinkChange
}) => {
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

				<Input
					label="Ссылка на карты"
					type="url"
					value={mapLink}
					onChange={onMapLinkChange}
					placeholder="https://yandex.ru/maps/... или https://maps.google.com/..."
					description="Ссылка на Google Maps, Яндекс.Карты или другую картографическую службу"
					leftSection={<IconExternalLink size={18} />}
				/>
			</div>
		</section>
	)
}
