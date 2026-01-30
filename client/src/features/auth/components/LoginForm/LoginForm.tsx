import { type FC, type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { notifications } from '@mantine/notifications'
import { PasswordInput } from '@mantine/core'

import { useLogin } from '@/shared/api/services/auth'
import { Button, Input } from '@/shared/kit'
import { getErrorMessage } from '@/shared/lib'
import { setAuthData } from '@/shared/lib/auth'
import { ROUTES } from '@/shared/model/routes'

import s from '../../pages/Auth.module.scss'

interface Props {
	onShowRegister: () => void
}

export const LoginForm: FC<Props> = ({ onShowRegister }) => {
	const navigate = useNavigate()
	const loginMutation = useLogin()
	const isLoading = loginMutation.isPending

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState({
		email: '',
		password: ''
	})

	const validateField = (field: string, value: string): string => {
		switch (field) {
			case 'email':
				if (!value.trim()) return 'E-mail обязателен'
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Введите корректный E-mail'
				break
			case 'password':
				if (!value.trim()) return 'Пароль обязателен'
				break
			default:
				return ''
		}
		return ''
	}

	const handleBlur = (field: string, value: string): void => {
		const errorMessage = validateField(field, value)
		setErrors(prev => ({ ...prev, [field]: errorMessage }))
	}

	const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault()

		const newErrors = {
			email: validateField('email', email),
			password: validateField('password', password)
		}
		setErrors(newErrors)

		const hasErrors = Object.values(newErrors).some(error => error)
		if (hasErrors) return

		try {
			const response = await loginMutation.mutateAsync({
				email,
				password
			})

			setAuthData({
				accessToken: response.access_token,
				refreshToken: response.refresh_token
			})

			navigate(ROUTES.DASHBOARD)
		} catch (error: unknown) {
			const message = getErrorMessage(error)
			notifications.show({
				title: 'Ошибка',
				message,
				color: 'red'
			})
		}
	}

	return (
		<form className={s.form} onSubmit={handleLogin}>
			<Input
				label="E-mail"
				type="email"
				value={email}
				onChange={setEmail}
				onBlur={() => handleBlur('email', email)}
				error={errors.email}
				placeholder="Введите e-mail"
				disabled={isLoading}
			/>

			<PasswordInput
				label="Пароль"
				value={password}
				onChange={e => setPassword(e.target.value)}
				onBlur={() => handleBlur('password', password)}
				error={errors.password}
				placeholder="Введите пароль"
				disabled={isLoading}
			/>

			<Button type="submit" disabled={isLoading} fullWidth>
				{isLoading ? 'Вход...' : 'Войти'}
			</Button>

			<div className={s.switch}>
				<p className={s.switchText}>
					Нет аккаунта?{' '}
					<button type="button" onClick={onShowRegister} className={s.switchLink}>
						Зарегистрироваться
					</button>
				</p>
			</div>
		</form>
	)
}
