import s from './FullScreenLoader.module.scss'

export const FullScreenLoader = () => {
	return (
		<div className={s.loader}>
			<div className={s.spinner} />
		</div>
	)
}
