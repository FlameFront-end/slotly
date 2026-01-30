import { useEffect, useRef } from 'react'
import { driver, type Driver } from 'driver.js'
import 'driver.js/dist/driver.css'

interface TourStep {
	element: string
	popover: {
		title: string
		description: string
		side?: 'left' | 'right' | 'top' | 'bottom'
		align?: 'start' | 'center' | 'end'
	}
}

export const useOnboardingTour = (steps: TourStep[], onComplete?: () => void) => {
	const driverObj = useRef<Driver | null>(null)

	useEffect(() => {
		if (steps.length === 0) return

		const driverInstance = driver({
			showProgress: true,
			showButtons: ['next', 'previous', 'close'],
			nextBtnText: 'Далее',
			prevBtnText: 'Назад',
			doneBtnText: 'Готово',
			progressText: 'Шаг {{current}} из {{total}}',
			steps: steps.map(step => ({
				element: step.element,
				popover: {
					title: step.popover.title,
					description: step.popover.description,
					side: step.popover.side || 'bottom',
					align: step.popover.align || 'start'
				}
			})),
			onDestroyStarted: () => {
				// Всегда разрешаем закрытие и выполняем callback
				driverInstance.destroy()
				if (onComplete) {
					onComplete()
				}
			}
		})

		driverObj.current = driverInstance

		return () => {
			if (driverObj.current) {
				driverObj.current.destroy()
			}
		}
	}, [steps, onComplete])

	const startTour = (): void => {
		if (driverObj.current && steps.length > 0) {
			driverObj.current.drive()
		}
	}

	return { startTour }
}
