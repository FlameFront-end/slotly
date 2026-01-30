import { type FC, useState } from 'react'
import { IconGlobe, IconEdit, IconX } from '@tabler/icons-react'
import { Input, Button } from '@/shared/kit'
import { SocialLinksSection } from '../SocialLinksSection'
import { TimezoneSection } from '../TimezoneSection'
import { formatWebsiteDisplay } from '@/shared/lib/formatting'
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
	const [isEditingWebsite, setIsEditingWebsite] = useState(!website.trim())

	return (
		<section className={s.section}>
			<h2 className={s.sectionTitle}>Дополнительно</h2>
			<div className={s.sectionContent}>
				<div className={s.websiteContainer}>
					{isEditingWebsite ? (
						<Input
							label="Веб-сайт"
							type="url"
							value={website}
							onChange={onWebsiteChange}
							onBlur={() => {
								if (website.trim()) {
									setIsEditingWebsite(false)
								}
							}}
							placeholder="https://example.com"
							leftSection={<IconGlobe size={18} />}
							rightSection={
								website && (
									<Button
										variant="subtle"
										size="xs"
										onClick={() => setIsEditingWebsite(false)}
										className={s.editButton}
									>
										<IconX size={16} />
									</Button>
								)
							}
						/>
					) : (
						<div className={s.websiteDisplay}>
							<label className={s.label}>Веб-сайт</label>
							<div className={s.websiteActions}>
								{website && (
									<a
										href={website.startsWith('http') ? website : `https://${website}`}
										target="_blank"
										rel="noopener noreferrer"
										className={s.websiteLink}
									>
										<IconGlobe size={16} />
										<span>{formatWebsiteDisplay(website)}</span>
									</a>
								)}
								<Button
									variant="subtle"
									size="xs"
									onClick={() => setIsEditingWebsite(true)}
									className={s.editButton}
								>
									<IconEdit size={16} />
								</Button>
							</div>
						</div>
					)}
				</div>

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
