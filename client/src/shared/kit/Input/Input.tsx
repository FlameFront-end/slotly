import { type FC } from 'react'

import { TextInput, type TextInputProps } from '@mantine/core'

interface InputProps extends Omit<TextInputProps, 'onChange'> {
	onChange?: (value: string) => void
}

export const Input: FC<InputProps> = ({ onChange, ...props }) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		onChange?.(e.target.value)
	}

	return <TextInput {...props} onChange={handleChange} />
}
