import '@testing-library/jest-dom/vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Navbar } from '../Navbar'

describe('Navbar component', () => {
  it('renders the Navbar component', () => {
    render(<Navbar />)
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Articles')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('highlights the selected link', async () => {
    await act(async () => {
      render(<Navbar />)
    })
    const aboutLink = screen.getByText('About')
    aboutLink.click()
    expect(aboutLink).toHaveClass('text-gray-200')
  })
  it('renders the underline for the selected link', async () => {
    await act(async () => {
      render(<Navbar />)
    })
    const aboutLink = screen.getByTestId('link-about-section')
    aboutLink.click()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByTestId('underline')).toBeInTheDocument()
    expect(screen.getByTestId('underline').parentElement).toBe(aboutLink)
  })
  it('does not render the underline for unselected links', async () => {
    await act(async () => {
      render(<Navbar />)
    })
    const projectsLink = screen.getByTestId('link-projects-section')
    expect(screen.queryByTestId('underline')).toBeInTheDocument()
    expect(screen.getByTestId('underline').parentElement).not.toBe(projectsLink)

    waitFor(() => {
      expect(screen.getByTestId('underline').parentElement).toBe(projectsLink)
    })
  })
})
