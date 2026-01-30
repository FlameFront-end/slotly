import { type FC } from 'react'
import { Input } from '@/shared/kit'
import { SocialLinksSection } from '../SocialLinksSection'
import { TimezoneSection } from '../TimezoneSection'
import type { SocialLinksConfig } from '../../types'
import s from './AdditionalSection.module.scss'

interface Props {
	website: string
	socialLinksConfig: SocialLinksConfig
	timezone: string
	customTimezone: string
	isCustomTimezone: boolean
	onWebsiteChange: (value: string) => void
	onSocialLinksChange: (socialLinksConfig: SocialLinksConfig) => void
	onTimezoneChange: (value: string) => void
	onCustomTimezoneChange: (value: string) => void
	onIsCustomTimezoneChange: (value: boolean) => void
}

export const AdditionalSection: FC<Props> = ({
	website,
	socialLinksConfig,
	timezone,
	customTimezone,
	isCustomTimezone,
	onWebsiteChange,
	onSocialLinksChange,
	onTimezoneChange,
	onCustomTimezoneChange,
	onIsCustomTimezoneChange
}) => {
	return (
		<section className={s.section}>
			<h2 className={s.sectionTitle}>Дополнительно</h2>
			<div className={s.sectionContent}>
				<Input
					label="Веб-сайт"
					type="url"
					value={website}
					onChange={onWebsiteChange}
					placeholder="https://example.com"
				/>

				<SocialLinksSection
					socialLinksConfig={socialLinksConfig}
					onChange={onSocialLinksChange}
				/>

				<TimezoneSection
					timezone={timezone}
					customTimezone={customTimezone}
					isCustomTimezone={isCustomTimezone}
					onTimezoneChange={onTimezoneChange}
					onCustomTimezoneChange={onCustomTimezoneChange}
					onIsCustomTimezoneChange={onIsCustomTimezoneChange}
				/>
			</div>
		</section>
	)
}
