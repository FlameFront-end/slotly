import { type Service } from '@/shared/api/services/services/types'

/**
 * Форматирует длительность услуги в читаемый формат
 * @param duration - длительность в минутах
 * @returns строка вида "1 ч 30 мин", "45 мин" или "2 ч"
 */
export const formatServiceDuration = (duration: number): string => {
	const hours = Math.floor(duration / 60)
	const minutes = duration % 60
	
	if (hours === 0) {
		return `${minutes} мин`
	}
	if (minutes === 0) {
		return `${hours} ч`
	}
	return `${hours} ч ${minutes} мин`
}

/**
 * Форматирует цену услуги
 * @param price - цена в рублях
 * @returns отформатированная цена с символом рубля
 */
export const formatServicePrice = (price: number): string => {
	return `${Math.round(price).toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽`
}

/**
 * Форматирует полную метку услуги для отображения в селектах
 * @param service - объект услуги
 * @returns строка вида "Название · 1 ч 30 мин · 1 000 ₽"
 */
export const formatServiceLabel = (service: Service): string => {
	const parts = [service.name]
	
	if (service.duration) {
		parts.push(formatServiceDuration(service.duration))
	}
	
	if (service.price) {
		parts.push(formatServicePrice(service.price))
	}
	
	return parts.join(' · ')
}

/**
 * Создает опции для Select из списка услуг
 * @param services - массив услуг
 * @returns массив опций для Select
 */
export const createServiceSelectOptions = (services: Service[]) => {
	return services.map(service => ({
		value: service.id,
		label: formatServiceLabel(service)
	}))
}

/**
 * Фильтрует активные услуги
 * @param services - массив услуг
 * @returns массив активных услуг
 */
export const getActiveServices = (services: Service[]): Service[] => {
	return services.filter(service => service.isActive)
}
