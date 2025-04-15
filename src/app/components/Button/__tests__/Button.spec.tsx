import { IconArrowLeft } from '@tabler/icons-react'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../Button'

describe('Button component', () => {
  it('renders with default props', () => {
    render(<Button>Click Me</Button>)
    const button = screen.getByText('Click Me')
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-indigo-800 text-white')
  })

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Click Me</Button>)
    const button = screen.getByText('Click Me')
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-transparent text-white')
    expect(button).toHaveClass('border-2 border-solid border-gray-600/50')
    expect(button).not.toHaveClass('bg-indigo-800 text-white')
  })

  it('renders with onlyIcon and render the icon prop', () => {
    render(
      <Button
        onlyIcon
        icon={
          <IconArrowLeft data-testid="button-icon" color="white" size={20} />
        }
      >
        View Projects
      </Button>
    )
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('px-2! py-2')
    expect(button).not.toHaveTextContent('View Projects')
    const icon = screen.getByTestId('button-icon')
    expect(icon).toBeInTheDocument()
  })

  it('renders with disabled state', () => {
    const clickHandler = vi.fn()
    render(
      <Button disabled onClick={clickHandler}>
        Click Me
      </Button>
    )
    const button = screen.getByText('Click Me')
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('cursor-not-allowed! opacity-50')

    const user = userEvent.setup()
    user.click(button)
    expect(clickHandler).not.toHaveBeenCalled()
  })
})
