import { useRouteError } from 'react-router-dom'
import { IconAlertTriangle } from '@tabler/icons-react'

import { Button } from '@/shared/kit'

import s from '@/shared/styles/error-fallback.module.scss'

const CHUNK_LOAD_MESSAGES = [
	'Failed to fetch dynamically imported module',
	'Importing a module script failed',
	'Loading chunk',
	'ChunkLoadError',
]

function isChunkLoadError(error: unknown): boolean {
	const message = error instanceof Error ? error.message : String(error)
	return CHUNK_LOAD_MESSAGES.some((msg) => message.includes(msg))
}

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) return error.message
	if (typeof error === 'object' && error !== null && 'statusText' in error) {
		const e = error as { statusText?: string; status?: number }
		return e.statusText || `Ошибка ${e.status ?? ''}`.trim()
	}
	return String(error)
}

function getFriendlyTitle(error: unknown): string {
	if (isChunkLoadError(error)) {
		return 'Не удалось загрузить страницу'
	}
	return 'Произошла ошибка'
}

function getFriendlyDescription(error: unknown): string {
	if (isChunkLoadError(error)) {
		return 'Вероятно, обновилась версия приложения или возникли проблемы с сетью. Обновите страницу — после этого всё должно заработать.'
	}
	return 'Что-то пошло не так. Попробуйте обновить страницу или вернуться на главную.'
}

const ErrorPage = () => {
	const error = useRouteError()
	const message = getErrorMessage(error)
	const showDetail = message && !isChunkLoadError(error)

	return (
		<div className={s.wrap}>
			<div className={s.card}>
				<div className={s.icon}>
					<IconAlertTriangle stroke={1.75} />
				</div>
				<h1 className={s.title}>{getFriendlyTitle(error)}</h1>
				<p className={s.description}>{getFriendlyDescription(error)}</p>
				{showDetail && <pre className={s.detail}>{message}</pre>}
				<div className={s.actions}>
					<Button className={s.button} onClick={() => window.location.reload()}>
						Обновить страницу
					</Button>
					<Button className={s.button} variant="secondary" onClick={() => (window.location.href = '/')}>
						На главную
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ErrorPage
