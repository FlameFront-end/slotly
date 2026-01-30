import { QueryClient } from '@tanstack/react-query'

import { isAuthenticated } from '@/shared/lib'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			retry: 1,
			refetchOnWindowFocus: false,
			enabled: query => {
				const queryKey = query.queryKey
				const isAuthQuery = Array.isArray(queryKey)
					? queryKey[0] === 'auth'
					: typeof queryKey === 'string' && queryKey === 'auth'

				if (isAuthQuery) {
					return true
				}

				return isAuthenticated()
			}
		}
	}
})
