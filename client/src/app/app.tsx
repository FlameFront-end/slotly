import { RouterProvider } from 'react-router-dom'

import { ErrorBoundary } from '@/shared/components/ErrorBoundary'

import { Providers } from './model/providers'
import { router } from './model/router'

export const App = () => {
  return (
    <ErrorBoundary>
      <Providers>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </Providers>
    </ErrorBoundary>
  )
}
