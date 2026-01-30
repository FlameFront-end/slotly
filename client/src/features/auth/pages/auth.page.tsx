import { type FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/model/routes'

import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'
import s from './Auth.module.scss'

const Auth: FC = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const activeTab = location.pathname === ROUTES.REGISTER ? 'register' : 'login'

	const handleTabChange = (tab: 'login' | 'register'): void => {
		if (tab === 'login') {
			navigate(ROUTES.LOGIN, { replace: true })
		} else {
			navigate(ROUTES.REGISTER, { replace: true })
		}
	}

	return (
		<div className={s.auth}>
			<div className={s.card}>
				<div className={s.header}>
					<div className={s.logo}>
						<span className={s.logoText}>Slotly</span>
					</div>
					<div className={s.titleWrapper}>
						<h1 key={`title-${activeTab}`} className={s.title}>
							{activeTab === 'login' ? 'Добро пожаловать' : 'Создать аккаунт'}
						</h1>
					</div>
					<div className={s.subtitleWrapper}>
						<p key={`subtitle-${activeTab}`} className={s.subtitle}>
							{activeTab === 'login'
								? 'Войдите в свой аккаунт для продолжения'
								: 'Зарегистрируйтесь, чтобы начать работу'}
						</p>
					</div>
				</div>

				<div className={s.formContainer}>
					<div
						className={`${s.formWrapper} ${
							activeTab === 'login' ? s.formActive : s.formExit
						}`}
					>
						<LoginForm onShowRegister={() => handleTabChange('register')} />
					</div>
					<div
						className={`${s.formWrapper} ${
							activeTab === 'register' ? s.formActive : s.formExit
						}`}
					>
						<RegisterForm onShowLogin={() => handleTabChange('login')} />
					</div>
				</div>
			</div>
		</div>
	)
}

export const Component = Auth
