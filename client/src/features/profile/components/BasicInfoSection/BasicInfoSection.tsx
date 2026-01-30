import { type FC } from 'react'
import { Textarea } from '@mantine/core'
import { Input } from '@/shared/kit'
import s from './BasicInfoSection.module.scss'

interface Props {
	name: string
	description: string
	onNameChange: (value: string) => void
	onDescriptionChange: (value: string) => void
}

export const BasicInfoSection: FC<Props> = ({
	name,
	description,
	onNameChange,
	onDescriptionChange
}) => {
	return (
		<section className={s.section}>
			<h2 className={s.sectionTitle}>Основная информация</h2>
			<div className={s.sectionContent}>
				<Input
					label="Имя / Название"
					value={name}
					onChange={onNameChange}
					placeholder="Введите имя или название сервиса"
					required
				/>

				<Textarea
					label="Описание услуги"
					value={description}
					onChange={e => onDescriptionChange(e.target.value)}
					placeholder="Опишите вашу услугу подробно"
					autosize
					minRows={4}
					maxRows={20}
				/>
			</div>
		</section>
	)
}
