import { type FC, type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { notifications } from '@mantine/notifications'
import { PasswordInput } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'

import { useRegister, useLogin } from '@/shared/api/services/auth'
import { Button, Input } from '@/shared/kit'
import { getErrorMessage } from '@/shared/lib'
import { setAuthData } from '@/shared/lib/auth'
import { ROUTES } from '@/shared/model/routes'

import s from '../../pages/Auth.module.scss'

interface Props {
	onShowLogin: () => void
}

export const RegisterForm: FC<Props> = ({ onShowLogin }) => {
	const navigate = useNavigate()
	const registerMutation = useRegister()
	const loginMutation = useLogin()
	const isLoading = registerMutation.isPending || loginMutation.isPending

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState({
		name: '',
		email: '',
		password: ''
	})

	const validateField = (field: string, value: string): string => {
		switch (field) {
			case 'name':
				if (!value.trim()) return 'Имя обязательно'
				break
			case 'email':
				if (!value.trim()) return 'E-mail обязателен'
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Введите корректный E-mail'
				break
			case 'password':
				if (!value.trim()) return 'Пароль обязателен'
				if (value.length < 8) return 'Пароль должен содержать минимум 8 символов'
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

	const handleRegister = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault()

		const newErrors = {
			name: validateField('name', name),
			email: validateField('email', email),
			password: validateField('password', password)
		}
		setErrors(newErrors)

		const hasErrors = Object.values(newErrors).some(error => error)
		if (hasErrors) return

		try {
			// Регистрация
			await registerMutation.mutateAsync({
				name,
				email,
				password
			})

			// Автоматический логин после регистрации
			try {
				const loginResponse = await loginMutation.mutateAsync({
					email,
					password
				})

				setAuthData({
					accessToken: loginResponse.access_token,
					refreshToken: loginResponse.refresh_token
				})

				// Сохраняем флаг для показа модалки на dashboard
				sessionStorage.setItem('showTrialModal', 'true')

				// Переходим на dashboard
				navigate(ROUTES.DASHBOARD)
			} catch (loginError: unknown) {
				// Если логин не удался, перенаправляем на страницу входа
				notifications.show({
					title: 'Регистрация успешна',
					message: 'Пожалуйста, войдите в систему',
					color: 'green'
				})
				navigate(ROUTES.LOGIN)
			}
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
		<form className={s.form} onSubmit={handleRegister}>
			<div className={s.demoAlert}>
				<IconInfoCircle size={16} className={s.demoIcon} />
				<div className={s.demoContent}>
					<span className={s.demoText}>
						<strong>7 дней</strong> бесплатного доступа после регистрации
					</span>
				</div>
			</div>

			<Input
				label="Имя"
				type="text"
				value={name}
				onChange={setName}
				onBlur={() => handleBlur('name', name)}
				error={errors.name}
				placeholder="Введите имя"
				disabled={isLoading}
			/>

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
				{isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
			</Button>

			<div className={s.switch}>
				<p className={s.switchText}>
					Уже есть аккаунт?{' '}
					<button type="button" onClick={onShowLogin} className={s.switchLink}>
						Войти
					</button>
				</p>
			</div>
		</form>
	)
}
