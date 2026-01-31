import { type FC, useState } from 'react'
import { Card, Stack, Group, Text, Button, Modal, ActionIcon, Badge } from '@mantine/core'
import { IconPlus, IconEdit, IconTrash, IconBriefcase } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

import { Layout } from '@/shared/widgets'
import { useServices, useDeleteService } from '@/shared/api/services/services'
import { type Service } from '@/shared/api/services/services/types'
import { ServiceForm } from '../components/ServiceForm'
import { EmptyState } from '@/shared/kit'

import s from './Services.module.scss'

const Services: FC = () => {
	const [opened, setOpened] = useState(false)
	const [editingService, setEditingService] = useState<Service | null>(null)
	const [deletingService, setDeletingService] = useState<Service | null>(null)
	const [deleteModalOpened, setDeleteModalOpened] = useState(false)

	const { data: services = [], isLoading } = useServices()
	const deleteServiceMutation = useDeleteService()

	const handleCreate = (): void => {
		setEditingService(null)
		setOpened(true)
	}

	const handleEdit = (service: Service): void => {
		setEditingService(service)
		setOpened(true)
	}

	const handleDeleteClick = (service: Service): void => {
		setDeletingService(service)
		setDeleteModalOpened(true)
	}

	const handleDeleteConfirm = async (): Promise<void> => {
		if (!deletingService) return

		try {
			await deleteServiceMutation.mutateAsync(deletingService.id)
			notifications.show({
				title: 'Успешно',
				message: 'Услуга удалена',
				color: 'green'
			})
			setDeleteModalOpened(false)
			setDeletingService(null)
		} catch (error) {
			notifications.show({
				title: 'Ошибка',
				message: 'Не удалось удалить услугу',
				color: 'red'
			})
		}
	}

	const handleFormClose = (): void => {
		setOpened(false)
		setEditingService(null)
	}

	const formatPrice = (price: number | null): string => {
		if (!price) return 'Бесплатно'
		return `${Math.round(price).toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽`
	}

	const formatDuration = (duration: number): string => {
		const hours = Math.floor(duration / 60)
		const minutes = duration % 60
		if (hours === 0) return `${minutes} мин`
		if (minutes === 0) return `${hours} ч`
		return `${hours} ч ${minutes} мин`
	}

	return (
		<Layout>
			<div className={s.services}>
				<div className={s.header}>
					<Group justify="space-between" align="center">
						<div>
							<h1 className={s.title}>Услуги</h1>
							<p className={s.subtitle}>Управление вашими услугами</p>
						</div>
						<Button
							leftSection={<IconPlus size={18} />}
							onClick={handleCreate}
							size="md"
						>
							Добавить услугу
						</Button>
					</Group>
				</div>

				{isLoading ? (
					<Card padding="xl" radius="md" withBorder className={s.serviceCard}>
						<Text c="dimmed" ta="center" py="md">Загрузка...</Text>
					</Card>
				) : services.length === 0 ? (
					<div className={s.emptyStateWrapper}>
						<EmptyState
							icon="📋"
							title="Нет услуг"
							description="Добавьте первую услугу, чтобы клиенты могли выбирать её при бронировании"
						/>
					</div>
				) : (
					<div className={s.cardsGrid}>
						{services.map((service) => (
							<Card key={service.id} padding="md" radius="md" withBorder className={s.serviceCard}>
								<Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
									<div className={s.serviceContent}>
										<div className={s.serviceHeader}>
											<div className={s.serviceIcon}>
												<IconBriefcase size={20} stroke={2} />
											</div>
											<Text className={s.serviceName}>
												{service.name}
											</Text>
											{!service.isActive && (
												<Badge color="gray" variant="light" size="sm" radius="md">
													Неактивна
												</Badge>
											)}
										</div>
										{service.description && (
											<Text className={s.serviceDescription}>
												{service.description}
											</Text>
										)}
										<div className={s.serviceMeta}>
											<span className={s.metaValue}>{formatDuration(service.duration)}</span>
											<span className={s.sep}>·</span>
											<span className={service.price ? s.metaValuePrice : s.metaValue}>
												{formatPrice(service.price)}
											</span>
										</div>
									</div>
									<Group gap="xs" className={s.serviceActions}>
										<ActionIcon
											variant="light"
											color="blue"
											size="lg"
											radius="md"
											onClick={() => handleEdit(service)}
											className={s.actionButton}
										>
											<IconEdit size={18} />
										</ActionIcon>
										<ActionIcon
											variant="light"
											color="red"
											size="lg"
											radius="md"
											onClick={() => handleDeleteClick(service)}
											className={s.actionButton}
										>
											<IconTrash size={18} />
										</ActionIcon>
									</Group>
								</Group>
							</Card>
						))}
					</div>
				)}

				<Modal
					opened={opened}
					onClose={handleFormClose}
					title={editingService ? 'Редактировать услугу' : 'Добавить услугу'}
					size="lg"
					centered
					styles={{
						title: {
							fontSize: '24px',
							fontWeight: 600,
							color: 'var(--text-primary)'
						},
						content: {
							backgroundColor: 'var(--bg-secondary)'
						},
						header: {
							backgroundColor: 'var(--bg-secondary)',
							borderBottom: '1px solid var(--border-color)'
						},
						body: {
							padding: '24px'
						}
					}}
				>
					<ServiceForm
						service={editingService}
						onSuccess={() => {
							handleFormClose()
							notifications.show({
								title: 'Успешно',
								message: editingService ? 'Услуга обновлена' : 'Услуга добавлена',
								color: 'green'
							})
						}}
						onCancel={handleFormClose}
					/>
				</Modal>

				<Modal
					opened={deleteModalOpened}
					onClose={() => {
						setDeleteModalOpened(false)
						setDeletingService(null)
					}}
					title="Удалить услугу?"
					centered
					styles={{
						title: {
							fontSize: '20px',
							fontWeight: 600,
							color: 'var(--text-primary)'
						},
						content: {
							backgroundColor: 'var(--bg-secondary)'
						},
						header: {
							backgroundColor: 'var(--bg-secondary)',
							borderBottom: '1px solid var(--border-color)'
						},
						body: {
							padding: '24px'
						}
					}}
				>
					<Stack gap="md">
						<Text>
							Вы уверены, что хотите удалить услугу &quot;{deletingService?.name}&quot;?
							Это действие нельзя отменить.
						</Text>
						<Group justify="flex-end" gap="sm">
							<Button
								variant="subtle"
								onClick={() => {
									setDeleteModalOpened(false)
									setDeletingService(null)
								}}
							>
								Отмена
							</Button>
							<Button
								color="red"
								onClick={handleDeleteConfirm}
								loading={deleteServiceMutation.isPending}
							>
								Удалить
							</Button>
						</Group>
					</Stack>
				</Modal>
			</div>
		</Layout>
	)
}

export const Component = Services
