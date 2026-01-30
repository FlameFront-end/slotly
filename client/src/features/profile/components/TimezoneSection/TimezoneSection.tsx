import { type FC } from 'react'
import { Select } from '@mantine/core'
import { Input } from '@/shared/kit'
import { CUSTOM_TIMEZONE_VALUE, TIMEZONES } from '@/shared/model/timezones'

interface Props {
	timezone: string
	customTimezone: string
	isCustomTimezone: boolean
	onTimezoneChange: (value: string) => void
	onCustomTimezoneChange: (value: string) => void
	onIsCustomTimezoneChange: (value: boolean) => void
}

export const TimezoneSection: FC<Props> = ({
	timezone,
	customTimezone,
	isCustomTimezone,
	onTimezoneChange,
	onCustomTimezoneChange,
	onIsCustomTimezoneChange
}) => {
	return (
		<>
			<Select
				label="Часовой пояс"
				value={timezone}
				onChange={value => {
					const selectedValue = value || 'Europe/Moscow'
					const isCustom = selectedValue === CUSTOM_TIMEZONE_VALUE
					onTimezoneChange(selectedValue)
					onIsCustomTimezoneChange(isCustom)
					if (!isCustom) {
						onCustomTimezoneChange('')
					}
				}}
				data={TIMEZONES}
				searchable
				placeholder="Выберите часовой пояс"
			/>

			{isCustomTimezone && (
				<Input
					label="Введите часовой пояс вручную"
					value={customTimezone}
					onChange={onCustomTimezoneChange}
					placeholder="Например: America/New_York или UTC+5"
					description="Укажите часовой пояс в формате IANA (например, Europe/Moscow) или UTC смещение"
					required
				/>
			)}
		</>
	)
}
