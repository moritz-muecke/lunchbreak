import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

/**
 * Custom render function that wraps components with common providers
 * Extend this as you add more providers (e.g., Redux, React Query, Theme, etc.)
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
