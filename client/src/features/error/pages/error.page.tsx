import { useRouteError } from 'react-router-dom'

import { Button } from '@/shared/kit'

const ErrorPage = () => {
	const error = useRouteError() as Error

	return (
		<div style={{ padding: '40px', textAlign: 'center' }}>
			<h1>Ошибка</h1>
			<p>{error?.message || 'Произошла неизвестная ошибка'}</p>
			<Button onClick={() => window.location.href = '/'}>
				Вернуться на главную
			</Button>
		</div>
	)
}

export default ErrorPage
