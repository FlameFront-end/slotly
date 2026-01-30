import { type FC, type ReactNode, type MouseEventHandler } from 'react'

import { Button as MantineButton, type ButtonProps as MantineButtonProps } from '@mantine/core'

type ButtonVariant = 'filled' | 'light' | 'outline' | 'subtle' | 'default' | 'gradient'

interface ButtonProps extends Omit<MantineButtonProps, 'variant'> {
	children: ReactNode
	variant?: ButtonVariant | 'primary' | 'secondary' | 'danger'
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	fullWidth?: boolean
	type?: 'button' | 'submit' | 'reset'
	onClick?: MouseEventHandler<HTMLButtonElement>
}

export const Button: FC<ButtonProps> = ({
	children,
	variant = 'primary',
	size = 'md',
	fullWidth = false,
	...props
}) => {
	const mantineVariant: ButtonVariant =
		variant === 'primary'
			? 'filled'
			: variant === 'secondary'
				? 'outline'
				: variant === 'danger'
					? 'filled'
					: (variant as ButtonVariant)

	return (
		<MantineButton
			variant={mantineVariant}
			size={size}
			fullWidth={fullWidth}
			color={variant === 'danger' ? 'red' : variant === 'secondary' ? 'gray' : 'blue'}
			{...props}
		>
			{children}
		</MantineButton>
	)
}
