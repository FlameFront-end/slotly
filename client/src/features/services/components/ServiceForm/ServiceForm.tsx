import { type FC, useEffect } from 'react'
import { Stack, TextInput, Textarea, NumberInput, Switch, Group, Button } from '@mantine/core'
import { useForm } from '@mantine/form'

import { type Service } from '@/shared/api/services/services/types'
import { useCreateService, useUpdateService } from '@/shared/api/services/services'

import s from './ServiceForm.module.scss'

interface Props {
	service: Service | null
	onSuccess: () => void
	onCancel: () => void
}

export const ServiceForm: FC<Props> = ({ service, onSuccess, onCancel }) => {
	const createServiceMutation = useCreateService()
	const updateServiceMutation = useUpdateService()

	const form = useForm({
		initialValues: {
			name: '',
			description: '',
			duration: 60,
			price: undefined as number | undefined,
			isActive: true,
			order: 0
		},
		validate: {
			name: (value) => (!value ? 'Название обязательно' : null),
			duration: (value) => (value < 1 ? 'Длительность должна быть больше 0' : null),
			price: (value) => (value !== undefined && value < 0 ? 'Цена не может быть отрицательной' : null)
		}
	})

	useEffect(() => {
		if (service) {
			form.setValues({
				name: service.name,
				description: service.description || '',
				duration: service.duration,
				price: service.price ?? undefined,
				isActive: service.isActive,
				order: service.order
			})
		} else {
			form.reset()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [service])

	const handleSubmit = async (values: typeof form.values): Promise<void> => {
		try {
			if (service) {
				await updateServiceMutation.mutateAsync({
					id: service.id,
					...values,
					price: values.price ?? undefined
				})
			} else {
				await createServiceMutation.mutateAsync({
					...values,
					price: values.price ?? undefined
				})
			}
			onSuccess()
		} catch (error) {
			// Ошибка обрабатывается в хуке
		}
	}

	const isPending = createServiceMutation.isPending || updateServiceMutation.isPending

	return (
		<form onSubmit={form.onSubmit(handleSubmit)} className={s.form}>
			<Stack gap="lg">
				<TextInput
					label="Название услуги"
					placeholder="Например: Консультация"
					required
					size="md"
					radius="md"
					{...form.getInputProps('name')}
				/>

				<Textarea
					label="Описание"
					placeholder="Описание услуги (необязательно)"
					rows={4}
					size="md"
					radius="md"
					{...form.getInputProps('description')}
				/>

				<Group grow gap="md">
					<NumberInput
						label="Длительность (минуты)"
						placeholder="60"
						required
						min={1}
						size="md"
						radius="md"
						{...form.getInputProps('duration')}
					/>

					<NumberInput
						label="Цена (₽)"
						placeholder="Оставьте пустым"
						min={0}
						decimalScale={2}
						thousandSeparator=" "
						size="md"
						radius="md"
						{...form.getInputProps('price')}
					/>
				</Group>

				<Switch
					label="Активна"
					description="Неактивные услуги не будут отображаться клиентам"
					size="md"
					{...form.getInputProps('isActive', { type: 'checkbox' })}
				/>

				<Group justify="flex-end" gap="sm" className={s.actions}>
					<Button variant="subtle" onClick={onCancel} disabled={isPending} size="md">
						Отмена
					</Button>
					<Button type="submit" loading={isPending} size="md">
						{service ? 'Сохранить изменения' : 'Добавить услугу'}
					</Button>
				</Group>
			</Stack>
		</form>
	)
}
