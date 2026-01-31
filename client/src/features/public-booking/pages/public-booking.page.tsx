import { type FC } from 'react'
import { Card, Text, Group } from '@mantine/core'
import { IconBuilding } from '@tabler/icons-react'

import { Loader, EmptyState } from '@/shared/kit'
import { LocationInfo } from '@/shared/components/LocationInfo'
import { usePublicBooking } from '../hooks/usePublicBooking'
import { OwnerCard } from '../components/OwnerCard'
import { BookingForm } from '../components/BookingForm'

import s from './PublicBooking.module.scss'

const PublicBooking: FC = () => {
	const {
		ownerProfile,
		slots,
		isLoading,
		selectedDate,
		setSelectedDate,
		selectedTime,
		setSelectedTime,
		clientName,
		setClientName,
		selectedContactMethod,
		setSelectedContactMethod,
		clientContact,
		setClientContact,
		contactError,
		isDescriptionExpanded,
		setIsDescriptionExpanded,
		availableDates,
		availableTimes,
		availableTimesWithEnd,
		availableContactMethods,
		enabledSocialLinks,
		handleContactBlur,
		handleSubmit,
		isPending
	} = usePublicBooking()

	if (isLoading) {
		return (
			<div className={s.publicBooking}>
				<div className={s.container}>
					<Loader message="Загрузка..." size="lg" />
				</div>
			</div>
		)
	}

	if (!ownerProfile) {
		return (
			<div className={s.publicBooking}>
				<div className={s.container}>
					<EmptyState
						icon="❌"
						title="Профиль не найден"
						description="К сожалению, запрашиваемый профиль не существует."
					/>
				</div>
			</div>
		)
	}

	if (!slots || slots.length === 0) {
		return (
			<div className={s.publicBooking}>
				<div className={s.container}>
					{ownerProfile && (
						<OwnerCard
							name={ownerProfile.name}
							description={ownerProfile.description}
							address={ownerProfile.address}
							mapLink={ownerProfile.mapLink}
							website={ownerProfile.website}
							socialLinks={[]}
							isDescriptionExpanded={false}
							onToggleDescription={() => {}}
						/>
					)}
					<EmptyState
						icon="📅"
						title="Нет доступного времени"
						description="К сожалению, на данный момент нет свободных слотов для записи. Попробуйте позже."
					/>
				</div>
			</div>
		)
	}

	if (availableContactMethods.length === 0) {
		return (
			<div className={s.publicBooking}>
				<div className={s.container}>
					{ownerProfile && (
						<OwnerCard
							name={ownerProfile.name}
							description={ownerProfile.description}
							address={ownerProfile.address}
							mapLink={ownerProfile.mapLink}
							website={ownerProfile.website}
							socialLinks={enabledSocialLinks}
							isDescriptionExpanded={isDescriptionExpanded}
							onToggleDescription={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
						/>
					)}
					<EmptyState
						icon="📞"
						title="Способы связи не настроены"
						description="К сожалению, владелец не настроил способы связи. Свяжитесь с ним напрямую."
					/>
				</div>
			</div>
		)
	}

	return (
		<div className={s.publicBooking}>
			<div className={s.container}>
				{ownerProfile && (
					<OwnerCard
						name={ownerProfile.name}
						description={ownerProfile.description}
						address={ownerProfile.address}
						mapLink={ownerProfile.mapLink}
						website={ownerProfile.website}
						socialLinks={enabledSocialLinks}
						isDescriptionExpanded={isDescriptionExpanded}
						onToggleDescription={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
					/>
				)}

				<Text fw={600} size="xl" className={s.title}>Запись на приём</Text>

				<BookingForm
					selectedDate={selectedDate}
					selectedTime={selectedTime}
					clientName={clientName}
					selectedContactMethod={selectedContactMethod}
					clientContact={clientContact}
					contactError={contactError}
					availableDates={availableDates}
					availableTimes={availableTimes}
					availableTimesWithEnd={availableTimesWithEnd}
					availableContactMethods={availableContactMethods}
					onDateChange={setSelectedDate}
					onTimeChange={setSelectedTime}
					onNameChange={setClientName}
					onContactMethodChange={value => {
						setSelectedContactMethod(value)
						setClientContact('')
					}}
					onContactChange={setClientContact}
					onContactBlur={handleContactBlur}
					onSubmit={handleSubmit}
					isPending={isPending}
				/>
			</div>
		</div>
	)
}

export const Component = PublicBooking
