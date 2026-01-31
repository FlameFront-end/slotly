import { Component, type ErrorInfo, type ReactNode } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'

import { Button } from '@/shared/kit'

import s from '@/shared/styles/error-fallback.module.scss'

interface Props {
	children: ReactNode
}

interface State {
	hasError: boolean
	error?: Error
}

const CHUNK_LOAD_MESSAGES = [
	'Failed to fetch dynamically imported module',
	'Importing a module script failed',
	'Loading chunk',
	'ChunkLoadError',
]

function isChunkLoadError(error: Error): boolean {
	return CHUNK_LOAD_MESSAGES.some((msg) => error.message.includes(msg))
}

function getFriendlyTitle(error: Error): string {
	return isChunkLoadError(error) ? 'Не удалось загрузить страницу' : 'Произошла ошибка'
}

function getFriendlyDescription(error: Error): string {
	if (isChunkLoadError(error)) {
		return 'Вероятно, обновилась версия приложения или возникли проблемы с сетью. Обновите страницу — после этого всё должно заработать.'
	}
	return 'Что-то пошло не так. Попробуйте обновить страницу или вернуться на главную.'
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error('ErrorBoundary caught an error:', error, errorInfo)
	}

	render(): ReactNode {
		if (this.state.hasError && this.state.error) {
			const error = this.state.error
			const showDetail = !isChunkLoadError(error)

			return (
				<div className={s.wrap}>
					<div className={s.card}>
						<div className={s.icon}>
							<IconAlertTriangle stroke={1.75} />
						</div>
						<h1 className={s.title}>{getFriendlyTitle(error)}</h1>
						<p className={s.description}>{getFriendlyDescription(error)}</p>
						{showDetail && <pre className={s.detail}>{error.message}</pre>}
						<div className={s.actions}>
							<Button className={s.button} onClick={() => window.location.reload()}>
								Обновить страницу
							</Button>
							<Button
								className={s.button}
								variant="secondary"
								onClick={() => (window.location.href = '/')}
							>
								На главную
							</Button>
						</div>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}
