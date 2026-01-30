import { type ReactNode } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider, createTheme } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import 'dayjs/locale/ru'

import { queryClient } from '@/shared/api/queryClient'

const theme = createTheme({
	primaryColor: 'blue',
	defaultRadius: 'md',
	fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
})

interface ProvidersProps {
	children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
	return (
		<MantineProvider theme={theme} defaultColorScheme="dark">
			<DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }}>
				<QueryClientProvider client={queryClient}>
					{children}
					<Notifications position="top-right" />
				</QueryClientProvider>
			</DatesProvider>
		</MantineProvider>
	)
}
